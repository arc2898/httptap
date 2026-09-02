# 🚰 HttpTap

**HttpTap** is a specialized CLI tool for HTTP API testing and debugging. It goes beyond simple `curl` by providing built-in retry logic with exponential backoff, color-coded status reporting, and a powerful side-by-side JSON diffing engine.

---

## 🚀 Key Features

- **🔄 Resilient Requests**: Automatic retries with exponential backoff to handle flaky endpoints.
- **⚖️ Side-by-Side Diff**: Compare responses from two different URLs (e.g., Staging vs. Production) with highlighted JSON differences.
- **🎨 Visual Status**: Instant feedback with color-coded HTTP status codes and formatted headers.
- **📦 Body Parsing**: Automatic pretty-printing of JSON response bodies for better readability.
- **🛠 Header Management**: Simple comma-separated syntax for passing multiple custom headers.

---

## 📦 Installation

Install globally via npm:

```bash
npm install -g @arc2898/httptap
```

---

## 🛠 Usage Guide

### 1. Basic Request with Retries
Perform a GET request that automatically retries up to 3 times on failure.

```bash
httptap tap https://api.example.com/data
```

### 2. Custom POST Request
Send JSON data with custom headers and a specific retry count.

```bash
httptap tap https://api.example.com/users \
  -m POST \
  -b '{"name":"Manus User"}' \
  -H "Authorization:Bearer TOKEN,X-Custom:Value" \
  -r 5 -d 2000
```

### 3. Response Diffing
Compare two endpoints to identify regression or environmental differences.

```bash
httptap diff https://v1.api.com/user/1 https://v2.api.com/user/1
```

---

## 📋 CLI Options

| Flag | Short | Description | Default |
| :--- | :--- | :--- | :--- |
| `--method` | `-m` | HTTP Method (GET, POST, etc.) | `GET` |
| `--body` | `-b` | Request body string | `None` |
| `--headers` | `-H` | Comma-separated headers | `None` |
| `--retries` | `-r` | Number of retry attempts | `3` |
| `--delay` | `-d` | Initial retry delay in ms | `1000` |

---

## Development

Install dependencies, compile the CLI, and run the library tests locally with:

```bash
npm ci
npm run build
npm test
```

Use a test endpoint or a local HTTP server when manually checking retry and response-diff behavior.

## 🤝 Contributing

We welcome all contributions! Please feel free to open issues or submit PRs to enhance HttpTap.

## 📄 License

This project is licensed under the **MIT License**.

---
*Maintained by [@arc2898](https://github.com/arc2898)*
