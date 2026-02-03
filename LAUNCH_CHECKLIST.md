# Post-Beta Launch Checklist

## Product
- Verify the main flows: `index.html` → `challenge.html` → win modal → points increase
- Verify projects: `projects.html` → multi-step flow → project reward granted once
- Verify shop: `shop.html` purchases reduce points and add to inventory
- Verify profile: `profile.html` equip changes avatar + header status
- Verify reset: profile reset clears challenge/project progress (keeps inventory)

## Safety / Stability
- Confirm loop limits prevent browser hangs (large `repeat` should show a friendly error)
- Confirm `if (...)` evaluation does not use `eval`/`new Function`
- Keep all user-entered strings rendered with `textContent` (avoid `innerHTML`)

## Privacy (kids)
- If you plan to market to children, review COPPA requirements before collecting any personal info
- Current implementation stores everything locally in `localStorage` and does not require accounts

## Release
- Host on GitHub Pages / Netlify / Vercel (static hosting)
- Add a short “Support / Contact” section to your site footer or `readme.md`

