import { execSync } from 'child_process';
import chalk from 'chalk';

interface Options {
  method?: string;
  body?: string;
  retries?: string;
  delay?: string;
  headers?: string;
  output?: string;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(url: string, options: Options): Promise<{ status: number; body: string; time: number }> {
  const method = options.method || 'GET';
  const start = Date.now();

  try {
    const cmd = `curl -s -w "\\n%{http_code}" -X ${method} ${options.body ? `-d '${options.body}' ` : ''}${options.headers ? options.headers.split(',').map((h: string) => `-H '${h}'`).join(' ') + ' ' : ''}"${url}"`;
    const output = execSync(cmd, { encoding: 'utf-8', maxBuffer: 1024 * 1024 });
    const parts = output.trim().split('\n');
    const status = parseInt(parts.pop() || '0');
    const body = parts.join('\n');
    return { status, body, time: Date.now() - start };
  } catch (err: any) {
    return { status: 0, body: err.message, time: Date.now() - start };
  }
}

export async function tap(url: string, options: Options) {
  const retries = parseInt(options.retries || '3');
  const delay = parseInt(options.delay || '1000');
  let lastResult: { status: number; body: string; time: number } | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const result = await request(url, options);
    lastResult = result;

    const color = result.status >= 200 && result.status < 300 ? 'green' : result.status >= 400 ? 'red' : 'yellow';
    const prefix = attempt > 1 ? `[retry ${attempt}] ` : '';

    console.log(chalk.cyan(`${prefix}${options.method || 'GET'} ${url}`));
    console.log(`  Status: ${(chalk as any)[color](String(result.status))} (${result.time}ms)`);

    if (result.status >= 200 && result.status < 300) {
      if (result.body) {
        if (options.output) {
          try {
            require('fs').writeFileSync(options.output, result.body);
            console.log(`  Body saved to ${options.output}`);
          } catch (err: any) {
            console.error(chalk.red(`  Failed to save body to ${options.output}: ${err.message}`));
          }
        } else {
          try {
            const json = JSON.parse(result.body);
            console.log(`  Body: ${chalk.gray(JSON.stringify(json, null, 2).substring(0, 500))}`);
          } catch {
            console.log(`  Body: ${chalk.gray(result.body.substring(0, 500))}`);
          }
        }
      }
      return;
    }

    if (attempt < retries) {
      const wait = delay * Math.pow(2, attempt - 1);
      console.log(chalk.yellow(`  Failed. Retrying in ${wait}ms...`));
      await sleep(wait);
    }
  }

  console.log(chalk.red(`\nAll retries failed. Last response:`));
  console.log(chalk.gray(lastResult?.body || ''));
  process.exit(1);
}

export async function diff(url1: string, url2: string, options: Options) {
  const [r1, r2] = await Promise.all([request(url1, options), request(url2, options)]);

  const sc = (s: number) => s >= 200 && s < 300 ? 'green' : s >= 400 ? 'red' : 'yellow';

  console.log(chalk.cyan('Comparing:'));
  console.log(`  ${chalk.white(url1)} → ${(chalk as any)[sc(r1.status)](String(r1.status))}`);
  console.log(`  ${chalk.white(url2)} → ${(chalk as any)[sc(r2.status)](String(r2.status))}`);

  if (r1.body === r2.body) {
    console.log(chalk.green('\nBodies are identical'));
  } else {
    console.log(chalk.yellow('\nBodies differ:'));
    const j1 = tryParse(r1.body);
    const j2 = tryParse(r2.body);
    if (j1 && j2) {
      console.log(chalk.gray('Left:'));
      console.log(chalk.gray(JSON.stringify(j1, null, 2).substring(0, 300)));
      console.log(chalk.gray('Right:'));
      console.log(chalk.gray(JSON.stringify(j2, null, 2).substring(0, 300)));
    } else {
      console.log(chalk.gray(`Left: ${r1.body.substring(0, 200)}`));
      console.log(chalk.gray(`Right: ${r2.body.substring(0, 200)}`));
    }
  }
}

function tryParse(body: string) {
  try { return JSON.parse(body); } catch { return null; }
}