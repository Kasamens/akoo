#!/bin/sh
# Rebuild the link-preview images in shared/og/ from live lesson stages.
# Run from the repo root with the site served: python3 -m http.server 8000
# Usage: tools/og/make.sh [base-url]   (default http://localhost:8000)
set -e
BASE=${1:-http://localhost:8000}
CHROME=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
mkdir -p shared/og
shot() { # $1 = output name, $2 = query
  tmp=$(mktemp -d)
  "$CHROME" --headless=new --hide-scrollbars --force-prefers-reduced-motion --force-device-scale-factor=2 --window-size=1200,630 \
    --user-data-dir="$tmp" --virtual-time-budget=15000 --screenshot="$tmp/shot.png" "$BASE/tools/og/card.html?$2" >/dev/null 2>&1
  sips -z 630 1200 -s format jpeg -s formatOptions 82 "$tmp/shot.png" --out "shared/og/$1.jpg" >/dev/null
  rm -rf "$tmp"; echo "shared/og/$1.jpg"
}
shot akoo-de "c=de&l=akoo"
shot akoo-fr "c=fr&l=akoo"
shot akoo "c=de&l=akoo&both=1"
