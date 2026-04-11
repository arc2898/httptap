# HttpTap

> HTTP testing with retry/backoff, formatted JSON diff output.

## Install

```bash
npm install -g @arc2898/httptap
```

## Usage

```bash
# Simple GET with retry
httptap tap https://api.example.com/data

# POST with JSON body
httptap tap https://api.example.com/users -m POST -b '{"name":"Test"}'

# Retry with custom delays
httptap tap https://api.example.com/data -r 5 -d 2000

# Compare two endpoints
httptap diff https://api-v1.example.com/data https://api-v2.example.com/data

# Headers
httptap tap https://api.example.com -H "Authorization:Bearer xxx,Content-Type:application/json"
```

## Features

- **Retry with exponential backoff**: defaults to 3 retries, 1s initial delay
- **Color-coded status**: green for 2xx, red for 4xx/5xx, yellow for 3xx
- **JSON body parsing**: pretty-prints JSON responses
- **Diff mode**: compare two URLs side-by-side

## License

MIT