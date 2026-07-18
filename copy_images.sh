#!/bin/bash
SRC_BLOG="$HOME/Desktop/FYP/images/Blog"
SRC_HELP="$HOME/Desktop/FYP/images/Help center"
DST_BLOG="$(dirname "$0")/public/images/blog"
DST_HELP="$(dirname "$0")/public/images/help-center"

mkdir -p "$DST_BLOG" "$DST_HELP"

for f in "$SRC_BLOG"/*; do
  [ -f "$f" ] && cp "$f" "$DST_BLOG/" && echo "Copied Blog: $(basename "$f")"
done

for f in "$SRC_HELP"/*; do
  [ -f "$f" ] && cp "$f" "$DST_HELP/" && echo "Copied Help: $(basename "$f")"
done

echo ""
echo "✅ All images copied! You can close this window."
