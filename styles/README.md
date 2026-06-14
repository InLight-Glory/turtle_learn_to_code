# Styles / Themes

This folder is for user-selectable site styles (themes).

## How it works

The base stylesheet is `style.css`. Themes in this folder only override CSS variables (e.g. `--primary-color`).

Pages include a dedicated theme link tag:
- `link#theme-stylesheet`

A future dropdown can switch themes by changing that tag's `href` to one of:
- `styles/theme-default.css`
- `styles/theme-dark.css`
- `styles/theme-high-contrast.css`

Additional themes (designed by name):
- `styles/theme-morning-ocean.css` (Morning-Ocean)
- `styles/theme-midnight-ocean.css` (Midnight-Ocean)
- `styles/theme-morning-forest.css` (Morning-Forest)
- `styles/theme-midnight-forest.css` (Midnight-Forest)
- `styles/theme-morning-sunrse.css` (Morning-Sunrse)
- `styles/theme-midnight-sunset.css` (Midnight-Sunset)
- `styles/theme-morning-tranquil.css` (Morning-Tranquil)
- `styles/theme-midnight-calm.css` (Midnight-Calm)

