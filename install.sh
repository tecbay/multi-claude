#!/bin/bash
# Interactive installer for mclaude.
#   ./install.sh        asks a few questions
#   ./install.sh -y     accepts all defaults (also used when not run in a terminal)
set -u

SRC="$(cd "$(dirname "$0")" && pwd)/bin/mclaude"
YES=0
case "${1:-}" in -y|--yes) YES=1 ;; esac
[ -t 0 ] || YES=1

if [ -t 1 ]; then
    B=$'\033[1m'; DIM=$'\033[2m'; G=$'\033[32m'; Y=$'\033[33m'; C=$'\033[36m'; X=$'\033[0m'
else
    B=""; DIM=""; G=""; Y=""; C=""; X=""
fi

ok()   { printf '%s✓%s %s\n' "$G" "$X" "$*"; }
warn() { printf '%s!%s %s\n' "$Y" "$X" "$*"; }
step() { printf '\n%s%s%s\n' "$B" "$*" "$X"; }

# ask "Question" "default" → prints the answer (default on Enter or with -y)
ask() {
    local answer
    if [ "$YES" -eq 1 ]; then printf '%s' "$2"; return; fi
    printf '%s?%s %s %s[%s]%s ' "$C" "$X" "$1" "$DIM" "$2" "$X" >&2
    read -r answer
    printf '%s' "${answer:-$2}"
}

# confirm "Question" Y|N → exit status 0 for yes
confirm() {
    local def="$2" answer hint="Y/n"
    [ "$def" = "N" ] && hint="y/N"
    if [ "$YES" -eq 1 ]; then [ "$def" = "Y" ]; return; fi
    printf '%s?%s %s %s[%s]%s ' "$C" "$X" "$1" "$DIM" "$hint" "$X" >&2
    read -r answer
    case "${answer:-$def}" in y|Y|yes|YES|Yes) return 0 ;; *) return 1 ;; esac
}

expand_home() { case "$1" in "~") printf '%s' "$HOME" ;; "~/"*) printf '%s/%s' "$HOME" "${1#\~/}" ;; *) printf '%s' "$1" ;; esac; }

add_line() {  # add_line <file> <line> — append once
    grep -qF "$2" "$1" 2>/dev/null && return 1
    printf '\n# added by multi-claude\n%s\n' "$2" >> "$1"
}

# ---------------------------------------------------------------------------

printf '%smulti-claude%s — use several Claude accounts at once\n' "$B" "$X"

[ "$(uname -s)" = "Darwin" ] || warn "This tool is made for macOS."
if [ -d /Applications/Claude.app ] || [ -d "$HOME/Applications/Claude.app" ]; then
    ok "Claude Desktop found"
else
    warn "Claude Desktop not found. Get it from https://claude.ai/download (Claude Code still works without it)."
fi

# 1. Where to install
step "1. Install"
DEST=$(expand_home "$(ask "Install mclaude to" "~/.local/bin")")
chmod +x "$SRC"
mkdir -p "$DEST" && ln -sf "$SRC" "$DEST/mclaude" || { warn "Couldn't write to $DEST"; exit 1; }
ok "Installed $DEST/mclaude"

# 2. Shell setup
case "${SHELL:-}" in
    */bash) RC="$HOME/.bash_profile" ;;
    *)      RC="$HOME/.zshrc" ;;
esac
RC_NAME="~/${RC#"$HOME"/}"
RC_CHANGED=0

step "2. Shell setup ($RC_NAME)"
case ":$PATH:" in
    *":$DEST:"*) ok "$DEST is already on your PATH" ;;
    *)
        if confirm "Add $DEST to your PATH?" Y; then
            if add_line "$RC" "export PATH=\"$DEST:\$PATH\""; then
                RC_CHANGED=1; ok "PATH updated"
            else
                ok "Already in $RC_NAME"
            fi
        else
            warn "Skipped. Run it as $DEST/mclaude, or add it to PATH yourself."
        fi
        ;;
esac

if confirm "Add Claude Code shortcuts (type claude-work to use the Work account)?" Y; then
    if add_line "$RC" 'command -v mclaude >/dev/null && eval "$(mclaude alias)"'; then
        RC_CHANGED=1; ok "Shortcuts enabled"
    else
        ok "Shortcuts already enabled"
    fi
fi

# 3. First profiles (skipped with -y: nothing to name them)
if [ "$YES" -eq 0 ]; then
    step "3. Profiles"
    "$SRC" ls 2>/dev/null | tail -n +2 | grep -v 'no profiles' | sed 's/^/  /'
    if confirm "Create a profile now?" Y; then
        COLORS=$("$SRC" colors 2>/dev/null | awk '$2 ~ /^#/ {printf "%s ", $1}' | sed 's/ $//')
        printf '  %scolours:%s %s\n' "$DIM" "$X" "$COLORS"
        while :; do
            NAME=$(ask "Profile name (e.g. Work, Personal)" "Work")
            while :; do
                COLOR=$(ask "Icon colour" "blue")
                printf '%s' "$COLOR" | grep -Eiq "^(#?[0-9a-f]{6}|${COLORS// /|}|grey)$" && break
                warn "Unknown colour '$COLOR'. Pick one from the list, or a hex like #FF8800."
            done
            if "$SRC" new "$NAME" --color "$COLOR"; then
                SLUG=$(printf '%s' "$NAME" | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9-')
                confirm "Open Claude for $NAME now and sign in?" Y && "$SRC" open "$SLUG"
            fi
            confirm "Create another profile?" N || break
        done
    fi
fi

# Done
step "All set 🎉"
printf '  mclaude new <Name> --color <colour>   create a profile\n'
printf '  mclaude open <name>                   open Claude for it\n'
printf '  mclaude help                          everything else\n'
[ "$RC_CHANGED" -eq 1 ] && printf '\n%sOpen a new terminal (or run: source %s) to use the changes.%s\n' "$Y" "$RC_NAME" "$X"
exit 0
