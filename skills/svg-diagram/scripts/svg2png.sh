#!/bin/bash
# SVG to PNG converter — uses macOS qlmanage (built-in) or rsvg-convert
# Usage: bash svg2png.sh <input.svg> [scale]
#   scale: 1, 2, 3 (default: 2)

set -euo pipefail

INPUT="${1:?Usage: svg2png.sh <input.svg> [scale]}"
SCALE="${2:-2}"

if [ ! -f "$INPUT" ]; then
  echo "Error: $INPUT not found" >&2
  exit 1
fi

BASENAME="${INPUT%.svg}"
OUTPUT="${BASENAME}@${SCALE}x.png"

# Try rsvg-convert first (better quality), fall back to qlmanage
if command -v rsvg-convert &>/dev/null; then
  rsvg-convert -z "$SCALE" "$INPUT" -o "$OUTPUT"
elif command -v qlmanage &>/dev/null; then
  # qlmanage renders at 72dpi, scale multiplier gives us @Nx
  TEMP_DIR=$(mktemp -d)
  qlmanage -t -s "$(echo "72 * $SCALE" | bc)" -o "$TEMP_DIR" "$INPUT" >/dev/null 2>&1
  mv "$TEMP_DIR/$(basename "$INPUT").png" "$OUTPUT"
  rmdir "$TEMP_DIR" 2>/dev/null || true
else
  echo "Error: Neither rsvg-convert nor qlmanage found." >&2
  echo "Install rsvg-convert: brew install librsvg" >&2
  exit 1
fi

echo "$INPUT → $OUTPUT"
