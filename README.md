# ts-result

[![npm version](https://img.shields.io/npm/v/ts-result-type)](https://www.npmjs.com/package/ts-result-type)
[![npm downloads](https://img.shields.io/npm/dm/ts-result-type)](https://www.npmjs.com/package/ts-result-type)
[![license](https://img.shields.io/npm/l/ts-result-type)](https://github.com/ofershap/ts-result/blob/main/LICENSE)
[![CI](https://github.com/ofershap/ts-result/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/ts-result/actions/workflows/ci.yml)

Rust-style `Result<T, E>` for TypeScript. Type-safe error handling without try/catch. Zero dependencies. ~900 bytes.

![Demo](assets/demo.gif)

## Install

```bash
npm install ts-result-type
```

## Usage

```typescript
import { Ok, Err, Result } from "ts-result-type";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Err("division by zero");
  return Ok(a / b);
}

const result = divide(10, 2);

if (result.ok) {
  console.log(result.value); // 5 — fully typed as number
} else {
  console.log(result.error); // fully typed as string
}
```

### Pattern Matching

```typescript
const message = Result.match(divide(10, 0), {
  ok: (value) => `Result: ${value}`,
  err: (error) => `Failed: ${error}`,
});
// "Failed: division by zero"
```

### Chaining

```typescript
const result = Result.flatMap(Ok("42"), (s) => {
  const n = parseInt(s, 10);
  return isNaN(n) ? Err("not a number") : Ok(n);
});
// Ok(42)
```

### Wrapping Throwable Code

```typescript
import { fromThrowable, fromPromise } from "ts-result-type";

const parsed = fromThrowable(() => JSON.parse(input));

const data = await fromPromise(
  fetch("/api/data").then((r) => r.json()),
  (e) => `Fetch failed: ${(e as Error).message}`,
);
```

## API

### Constructors

| Function | Description |
|----------|-------------|
| `Ok(value)` | Create a success result |
| `Err(error)` | Create an error result |
| `fromThrowable(fn, mapErr?)` | Wrap a function that might throw |
| `fromPromise(promise, mapErr?)` | Wrap a promise that might reject |

### Static Methods

| Method | Description |
|--------|-------------|
| `Result.map(result, fn)` | Transform the Ok value |
| `Result.mapErr(result, fn)` | Transform the Err value |
| `Result.flatMap(result, fn)` | Chain Result-returning functions |
| `Result.unwrap(result)` | Extract value or throw |
| `Result.unwrapOr(result, default)` | Extract value or use default |
| `Result.unwrapErr(result)` | Extract error or throw |
| `Result.match(result, { ok, err })` | Pattern match on result |
| `Result.isOk(result)` | Type guard for Ok (narrows type) |
| `Result.isErr(result)` | Type guard for Err (narrows type) |

## Why Not Try/Catch?

- **Type safety** — errors are part of the return type, not invisible
- **Exhaustive handling** — TypeScript ensures you handle both cases
- **Composable** — chain operations with `map`, `flatMap`, `match`
- **Explicit** — no hidden control flow, no forgotten catch blocks

## Other Projects

- [ts-nano-event](https://github.com/ofershap/ts-nano-event) — Typed event emitter in <200 bytes
- [spotlight-card](https://github.com/ofershap/spotlight-card) — Animated spotlight card for React
- [use-stepper](https://github.com/ofershap/use-stepper) — React hook for multi-step forms

## License

MIT
