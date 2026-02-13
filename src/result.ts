export interface OkResult<T> {
  readonly ok: true;
  readonly value: T;
  readonly error?: never;
}

export interface ErrResult<E> {
  readonly ok: false;
  readonly error: E;
  readonly value?: never;
}

export type Result<T, E = Error> = OkResult<T> | ErrResult<E>;

export function Ok<T>(value: T): OkResult<T> {
  return { ok: true, value };
}

export function Err<E>(error: E): ErrResult<E> {
  return { ok: false, error };
}

Result.map = map;
Result.mapErr = mapErr;
Result.flatMap = flatMap;
Result.unwrap = unwrap;
Result.unwrapOr = unwrapOr;
Result.unwrapErr = unwrapErr;
Result.match = match;
Result.isOk = isOk;
Result.isErr = isErr;

function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return result.ok ? Ok(fn(result.value)) : result;
}

function mapErr<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> {
  return result.ok ? result : Err(fn(result.error));
}

function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  return result.ok ? fn(result.value) : result;
}

function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) return result.value;
  throw result.error instanceof Error
    ? result.error
    : new Error(String(result.error));
}

function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue;
}

function unwrapErr<T, E>(result: Result<T, E>): E {
  if (!result.ok) return result.error;
  throw new Error(`Called unwrapErr on Ok value: ${String(result.value)}`);
}

function match<T, E, U>(
  result: Result<T, E>,
  handlers: { ok: (value: T) => U; err: (error: E) => U },
): U {
  return result.ok ? handlers.ok(result.value) : handlers.err(result.error);
}

function isOk<T, E>(result: Result<T, E>): result is OkResult<T> {
  return result.ok;
}

function isErr<T, E>(result: Result<T, E>): result is ErrResult<E> {
  return !result.ok;
}

export function Result<T>(_ok: true, value: T): OkResult<T>;
export function Result<E>(_ok: false, error: E): ErrResult<E>;
export function Result<T, E>(_ok: boolean, valueOrError: T | E): Result<T, E> {
  return _ok ? Ok(valueOrError as T) : Err(valueOrError as E);
}
