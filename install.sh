#!/bin/bash
# Symlinks bin/mclaude into a folder on your PATH (default ~/.local/bin).
set -eu

DEST="${1:-$HOME/.local/bin}"
SRC="$(cd "$(dirname "$0")" && pwd)/bin/mclaude"

chmod +x "$SRC"
mkdir -p "$DEST"
ln -sf "$SRC" "$DEST/mclaude"
echo "✓ installed: $DEST/mclaude -> $SRC"

case ":$PATH:" in
    *":$DEST:"*) ;;
    *) echo "  add to ~/.zshrc:  export PATH=\"$DEST:\$PATH\"" ;;
esac
