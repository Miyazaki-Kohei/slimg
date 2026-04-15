# slimg

AI-powered image generator CLI using Google Imagen 4 with Gemini prompt enhancement.

Short theme text is automatically expanded into a detailed image generation prompt by Gemini, then passed to Imagen 4 for high-quality image output.

## Installation

```bash
# Run directly with npx (no install needed)
npx @miyakoh/slimg "your prompt" -o output.png

# Install globally
npm install -g @miyakoh/slimg

# Use as a Claude Code skill
npx skills add miyakoh/slimg
```

## Setup

Set your Google API key as an environment variable:

```bash
export GOOGLE_API_KEY="your-api-key"
# or
export GEMINI_API_KEY="your-api-key"
```

Get your API key from [Google AI Studio](https://aistudio.google.com/apikey).

## Usage

```bash
slimg "<prompt>" -t <style> -a <ratio> -o <output-path>
```

### Examples

```bash
# Slide background (flat style, 16:9)
slimg "abstract geometric pattern, navy and teal gradients" \
  -t flat -a 16:9 -o images/bg.png

# Concept illustration
slimg "cloud architecture diagram, modern and clean" \
  -t illustration -a 16:9 -o images/concept.png

# Icon
slimg "security shield icon, teal accent" \
  -t minimal -a 1:1 -o images/icon.png

# Fast generation
slimg "team collaboration" \
  -t corporate -a 16:9 -e imagen4-fast -o images/team.png

# Skip prompt enhancement
slimg "a detailed prompt you wrote yourself" \
  --no-enhance -o images/raw.png
```

## Options

| Option | Values | Default |
|--------|--------|---------|
| `-t, --style` | realistic, illustration, flat, anime, watercolor, oil-painting, pixel-art, sketch, 3d-render, corporate, minimal, pop-art | `flat` |
| `-a, --aspect-ratio` | 16:9, 4:3, 1:1, 9:16, 3:4 | `16:9` |
| `-o, --output` | Output file path | **required** |
| `-e, --engine` | imagen4, imagen4-fast, imagen4-ultra | `imagen4` |
| `-f, --format` | png, jpg, jpeg | auto-detected from output path |
| `--no-enhance` | Skip Gemini prompt enhancement | `false` |
| `--dry-run` | Show config without API calls | `false` |
| `--debug` | Print enhanced prompt | `false` |

## Style Guide

| Use Case | Style (`-t`) | Aspect Ratio (`-a`) |
|----------|-------------|-------------------|
| Product photos, landscapes | `realistic` | 16:9, 4:3 |
| Characters, mascots | `anime`, `illustration` | 1:1, 3:4 |
| Icons, logos | `flat`, `minimal` | 1:1 |
| Art, posters | `watercolor`, `oil-painting`, `pop-art` | any |
| Game assets | `pixel-art`, `3d-render` | 1:1 |
| Business, presentations | `corporate` | 16:9 |
| Concept sketches | `sketch` | any |

## Engines

| Engine | Description |
|--------|-------------|
| `imagen4` | Standard quality (default) |
| `imagen4-fast` | Faster generation, slightly lower quality |
| `imagen4-ultra` | Highest quality, slower |

## How It Works

1. **Prompt Enhancement** - Your short theme is expanded by Gemini into a detailed image generation prompt with style, lighting, composition, and color descriptions
2. **Image Generation** - The enhanced prompt is sent to Google Imagen 4 API
3. **Output** - The generated image is saved to the specified path

## Programmatic Usage

```typescript
import { createClient, enhancePrompt, generateImage, resolveApiKey } from "@miyakoh/slimg";

const apiKey = resolveApiKey();
const client = createClient(apiKey);

const prompt = await enhancePrompt(client, "sunset over mountains", "realistic");
const imageBuffer = await generateImage(client, prompt, {
  engine: "imagen4",
  aspectRatio: "16:9",
  format: "png",
});
```

## License

MIT
