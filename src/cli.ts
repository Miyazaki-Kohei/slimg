#!/usr/bin/env node

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, extname } from "node:path";
import { Command } from "commander";
import {
  ASPECT_RATIOS,
  ENGINE_MODEL_IDS,
  FORMAT_MIME,
  IMAGE_STYLE_PROMPTS,
} from "./config.js";
import {
  createClient,
  enhancePrompt,
  generateImage,
  resolveApiKey,
} from "./imagen.js";

const program = new Command();

program
  .name("slimg")
  .description("AI-powered image generator using Google Imagen 4")
  .argument("<prompt>", "Image generation theme / prompt")
  .requiredOption("-o, --output <path>", "Output file path")
  .option(
    "-t, --style <style>",
    `Image style (${Object.keys(IMAGE_STYLE_PROMPTS).join(", ")})`,
    "flat",
  )
  .option(
    "-a, --aspect-ratio <ratio>",
    `Aspect ratio (${ASPECT_RATIOS.join(", ")})`,
    "16:9",
  )
  .option(
    "-e, --engine <engine>",
    `Imagen engine (${Object.keys(ENGINE_MODEL_IDS).join(", ")})`,
    "imagen4",
  )
  .option(
    "-f, --format <format>",
    `Output format (${Object.keys(FORMAT_MIME).join(", ")})`,
  )
  .option("--no-enhance", "Skip Gemini prompt enhancement")
  .option("--dry-run", "Show config without API calls")
  .option("--debug", "Print enhanced prompt")
  .action(async (prompt: string, opts) => {
    // Resolve format from output extension if not specified
    let fmt: string = opts.format;
    if (!fmt) {
      const ext = extname(opts.output).replace(".", "").toLowerCase();
      fmt = ext in FORMAT_MIME ? ext : "png";
    }

    if (opts.dryRun) {
      console.log(`prompt:       ${prompt}`);
      console.log(`style:        ${opts.style}`);
      console.log(`aspect-ratio: ${opts.aspectRatio}`);
      console.log(`engine:       ${opts.engine}`);
      console.log(`format:       ${fmt}`);
      console.log(`output:       ${opts.output}`);
      console.log(`enhance:      ${opts.enhance}`);
      return;
    }

    const apiKey = resolveApiKey();
    const client = createClient(apiKey);

    // Step 1: Prompt enhancement
    let finalPrompt: string;
    if (!opts.enhance) {
      finalPrompt = prompt;
    } else {
      console.error("Enhancing prompt...");
      finalPrompt = await enhancePrompt(client, prompt, opts.style);
    }

    if (opts.debug) {
      console.error(`[Enhanced prompt]\n${finalPrompt}`);
    }

    // Step 2: Generate image
    console.error("Generating image...");
    const imageBuffer = await generateImage(client, finalPrompt, {
      engine: opts.engine,
      aspectRatio: opts.aspectRatio,
      format: fmt,
    });

    // Step 3: Save
    await mkdir(dirname(opts.output), { recursive: true });
    await writeFile(opts.output, imageBuffer);

    console.log(opts.output);
  });

program.parse();
