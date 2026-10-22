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

The installer asks a few quick questions and walks you through making your first profile:

```
? Install mclaude to [~/.local/bin]
? Add ~/.local/bin to your PATH? [Y/n]
? Add Claude Code shortcuts (type claude-work to use the Work account)? [Y/n]
? Create a profile now? [Y/n]
? Profile name (e.g. Work, Personal) [Work]
? Icon colour [blue]
? Open Claude for Work now and sign in? [Y/n]
```

Press Enter to accept the default. To skip the questions, run `./install.sh -y`.

You need [Claude Desktop](https://claude.ai/download) installed. Nothing else.

## Quick start

Just type:

```bash
mclaude
```

You'll get a menu:

```
? What do you want to do?
  1) Open Claude Desktop
  2) Run Claude Code
  3) New profile
  4) Change icon colour
  5) Quit a profile
  6) Delete a profile
  7) Help (all commands)
  0) Exit
```

Pick **3** to make a profile. You'll be asked for a name and a colour, and then you sign in. **Claude Work** is now in your Applications folder, Dock and Spotlight, and it stays signed in.

## Commands

Prefer typing? Every menu item is also a command. If you leave out the name or colour, `mclaude` asks you to pick from a list.

| Command | What it does |
|---|---|
| `mclaude` | Open the menu |
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

- **Claude Code shortcuts:** if you said yes during install, type `claude-work` to run Claude Code as Work.
- **Login opens in the wrong window?** On the login page, choose the option to copy a code and paste it into the right window. You only need to do this once per profile.
- **Where does the colour show?** On the profile's app icon: in Applications, Spotlight, Launchpad, and the Dock if you drag it there. Once Claude is open, the running window uses the normal Claude icon. macOS doesn't let another app change that.
- **Still seeing the old icon?** macOS caches icons. Run `killall Dock`, or `mclaude app <name>` to rebuild it.
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

Then delete the lines marked `# added by multi-claude` from `~/.zshrc`.

## License

[MIT](LICENSE). Free to use, change and share.

---

Unofficial project, not made by Anthropic. Inspired by [jyito/Claude-Profiles](https://github.com/jyito/Claude-Profiles).
