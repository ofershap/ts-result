import { describe, it, expect } from "vitest";
import { Ok, Err } from "../src/result";
import { fromThrowable, fromPromise } from "../src/helpers";

describe("fromThrowable", () => {
  it("returns Ok when function succeeds", () => {
    const result = fromThrowable(() => JSON.parse('{"a": 1}'));
    expect(result).toEqual(Ok({ a: 1 }));
  });

  it("returns Err when function throws", () => {
    const result = fromThrowable(() => JSON.parse("invalid"));
    expect(result.ok).toBe(false);
    expect(result.error).toBeInstanceOf(SyntaxError);
  });

  it("maps error with custom mapper", () => {
    const result = fromThrowable(
      () => JSON.parse("invalid"),
      (e) => `Parse failed: ${(e as Error).message}`,
    );
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Parse failed");
  });
});

describe("fromPromise", () => {
  it("returns Ok when promise resolves", async () => {
    const result = await fromPromise(Promise.resolve(42));
    expect(result).toEqual(Ok(42));
  });

  it("returns Err when promise rejects", async () => {
    const result = await fromPromise(Promise.reject(new Error("async fail")));
    expect(result.ok).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
  });

  it("maps error with custom mapper", async () => {
    const result = await fromPromise(
      Promise.reject(new Error("async fail")),
      (e) => `Caught: ${(e as Error).message}`,
    );
    expect(result).toEqual(Err("Caught: async fail"));
  });
});
