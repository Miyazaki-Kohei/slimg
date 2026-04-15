import { GoogleGenAI, PersonGeneration, SafetyFilterLevel } from "@google/genai";
import {
  ENGINE_MODEL_IDS,
  FORMAT_MIME,
  GEMINI_MODEL,
  IMAGE_STYLE_PROMPTS,
} from "./config.js";

export function resolveApiKey(): string {
  const key = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!key) {
    console.error(
      "Error: GOOGLE_API_KEY または GEMINI_API_KEY 環境変数を設定してください",
    );
    process.exit(1);
  }
  return key;
}

export function createClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey });
}

export async function enhancePrompt(
  client: GoogleGenAI,
  theme: string,
  style: string,
  context = "",
): Promise<string> {
  const styleInstruction = IMAGE_STYLE_PROMPTS[style] ?? "";

  const prompt = `Generate a detailed image generation prompt based on the following information.

Message:
${theme}

Context:
${context}

${styleInstruction ? `Style Requirements:\n${styleInstruction}\n` : ""}
Please generate a prompt that meets the following criteria:
1. Include specific and detailed descriptions
2. Clearly specify the image style and atmosphere
3. Include all necessary elements
4. Output in English
5. Focus on visual elements and composition
6. Include lighting and color descriptions
7. Specify the mood and emotional tone
8. Limit the output to approximately 1500 characters

Prompt:
`;

  const response = await client.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  return response.text ?? theme;
}

export interface GenerateImageOptions {
  engine?: string;
  aspectRatio?: string;
  format?: string;
}

export async function generateImage(
  client: GoogleGenAI,
  prompt: string,
  options: GenerateImageOptions = {},
): Promise<Buffer> {
  const { engine = "imagen4", aspectRatio = "16:9", format = "png" } = options;

  const modelId = ENGINE_MODEL_IDS[engine];
  if (!modelId) {
    console.error(`Error: unknown engine "${engine}"`);
    process.exit(1);
  }

  const mime = FORMAT_MIME[format] ?? "image/png";

  const response = await client.models.generateImages({
    model: modelId,
    prompt,
    config: {
      numberOfImages: 1,
      aspectRatio,
      outputMimeType: mime,
      safetyFilterLevel: SafetyFilterLevel.BLOCK_LOW_AND_ABOVE,
      personGeneration: PersonGeneration.ALLOW_ADULT,
    },
  });

  if (!response.generatedImages?.length) {
    console.error(
      "Error: 画像が生成されませんでした（安全フィルターの可能性あり）",
    );
    process.exit(1);
  }

  const img = response.generatedImages[0];
  const imageBytes = img.image?.imageBytes;
  if (!imageBytes) {
    console.error("Error: 画像データが空です");
    process.exit(1);
  }

  return Buffer.from(imageBytes, "base64");
}
