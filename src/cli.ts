#!/usr/bin/env node
import { Command } from 'commander';
import { tap, diff } from './lib/tap.js';

const program = new Command();

program
  .name('httptap')
  .description('HTTP testing with retry/backoff, formatted JSON diff output')
  .version('1.0.0');

program
  .command('tap <url>')
  .description('Send HTTP request with retry')
  .option('-m, --method <method>', 'HTTP method', 'GET')
  .option('-b, --body <body>', 'Request body')
  .option('-H, --headers <headers>', 'Headers (comma-separated)')
  .option('-r, --retries <n>', 'Number of retries', '3')
  .option("-d, --delay <ms>", "Initial delay between retries", "1000")
  .option("-o, --output <file>", "Save response body to file")
  .action(tap);

program
  .command('diff <url1> <url2>')
  .description('Compare responses from two URLs')
  .option('-m, --method <method>', 'HTTP method', 'GET')
  .option('-b, --body <body>', 'Request body')
  .action(diff);

program.parse();