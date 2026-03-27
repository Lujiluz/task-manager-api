import { describe, it, expect } from "vitest";
import { hash, compare } from "../../../src/shared/utils/password";

describe("password utils", () => {
  it("hash() returns a string different from the plain-text input", async () => {
    const plain = "my-secret-password";
    const hashed = await hash(plain);
    expect(typeof hashed).toBe("string");
    expect(hashed).not.toBe(plain);
  });

  it("compare() returns true for the correct password", async () => {
    const plain = "I'd risk it all for you~";
    const hashed = await hash(plain);
    expect(await compare(plain, hashed)).toBe(true);
  });

  it("compare() returns false for a wrong password", async () => {
    const hashed = await hash("right-password");
    expect(await compare("wrong-password", hashed)).toBe(false);
  });
});
