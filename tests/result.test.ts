import { describe, it, expect } from "vitest";
import { Ok, Err, Result } from "../src/result";

describe("Ok", () => {
  it("creates an Ok result", () => {
    const result = Ok(42);
    expect(result.ok).toBe(true);
    expect(result.value).toBe(42);
  });

  it("has no error property", () => {
    const result = Ok("hello");
    expect(result.error).toBeUndefined();
  });
});

describe("Err", () => {
  it("creates an Err result", () => {
    const result = Err("something failed");
    expect(result.ok).toBe(false);
    expect(result.error).toBe("something failed");
  });

  it("has no value property", () => {
    const result = Err(new Error("fail"));
    expect(result.value).toBeUndefined();
  });
});

describe("Result constructor", () => {
  it("creates Ok when first arg is true", () => {
    const result = Result(true, 42);
    expect(result.ok).toBe(true);
    expect(result.value).toBe(42);
  });

  it("creates Err when first arg is false", () => {
    const result = Result(false, "error");
    expect(result.ok).toBe(false);
    expect(result.error).toBe("error");
  });
});

describe("Result.map", () => {
  it("maps Ok value", () => {
    const result = Result.map(Ok(5), (n) => n * 2);
    expect(result).toEqual(Ok(10));
  });

  it("passes through Err", () => {
    const result = Result.map(
      Err("fail") as Result<number, string>,
      (n) => n * 2,
    );
    expect(result).toEqual(Err("fail"));
  });
});

describe("Result.mapErr", () => {
  it("maps Err value", () => {
    const result = Result.mapErr(Err("fail"), (e) => `Error: ${e}`);
    expect(result).toEqual(Err("Error: fail"));
  });

  it("passes through Ok", () => {
    const result = Result.mapErr(
      Ok(42) as Result<number, string>,
      (e) => `Error: ${e}`,
    );
    expect(result).toEqual(Ok(42));
  });
});

describe("Result.flatMap", () => {
  it("chains Ok results", () => {
    const parse = (s: string): Result<number, string> => {
      const n = parseInt(s, 10);
      return isNaN(n) ? Err("not a number") : Ok(n);
    };
    const result = Result.flatMap(Ok("42"), parse);
    expect(result).toEqual(Ok(42));
  });

  it("short-circuits on Err", () => {
    const result = Result.flatMap(
      Err("first error") as Result<string, string>,
      () => Ok(42),
    );
    expect(result).toEqual(Err("first error"));
  });

  it("returns Err from inner function", () => {
    const result = Result.flatMap(Ok("abc"), () => Err("parse error"));
    expect(result).toEqual(Err("parse error"));
  });
});

describe("Result.unwrap", () => {
  it("returns value for Ok", () => {
    expect(Result.unwrap(Ok(42))).toBe(42);
  });

  it("throws for Err with Error", () => {
    const err = new Error("boom");
    expect(() => Result.unwrap(Err(err))).toThrow("boom");
  });

  it("throws wrapped error for Err with string", () => {
    expect(() => Result.unwrap(Err("fail"))).toThrow("fail");
  });
});

describe("Result.unwrapOr", () => {
  it("returns value for Ok", () => {
    expect(Result.unwrapOr(Ok(42), 0)).toBe(42);
  });

  it("returns default for Err", () => {
    expect(Result.unwrapOr(Err("fail") as Result<number, string>, 0)).toBe(0);
  });
});

describe("Result.unwrapErr", () => {
  it("returns error for Err", () => {
    expect(Result.unwrapErr(Err("fail"))).toBe("fail");
  });

  it("throws for Ok", () => {
    expect(() => Result.unwrapErr(Ok(42))).toThrow(
      "Called unwrapErr on Ok value: 42",
    );
  });
});

describe("Result.match", () => {
  it("calls ok handler for Ok", () => {
    const result = Result.match(Ok(42), {
      ok: (v) => `value: ${v}`,
      err: (e) => `error: ${e}`,
    });
    expect(result).toBe("value: 42");
  });

  it("calls err handler for Err", () => {
    const result = Result.match(Err("fail") as Result<number, string>, {
      ok: (v) => `value: ${v}`,
      err: (e) => `error: ${e}`,
    });
    expect(result).toBe("error: fail");
  });
});

describe("Result.isOk / Result.isErr", () => {
  it("isOk returns true for Ok", () => {
    expect(Result.isOk(Ok(1))).toBe(true);
  });

  it("isOk returns false for Err", () => {
    expect(Result.isOk(Err("x"))).toBe(false);
  });

  it("isErr returns true for Err", () => {
    expect(Result.isErr(Err("x"))).toBe(true);
  });

  it("isErr returns false for Ok", () => {
    expect(Result.isErr(Ok(1))).toBe(false);
  });

  it("narrows type with isOk", () => {
    const result: Result<number, string> = Ok(42);
    if (Result.isOk(result)) {
      const _v: number = result.value;
      expect(_v).toBe(42);
    }
  });

  it("narrows type with isErr", () => {
    const result: Result<number, string> = Err("fail");
    if (Result.isErr(result)) {
      const _e: string = result.error;
      expect(_e).toBe("fail");
    }
  });
});
