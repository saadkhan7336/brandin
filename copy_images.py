import shutil
import sys

files = [
    ("/Users/samiafzal/.gemini/antigravity-ide/brain/5e000a7c-f9c9-43df-ad4b-e4cdc0d90095/media__1784318902386.png", "public/images/about/creators-meeting.png"),
    ("/Users/samiafzal/.gemini/antigravity-ide/brain/5e000a7c-f9c9-43df-ad4b-e4cdc0d90095/media__1784319868582.png", "public/images/about/professional-creator.png"),
    ("/Users/samiafzal/.gemini/antigravity-ide/brain/5e000a7c-f9c9-43df-ad4b-e4cdc0d90095/founder_sami_1784319328047.png", "public/images/about/sami.png"),
    ("/Users/samiafzal/.gemini/antigravity-ide/brain/5e000a7c-f9c9-43df-ad4b-e4cdc0d90095/founder_saad_1784319337774.png", "public/images/about/saad.jpeg")
]

for src, dst in files:
    try:
        shutil.copy(src, dst)
        print(f"Copied {src} to {dst}")
    except Exception as e:
        print(f"Failed to copy {src}: {e}")
