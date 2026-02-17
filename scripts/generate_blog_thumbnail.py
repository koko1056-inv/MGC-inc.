#!/usr/bin/env python3
"""
MGC Blog Thumbnail Generator
Usage: python3 scripts/generate_blog_thumbnail.py <article_title> <output_filename>

Example:
  python3 scripts/generate_blog_thumbnail.py \
    "AIエージェントが社員になる日" \
    blog_ai_agent.jpg
"""

import sys
import json
import base64
import requests
import os

# --- Config ---
OPENAI_CREDENTIALS = os.path.expanduser(
    "~/clawd/skills/tiktok-ai-agent/credentials/openai_api_key.json"
)
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "assets")

MGC_STYLE_BASE = (
    "Photorealistic 3D render, minimalist white clean room, glass panels on walls "
    "displaying red glowing AI data visualizations and circuit board patterns, "
    "floating geometric shapes with red neon glow edges, ultra-clean white and red "
    "color scheme, professional studio lighting, no text, ultra HD quality, "
    "modern AI tech company blog thumbnail aesthetic"
)

# Article-specific prompt additions
ARTICLE_PROMPTS = {
    "automation": "robotic arms, workflow diagram nodes, connected system icons floating",
    "voice": "sound waveforms, microphone, audio spectrum visualization, speaker icons",
    "global": "globe, world map outline, connection lines between cities",
    "trading": "data charts, trending upward graphs, exchange symbols",
    "product": "floating 3D product device, holographic UI elements",
    "vision": "expanding light rays, horizon perspective, futuristic cityscape silhouette",
    "ai": "neural network nodes, LLM chip, data streams",
    "default": "floating data cubes, network mesh, pulsing energy fields",
}


def generate_thumbnail(article_title: str, output_filename: str) -> str:
    """Generate a blog thumbnail for the given article title."""
    
    # Load API key
    with open(OPENAI_CREDENTIALS) as f:
        creds = json.load(f)
    api_key = creds["api_key"]

    # Build prompt based on article content
    title_lower = article_title.lower()
    extra = ARTICLE_PROMPTS["default"]
    for key, detail in ARTICLE_PROMPTS.items():
        if key in title_lower or key in title_lower.replace("ー", "").replace(" ", ""):
            extra = detail
            break

    prompt = f"{MGC_STYLE_BASE}. Additional elements: {extra}. Article theme: {article_title}"
    print(f"[MGC Thumb] Generating: {output_filename}")
    print(f"[MGC Thumb] Prompt: {prompt[:100]}...")

    resp = requests.post(
        "https://api.openai.com/v1/images/generations",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model": "gpt-image-1",
            "prompt": prompt,
            "size": "1536x1024",
            "quality": "high",
            "n": 1,
        },
        timeout=120,
    )

    resp.raise_for_status()
    data = resp.json()
    
    b64 = data["data"][0].get("b64_json")
    if not b64:
        raise ValueError("No image data in response")

    # Save to assets folder
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    with open(output_path, "wb") as f:
        f.write(base64.b64decode(b64))

    print(f"[MGC Thumb] ✅ Saved: {output_path}")
    return output_path


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 scripts/generate_blog_thumbnail.py <article_title> <output_filename>")
        sys.exit(1)
    
    title = sys.argv[1]
    filename = sys.argv[2]
    
    result = generate_thumbnail(title, filename)
    print(f"Done: {result}")
