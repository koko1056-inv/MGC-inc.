#!/usr/bin/env python3
"""
MGC Blog Thumbnail Generator (Gemini Imagen)
Usage: python3 scripts/generate_blog_thumbnail.py <article_title> <output_filename>

Example:
  python3 scripts/generate_blog_thumbnail.py \
    "AIエージェントが社員になる日" \
    blog_ai_agent.jpg
"""

import sys
import base64
import requests
import os

# --- Config ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyCL3i5T_NEw6DV5iQYajMEeUWlD5gmbF4Y")
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
    "agent": "interconnected nodes, protocol diagrams, autonomous system visualization",
    "claude": "coding terminal, AI assistant interface, developer workspace",
    "mcp": "protocol connectors, API endpoints, network topology diagram",
    "default": "floating data cubes, network mesh, pulsing energy fields",
}


def generate_thumbnail(article_title: str, output_filename: str) -> str:
    """Generate a blog thumbnail using Gemini Imagen API."""

    # Build prompt based on article content
    title_lower = article_title.lower()
    extra = ARTICLE_PROMPTS["default"]
    for key, detail in ARTICLE_PROMPTS.items():
        if key != "default" and (key in title_lower or key in title_lower.replace("ー", "").replace(" ", "")):
            extra = detail
            break

    prompt = f"{MGC_STYLE_BASE}. Additional elements: {extra}. Article theme: {article_title}"
    print(f"[MGC Thumb] Generating: {output_filename}")
    print(f"[MGC Thumb] Prompt: {prompt[:100]}...")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key={GEMINI_API_KEY}"

    resp = requests.post(
        url,
        headers={"Content-Type": "application/json"},
        json={
            "contents": [
                {
                    "parts": [
                        {"text": f"Generate an image: {prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "responseModalities": ["IMAGE", "TEXT"]
            }
        },
        timeout=120,
    )

    resp.raise_for_status()
    data = resp.json()

    # Extract image from response
    candidates = data.get("candidates", [])
    if not candidates:
        raise ValueError(f"No candidates in response: {data}")

    parts = candidates[0].get("content", {}).get("parts", [])
    image_data = None
    for part in parts:
        if "inlineData" in part:
            image_data = part["inlineData"]["data"]
            break

    if not image_data:
        raise ValueError(f"No image data in response parts: {[list(p.keys()) for p in parts]}")

    # Save to assets folder
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    with open(output_path, "wb") as f:
        f.write(base64.b64decode(image_data))

    print(f"[MGC Thumb] Saved: {output_path}")
    return output_path


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 scripts/generate_blog_thumbnail.py <article_title> <output_filename>")
        sys.exit(1)

    title = sys.argv[1]
    filename = sys.argv[2]

    result = generate_thumbnail(title, filename)
    print(f"Done: {result}")
