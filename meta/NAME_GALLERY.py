#!/usr/bin/env python3
"""SIPA MLL: Name 93 artworks via Claude Haiku Vision → gallery.json"""
import os, json, base64, time, io, urllib.request
from pathlib import Path
from PIL import Image

SITE_ROOT    = Path(__file__).parent.parent
GALLERY_JSON = SITE_ROOT / "meta" / "data" / "gallery.json"
API_KEY      = os.environ.get("ANTHROPIC_API_KEY","")
MAX_BYTES    = 4_000_000  # 4MB safe limit

if not API_KEY:
    print("ERROR: no ANTHROPIC_API_KEY"); exit(1)

def img_to_b64(img_path, max_bytes=MAX_BYTES):
    """Load image, resize if needed, return base64."""
    with Image.open(img_path) as im:
        im = im.convert("RGB")
        buf = io.BytesIO()
        im.save(buf, format="JPEG", quality=85)
        if buf.tell() <= max_bytes:
            return base64.b64encode(buf.getvalue()).decode()
        # Resize until fits
        w, h = im.size
        for scale in [0.7, 0.5, 0.35]:
            buf = io.BytesIO()
            im.resize((int(w*scale), int(h*scale)), Image.LANCZOS).save(buf, format="JPEG", quality=80)
            if buf.tell() <= max_bytes:
                return base64.b64encode(buf.getvalue()).decode()
        buf = io.BytesIO()
        im.resize((800, int(h*800/w)), Image.LANCZOS).save(buf, format="JPEG", quality=70)
        return base64.b64encode(buf.getvalue()).decode()

def name_image(b64):
    body = json.dumps({
        "model": "claude-haiku-4-5-20251001",
        "max_tokens": 80,
        "messages": [{"role":"user","content":[
            {"type":"image","source":{"type":"base64","media_type":"image/jpeg","data":b64}},
            {"type":"text","text":"Abstract psychedelic line art (hearts, spirals, chaos, UV neon) by Marina (Soul In PsyAbstract). Short poetic title. ONLY JSON: {\"ru\":\"2-4 слова\",\"en\":\"2-4 words\"}"}
        ]}]
    }).encode()
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body,
        headers={"x-api-key":API_KEY,"anthropic-version":"2023-06-01","content-type":"application/json"})
    r = urllib.request.urlopen(req, timeout=30)
    d = json.loads(r.read())
    text = d["content"][0]["text"].strip()
    if text.startswith("```"): text = text.split("```")[1].lstrip("json").strip()
    return json.loads(text)

with open(GALLERY_JSON) as f:
    gallery = json.load(f)
items = gallery["items"]
print(f"Items: {len(items)}")

named = 0; failed = []
for item in items:
    img_path = SITE_ROOT / item["img"]
    if not img_path.exists():
        print(f"  SKIP {item['id']}"); continue
    size_kb = img_path.stat().st_size // 1024
    print(f"  {item['id']} ({size_kb}KB)...", end=" ", flush=True)
    for attempt in range(3):
        try:
            b64 = img_to_b64(img_path)
            t = name_image(b64)
            item["title_ru"] = t["ru"]
            item["title_en"] = t["en"]
            print(f"✓ {t['ru']}")
            named += 1
            time.sleep(0.4)
            break
        except Exception as e:
            print(f"retry{attempt+1}:{e} ", end="")
            time.sleep(2)
    else:
        print("FAILED")
        failed.append(item["id"])

with open(GALLERY_JSON,"w",encoding="utf-8") as f:
    json.dump(gallery, f, ensure_ascii=False, indent=2)

print(f"\nDONE named={named} failed={len(failed)}")
if failed: print("Failed:", failed)
