---
name: slimg
description: Google Imagen 4 による画像生成スキル。テキストプロンプトから高品質な画像を生成する。スライド用の背景画像、コンセプトイラスト、アイコンなどの生成に最適。「画像を生成」「イラストを作成」「背景画像を作って」「image generate」「写真を作成」などのキーワードが含まれる場合は積極的に使用すること。
license: MIT
metadata:
  author: miyakoh
  version: 0.1.0
---

# slimg

Google Imagen 4 API を直接呼び出してテキストプロンプトから画像を生成する。Gemini によるプロンプト強化で、短いテーマからでも高品質な画像を出力する。

## Quick Reference

```bash
npx @miyakoh/slimg "<プロンプト>" -t <style> -a <ratio> -o <output-path>
```

## スタイル選択ガイド

| 用途 | スタイル (`-t`) | アスペクト比 (`-a`) |
|------|----------------|-------------------|
| 製品写真・風景 | `realistic` | 16:9, 4:3 |
| キャラクター・マスコット | `anime`, `illustration` | 1:1, 3:4 |
| アイコン・ロゴ | `flat`, `minimal` | 1:1 |
| アート・ポスター | `watercolor`, `oil-painting`, `pop-art` | 任意 |
| ゲームアセット | `pixel-art`, `3d-render` | 1:1 |
| ビジネス・プレゼン | `corporate` | 16:9 |
| コンセプトスケッチ | `sketch` | 任意 |

## オプション

| オプション | 値 | デフォルト |
|-----------|-----|---------|
| `-t, --style` | realistic, illustration, flat, anime, watercolor, oil-painting, pixel-art, sketch, 3d-render, corporate, minimal, pop-art | flat |
| `-a, --aspect-ratio` | 16:9, 4:3, 1:1, 9:16, 3:4 | 16:9 |
| `-o, --output` | 出力ファイルパス | **必須** |
| `-e, --engine` | imagen4, imagen4-fast, imagen4-ultra | imagen4 |
| `-f, --format` | png, jpg, jpeg | 出力パスの拡張子から推定 |
| `--no-enhance` | Gemini プロンプト強化をスキップ | false |
| `--dry-run` | API 呼び出しなしで設定を確認 | false |
| `--debug` | 強化後のプロンプトを表示 | false |

## 使用例

```bash
# スライド背景（flat + 16:9）
npx @miyakoh/slimg \
  "abstract geometric pattern, navy #1B4565 and teal #3E9BA4 gradients" \
  -t flat -a 16:9 -o images/bg.png

# コンセプト図
npx @miyakoh/slimg \
  "cloud architecture concept, modern and clean" \
  -t flat -a 16:9 -o images/concept.png

# アイコン
npx @miyakoh/slimg \
  "security shield icon, teal #3E9BA4" \
  -t minimal -a 1:1 -o images/icon.png

# 高速生成
npx @miyakoh/slimg \
  "team collaboration" -t corporate -a 16:9 -e imagen4-fast -o images/team.png
```

## 環境変数

`GOOGLE_API_KEY` または `GEMINI_API_KEY` のいずれかを設定する（前者を優先）。
