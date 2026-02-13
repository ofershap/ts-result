import { Ok, Err, type Result } from "./result";

export function fromThrowable<T, E = Error>(
  fn: () => T,
  mapError?: (error: unknown) => E,
): Result<T, E> {
  try {
    return Ok(fn());
  } catch (error) {
    return Err(mapError ? mapError(error) : (error as E));
  }
}

export async function fromPromise<T, E = Error>(
  promise: Promise<T>,
  mapError?: (error: unknown) => E,
): Promise<Result<T, E>> {
  try {
    return Ok(await promise);
  } catch (error) {
    return Err(mapError ? mapError(error) : (error as E));
  }
}
