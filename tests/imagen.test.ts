import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { resolveApiKey } from "../src/imagen.js";

describe("resolveApiKey", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.GOOGLE_API_KEY;
    delete process.env.GEMINI_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return GOOGLE_API_KEY when set", () => {
    process.env.GOOGLE_API_KEY = "test-google-key";
    expect(resolveApiKey()).toBe("test-google-key");
  });

  it("should return GEMINI_API_KEY as fallback", () => {
    process.env.GEMINI_API_KEY = "test-gemini-key";
    expect(resolveApiKey()).toBe("test-gemini-key");
  });

  it("should prefer GOOGLE_API_KEY over GEMINI_API_KEY", () => {
    process.env.GOOGLE_API_KEY = "google";
    process.env.GEMINI_API_KEY = "gemini";
    expect(resolveApiKey()).toBe("google");
  });

  it("should exit when no key is set", () => {
    const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    const mockError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => resolveApiKey()).toThrow("process.exit called");
    expect(mockExit).toHaveBeenCalledWith(1);

    mockExit.mockRestore();
    mockError.mockRestore();
  });
});
