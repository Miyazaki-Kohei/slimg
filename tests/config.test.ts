import { describe, it, expect } from "vitest";
import {
  ENGINE_MODEL_IDS,
  ASPECT_RATIOS,
  IMAGE_STYLE_PROMPTS,
  FORMAT_MIME,
  GEMINI_MODEL,
} from "../src/config.js";

describe("ENGINE_MODEL_IDS", () => {
  it("should contain imagen4 variants", () => {
    expect(ENGINE_MODEL_IDS).toHaveProperty("imagen4");
    expect(ENGINE_MODEL_IDS).toHaveProperty("imagen4-fast");
    expect(ENGINE_MODEL_IDS).toHaveProperty("imagen4-ultra");
  });

  it("should map to valid model IDs", () => {
    for (const [key, value] of Object.entries(ENGINE_MODEL_IDS)) {
      expect(value).toMatch(/^imagen-4\.0-/);
    }
  });
});

describe("ASPECT_RATIOS", () => {
  it("should contain standard ratios", () => {
    expect(ASPECT_RATIOS).toContain("16:9");
    expect(ASPECT_RATIOS).toContain("4:3");
    expect(ASPECT_RATIOS).toContain("1:1");
    expect(ASPECT_RATIOS).toContain("9:16");
    expect(ASPECT_RATIOS).toContain("3:4");
  });

  it("should have exactly 5 ratios", () => {
    expect(ASPECT_RATIOS).toHaveLength(5);
  });
});

describe("IMAGE_STYLE_PROMPTS", () => {
  const expectedStyles = [
    "realistic",
    "illustration",
    "flat",
    "anime",
    "watercolor",
    "oil-painting",
    "pixel-art",
    "sketch",
    "3d-render",
    "corporate",
    "minimal",
    "pop-art",
  ];

  it("should contain all 12 styles", () => {
    expect(Object.keys(IMAGE_STYLE_PROMPTS)).toHaveLength(12);
    for (const style of expectedStyles) {
      expect(IMAGE_STYLE_PROMPTS).toHaveProperty(style);
    }
  });

  it("should have non-empty prompt strings for each style", () => {
    for (const [style, prompt] of Object.entries(IMAGE_STYLE_PROMPTS)) {
      expect(prompt).toBeTruthy();
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(10);
    }
  });
});

describe("FORMAT_MIME", () => {
  it("should map png to image/png", () => {
    expect(FORMAT_MIME.png).toBe("image/png");
  });

  it("should map jpg and jpeg to image/jpeg", () => {
    expect(FORMAT_MIME.jpg).toBe("image/jpeg");
    expect(FORMAT_MIME.jpeg).toBe("image/jpeg");
  });
});

describe("GEMINI_MODEL", () => {
  it("should be a valid Gemini model string", () => {
    expect(GEMINI_MODEL).toMatch(/^gemini-/);
  });
});
