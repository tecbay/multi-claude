# multi-claude

Use several Claude accounts at the same time on one Mac, such as a personal and a work account. No more logging out and back in.

Each account gets its own Dock icon with a coloured letter, and stays signed in.

Works with **Claude Desktop** and **Claude Code**.

## Install

```bash
git clone https://github.com/tecbay/multi-claude.git
cd multi-claude
./install.sh
```

You need [Claude Desktop](https://claude.ai/download) installed. Nothing else.

> If `mclaude` isn't found after installing, add this line to `~/.zshrc` and open a new terminal:
> `export PATH="$HOME/.local/bin:$PATH"`

## Quick start

```bash
mclaude new Work --color blue     # make a profile called "Work"
mclaude open work                 # open Claude Desktop for it, then sign in
```

That's it. **Claude Work** is now in your Applications folder, Dock and Spotlight. Sign in once and it stays signed in.

## Commands

| Command | What it does |
|---|---|
| `mclaude new <Name> --color <colour>` | Create a profile |
| `mclaude open <name>` | Open Claude Desktop for that account |
| `mclaude code <name>` | Run Claude Code as that account |
| `mclaude ls` | List profiles and which are running |
| `mclaude color <name> <colour>` | Change the icon colour |
| `mclaude colors` | Show the colours you can use |
| `mclaude quit <name>` | Close that account's Claude |
| `mclaude rm <name>` | Delete a profile and its login |

**Colours:** red, orange, yellow, green, teal, blue, indigo, purple, pink, gray, black, or any hex like `"#FF8800"`.

## Tips

- **Claude Code shortcuts:** add `eval "$(mclaude alias)"` to `~/.zshrc`. Then type `claude-work` to run Claude Code as Work.
- **Login opens in the wrong window?** On the login page, choose the option to copy a code and paste it into the right window. You only need to do this once per profile.
- **Which window is which?** Every running copy is named "Claude". Run `mclaude open <name>` to bring a specific one to the front.

## Is it safe?

- It never sees or stores your password or login. Each account's data stays in its own folder in `~/.multi-claude`.
- It doesn't change Claude itself, so updates keep working.
- Your normal Claude install isn't touched.
- No internet calls and no tracking. It's a small bash script you can read.

## Uninstall

```bash
mclaude rm <name>                 # for each profile
rm ~/.local/bin/mclaude
```

## License

[MIT](LICENSE). Free to use, change and share.

---

Unofficial project, not made by Anthropic. Inspired by [jyito/Claude-Profiles](https://github.com/jyito/Claude-Profiles).
