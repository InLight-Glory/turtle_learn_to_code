# Coding Champions

This project is a coding challenge site designed to help kids from 4 to 18 years old learn to code and become experts in problem-solving.

## Technology Stack

Built with **HTML, CSS, and vanilla JavaScript**. Curriculum, layouts, projects, and the shop catalog are loaded from local data (`data.js`).

Progress, points, inventory, and equipment are stored in `localStorage` on the current device (no login).

## What’s Included

- Challenges: grade/set selector + turtle coding sandbox (`index.html`, `challenge.html`)
- Projects: multi-step sequences with a completion reward (`projects.html`)
- Profile: local display name + avatar equipment (`profile.html`)
- Shop: spend points on avatar items (`shop.html`)

## Run Locally

Any static server works. Example:

```bash
python3 -m http.server
```

## Project Roadmap

### Phase 1: Foundation & Core Gameplay (Complete)
- Static site structure
- Data-driven content (`data.js`)
- Turtle movement + win condition

### Phase 2: UX & Curriculum (Complete)
- Client-side progress tracking (`localStorage`)
- Commands, loops, functions, variables, conditionals

### Phase 3: Projects, Profile, and Rewards (Complete)
- Projects: multi-step flow with completion rewards
- Profile avatar: equip items
- Points economy + redeem shop

### Phase 4: Future Backend Integration (Future)
- User accounts
- Persistent cross-device progress
- Stronger code validation / anti-cheat

