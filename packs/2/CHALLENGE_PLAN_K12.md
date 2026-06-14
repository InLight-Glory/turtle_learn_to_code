# K–12 Challenge Plan (Draft for Approval)

This document proposes a **minimum-viable full curriculum map** that meets your launch constraints:

- **Every grade:** minimum **2 sets**, maximum **5 sets**
- **Every set:** minimum **7 challenges**
- **Set 1 (each grade):** **reinforcement** (harder problems using *previous grade* concepts)
- **Set 2+ (each grade):** teaches **new concepts**
- **Tone rule:** **odd challenges = silly/funny**, **even challenges = intriguing/puzzling**

Notes:
- Grades are **K, 1–12** (13 grades).
- IDs follow: `K_S{set}C{challenge}` and `G{grade}_S{set}C{challenge}` (e.g., `G7_S2C4`).
- This is a **plan**, not implementation yet. If you approve the structure, I’ll generate the full `data.js` entries + curriculum wiring.

---

## A. Concept Progression (What “New Concepts” Means)

To make K–12 feel coherent, “new concepts” are introduced by **bands**, then reinforced the next grade in Set 1.

### Band 1: K–2 (Foundations)
- Sequencing, precision, angles (turn), distance
- Patterns, repetition, nested repetition
- Pen control + simple art goals

### Band 2: 3–5 (Abstraction + Logic)
- Functions (decomposition), parameters
- Variables + arithmetic (growth, counters)
- Conditionals + branching (if / else)

### Band 3: 6–8 (Algorithms + Modeling)
- Coordinate geometry + transformations (conceptual)
- Optimization constraints (fewest steps, smallest repeats)
- Boolean logic combinations, “rule engines”

### Band 4: 9–12 (Capstone‑style challenges)
- Structured program design (modular functions)
- “Spec compliance” challenges (tests by rules)
- Efficiency constraints + creative briefs

---

## B. Engine Support Assumptions (for later implementation)

This plan assumes the current command set plus small, safe extensions as needed for upper grades.

### Current core (already in app)
- `forward(n)`, `turn(deg)`, `penUp()`, `penDown()`, `penColor(color)`
- `repeat N { ... }`
- `var name = value`
- `function name(params) { ... }`
- `if (condition) { ... } else { ... }`

### Proposed small additions (optional but recommended for grades 6–12)
- `goto(x, y)` (coordinate geometry)
- `setHeading(deg)` and `setPosition(x, y)` (explicit transforms)
- `random(min, max)` (controlled creativity; can be deterministic seeded per challenge)
- A “goal checker” per challenge (beyond “reach target”) for art/spec challenges

If you want **no new engine features for launch**, I can rewrite grades 6–12 to stay strictly inside the current feature set (but it will feel repetitive).

---

## C. Grade-by-Grade Plan (2 sets × 7 challenges per grade)

Each grade has exactly **2 sets** in this launch plan (meets minimum). If you want 3–5 sets for certain grades, I’ll add them after you approve this baseline.

### Kindergarten (K)

**Set 1 (Reinforcement / harder foundations): `K_S1`**
1. `K_S1C1` (Silly) “Turtle Tiptoe” — precise short moves to hit a small target.
2. `K_S1C2` (Intriguing) “Corner Case” — turn the *right* direction with minimal steps.
3. `K_S1C3` (Silly) “Snack Trail” — draw a line to “deliver a cookie” without leaving the canvas.
4. `K_S1C4` (Intriguing) “Mirror Maze” — same path but mirrored; learners infer symmetry.
5. `K_S1C5` (Silly) “Wiggle Worm” — alternating turns to form a wiggle to the target.
6. `K_S1C6` (Intriguing) “The Shortest Path” — reach target using ≤ 3 commands.
7. `K_S1C7` (Silly) “Dance Dance Turtle” — repeat a 2‑move dance pattern to win.

**Set 2 (New concepts): `K_S2` (introduce pen up/down + simple art)**
1. `K_S2C1` (Silly) “Invisible Turtle” — `penUp()` move, then `penDown()` draw.
2. `K_S2C2` (Intriguing) “Draw Only the Bridge” — draw a line segment between two points.
3. `K_S2C3` (Silly) “Rainbow Scribble” — switch `penColor(...)` mid‑path.
4. `K_S2C4` (Intriguing) “Two Colors, One Goal” — must reach target while coloring segments by rule.
5. `K_S2C5` (Silly) “Turtle Paint Spill” — draw a “puddle” by looping a square-ish path.
6. `K_S2C6` (Intriguing) “Exact Outline” — trace a simple outline (L shape) precisely.
7. `K_S2C7` (Silly) “Signature Squiggle” — create a personal “logo” with 6–10 moves.

---

### Grade 1 (G1)

**Set 1 (Reinforcement of K): `G1_S1` (harder precision + pen control)**
1. `G1_S1C1` (Silly) “Don’t Wake the Cat” — draw quietly: avoid drawing in a forbidden zone.
2. `G1_S1C2` (Intriguing) “Exact Turn Mystery” — deduce the missing angle to align perfectly.
3. `G1_S1C3` (Silly) “Spaghetti Bridge” — use `penUp()` to “jump” gaps.
4. `G1_S1C4` (Intriguing) “Two Targets, One Run” — hit target A then B with one code run.
5. `G1_S1C5` (Silly) “Color Clap” — alternate colors each segment (manual).
6. `G1_S1C6` (Intriguing) “Boundary Boss” — keep turtle within bounds; small target.
7. `G1_S1C7` (Silly) “Turtle Parade” — draw a simple repeating pattern across the screen.

**Set 2 (New concepts): `G1_S2` (repeat loops + nested repeat intro)**
1. `G1_S2C1` (Silly) “Repeat After Me” — first `repeat 4 { forward; turn }`.
2. `G1_S2C2` (Intriguing) “Square Cipher” — discover loop count/turn to form a square.
3. `G1_S2C3` (Silly) “Robot Hiccups” — fix a loop that repeats one too many times.
4. `G1_S2C4` (Intriguing) “Nested Box” — `repeat` inside `repeat` to make a grid.
5. `G1_S2C5` (Silly) “Sprinkler Spin” — draw a starburst with repeated turns.
6. `G1_S2C6` (Intriguing) “Pattern Proof” — must use a loop; no duplicated lines allowed.
7. `G1_S2C7` (Silly) “Loop‑de‑Loop Lagoon” — loop a fun pattern to reach a big target.

---

### Grade 2 (G2)

**Set 1 (Reinforcement of G1): `G2_S1` (harder loops + precision art)**
1. `G2_S1C1` (Silly) “Squarezilla Returns” — perfect square using the smallest code.
2. `G2_S1C2` (Intriguing) “Angle Detective” — choose turns to make a mystery polygon.
3. `G2_S1C3` (Silly) “Turtle Echo” — repeat a pattern; make it symmetric.
4. `G2_S1C4` (Intriguing) “Nested Steps” — nested `repeat` to draw staircase.
5. `G2_S1C5` (Silly) “Confetti Lines” — color changes inside a loop.
6. `G2_S1C6` (Intriguing) “Constraint Puzzle” — must solve using exactly 2 loops.
7. `G2_S1C7` (Silly) “Carwash Mode” — pen up/down in a loop for dashed shapes.

**Set 2 (New concepts): `G2_S2` (introduce functions as “recipes”)**
1. `G2_S2C1` (Silly) “Recipe: Square Sandwich” — write `function square()`.
2. `G2_S2C2` (Intriguing) “Function Factory” — reuse function to solve 2 targets.
3. `G2_S2C3` (Silly) “Oops I Copied It” — refactor copy‑paste into a function.
4. `G2_S2C4` (Intriguing) “Two Functions, One Picture” — combine square + triangle.
5. `G2_S2C5` (Silly) “Function Name Game” — silly names, correct behavior.
6. `G2_S2C6` (Intriguing) “Call Order Puzzle” — only the right call order completes the drawing.
7. `G2_S2C7` (Silly) “House Party” — draw a house using functions.

---

### Grade 3 (G3)

**Set 1 (Reinforcement of G2): `G3_S1` (functions + loops together)**
1. `G3_S1C1` (Silly) “Square Stampede” — function called in a loop.
2. `G3_S1C2` (Intriguing) “Decompose the Mystery” — break a shape into 2–3 functions.
3. `G3_S1C3` (Silly) “Turtle Choir” — repeat a “note pattern” function.
4. `G3_S1C4` (Intriguing) “Minimum Functions” — solve using exactly 2 functions.
5. `G3_S1C5` (Silly) “Waffle Blueprint” — nested repeat calling a function.
6. `G3_S1C6` (Intriguing) “Bug Hunt” — fix a function with a subtle turn mistake.
7. `G3_S1C7` (Silly) “Stamp Your Initials” — define functions for letters.

**Set 2 (New concepts): `G3_S2` (function parameters)**
1. `G3_S2C1` (Silly) “Size Matters” — `function square(size)`.
2. `G3_S2C2` (Intriguing) “Param Puzzle” — choose size values to fit a target outline.
3. `G3_S2C3` (Silly) “Tiny‑Huge‑Tiny” — same function, different sizes.
4. `G3_S2C4` (Intriguing) “Two Params” — e.g., rectangle width/height.
5. `G3_S2C5` (Silly) “Spinning Pizza Slices” — parameterized turn/length.
6. `G3_S2C6` (Intriguing) “Reusable Geometry” — build a complex shape from param blocks.
7. `G3_S2C7` (Silly) “Logo Maker” — parameterized patterns for a brand‑style icon.

---

### Grade 4 (G4)

**Set 1 (Reinforcement of G3): `G4_S1` (parameters + composition)**
1. `G4_S1C1` (Silly) “Square Stack” — parameterized squares in a loop.
2. `G4_S1C2` (Intriguing) “Fit the Frame” — choose params so art stays inside bounds.
3. `G4_S1C3` (Silly) “Turtle Tunnel” — repeated shapes shrinking/growing by parameter.
4. `G4_S1C4` (Intriguing) “Order of Operations (No Variables Yet)” — solve a sizing riddle.
5. `G4_S1C5` (Silly) “Hat Parade” — draw multiple hats with different sizes.
6. `G4_S1C6` (Intriguing) “Refactor Challenge” — reduce line count using parameters.
7. `G4_S1C7` (Silly) “Pattern Printer” — repeat calls to make wallpaper.

**Set 2 (New concepts): `G4_S2` (variables + arithmetic)**
1. `G4_S2C1` (Silly) “Var the Pirate” — `var steps = 50`, then use it.
2. `G4_S2C2` (Intriguing) “Math Map” — compute a distance (simple arithmetic) before moving.
3. `G4_S2C3` (Silly) “Growing Spiral” — increase a variable each loop.
4. `G4_S2C4` (Intriguing) “Hidden Pattern” — variable controls turn/length to reveal a shape.
5. `G4_S2C5` (Silly) “Jellyfish Tentacles” — variable lengths make tentacles.
6. `G4_S2C6` (Intriguing) “Two Variables” — width + height variables drive a drawing.
7. `G4_S2C7` (Silly) “Rocket Launch” — variable speed/length illusion (distance increments).

---

### Grade 5 (G5)

**Set 1 (Reinforcement of G4): `G5_S1` (variables + loops + functions)**
1. `G5_S1C1` (Silly) “Variable Volcano” — variable grows, but must not overflow bounds.
2. `G5_S1C2` (Intriguing) “Equation Escape” — solve a sizing equation to hit target.
3. `G5_S1C3` (Silly) “Spiral Snail” — spiral using variables and loops.
4. `G5_S1C4` (Intriguing) “Param + Var Combo” — function uses variable inputs.
5. `G5_S1C5` (Silly) “Turtle Billboard” — draw a sign using variable dimensions.
6. `G5_S1C6` (Intriguing) “Least Lines” — minimize code length under constraints.
7. `G5_S1C7` (Silly) “Mega Pattern” — make repeating art with a growth rule.

**Set 2 (New concepts): `G5_S2` (conditionals + else)**
1. `G5_S2C1` (Silly) “If the Turtle Fits…” — if near edge, turn.
2. `G5_S2C2` (Intriguing) “Logic Lock” — combine comparisons to unlock a path.
3. `G5_S2C3` (Silly) “Mood Ring” — change `penColor` based on a condition.
4. `G5_S2C4` (Intriguing) “If/Else Maze” — two branches; only one reaches target.
5. `G5_S2C5` (Silly) “Wall Bounce Remix” — bounce rules with else branch.
6. `G5_S2C6` (Intriguing) “Truth Table Art” — use `&&` / `||` to control segments.
7. `G5_S2C7` (Silly) “Turtle Judge” — silly “courtroom” rules decide what to draw.

---

### Grade 6 (G6)

**Set 1 (Reinforcement of G5): `G6_S1` (harder branching + constraints)**
1. `G6_S1C1` (Silly) “Bouncer Turtle” — bounce in a box without leaving.
2. `G6_S1C2` (Intriguing) “Branching Proof” — must use both `if` and `else`.
3. `G6_S1C3` (Silly) “Color Rules Lawyer” — enforce silly color laws with logic.
4. `G6_S1C4` (Intriguing) “Edge Cases” — handle multiple boundary conditions.
5. `G6_S1C5` (Silly) “Turtle Weather” — logic decides sunny/rainy colors.
6. `G6_S1C6` (Intriguing) “Constraint Solver” — solve with ≤ X steps and ≤ Y repeats.
7. `G6_S1C7` (Silly) “Dungeon Patrol” — patrol pattern reacts to walls.

**Set 2 (New concepts): `G6_S2` (coordinate thinking / requires `goto(x,y)` OR careful geometry)**
1. `G6_S2C1` (Silly) “Teleport Turtle” — introduce `goto(x,y)` to jump.
2. `G6_S2C2` (Intriguing) “Plot the Points” — draw between coordinate points.
3. `G6_S2C3` (Silly) “Connect‑the‑Dots Monster” — make a silly creature from points.
4. `G6_S2C4` (Intriguing) “Transform Puzzle” — translate a shape by (dx, dy).
5. `G6_S2C5` (Silly) “Alien Constellation” — draw a constellation pattern.
6. `G6_S2C6` (Intriguing) “Precision Polygon” — coordinates must form a target outline.
7. `G6_S2C7` (Silly) “Treasure Map” — visit points in the right order to “dig”.

---

### Grade 7 (G7)

**Set 1 (Reinforcement of G6): `G7_S1` (coordinate + branching combos)**
1. `G7_S1C1` (Silly) “GPS Turtle” — if off-course, correct heading.
2. `G7_S1C2` (Intriguing) “Shortest Route” — visit 3 points with minimal travel.
3. `G7_S1C3` (Silly) “Lost in Space” — silly story; coordinate recovery path.
4. `G7_S1C4` (Intriguing) “Collision Rules” — logic decides when to draw.
5. `G7_S1C5` (Silly) “Drawbot Safety” — avoid forbidden rectangles.
6. `G7_S1C6` (Intriguing) “Constraint Optimization” — smallest repeats + correct shape.
7. `G7_S1C7` (Silly) “Turtle Taxi” — pick up/deliver to coordinate points.

**Set 2 (New concepts): `G7_S2` (modular design + “spec compliance”)**
1. `G7_S2C1` (Silly) “Function Bureaucracy” — every action must be via a function.
2. `G7_S2C2` (Intriguing) “Spec Sheet” — draw a shape matching exact written specs.
3. `G7_S2C3` (Silly) “Oops, Wrong Units” — fix scale using variables.
4. `G7_S2C4` (Intriguing) “Pattern API” — implement functions named by spec.
5. `G7_S2C5` (Silly) “Turtle Manufacturing” — produce 5 identical widgets.
6. `G7_S2C6` (Intriguing) “Hidden Tests” — pass constraints (length/turn counts).
7. `G7_S2C7` (Silly) “Logo Contract” — silly client demands a weird logo spec.

---

### Grade 8 (G8)

**Set 1 (Reinforcement of G7): `G8_S1` (hard specs + modularity)**
1. `G8_S1C1` (Silly) “Over‑engineered Square” — unnecessary but structured solution.
2. `G8_S1C2` (Intriguing) “Refactor Puzzle” — same output, fewer steps.
3. `G8_S1C3` (Silly) “Turtle Orchestra” — multiple patterns via functions.
4. `G8_S1C4` (Intriguing) “Invariants” — maintain a rule across loops.
5. `G8_S1C5` (Silly) “Quality Control” — reject bad turns, fix logic.
6. `G8_S1C6` (Intriguing) “Constraint Ladder” — win with stricter constraints each attempt.
7. `G8_S1C7` (Silly) “Pixel‑Art Turtle” — draw blocky art with a grid idea.

**Set 2 (New concepts): `G8_S2` (algorithmic patterns: spirals, stars, tiling)**
1. `G8_S2C1` (Silly) “Spiral of Doom” — controlled spiral w/ variables.
2. `G8_S2C2` (Intriguing) “Star Polygon” — choose angles to make a star.
3. `G8_S2C3` (Silly) “Turtle Snowflake” — symmetric pattern via loops.
4. `G8_S2C4` (Intriguing) “Tiling Challenge” — cover an area with repeated shapes.
5. `G8_S2C5` (Silly) “Hypnotic Donut” — ring pattern.
6. `G8_S2C6` (Intriguing) “Parameter Search” — find parameter values to match a target.
7. `G8_S2C7` (Silly) “Wallpaper Wizard” — generate a repeating wallpaper.

---

### Grade 9 (G9)

**Set 1 (Reinforcement of G8): `G9_S1` (harder pattern constraints)**
1. `G9_S1C1` (Silly) “Too Many Stars” — reduce duplication with functions.
2. `G9_S1C2` (Intriguing) “Precision Symmetry” — mirror/rotate constraints.
3. `G9_S1C3` (Silly) “Turtle Tattoo” — draw a “tattoo” with strict size rules.
4. `G9_S1C4` (Intriguing) “Optimization” — minimize total steps executed.
5. `G9_S1C5` (Silly) “Oops All Parameters” — everything driven by variables.
6. `G9_S1C6` (Intriguing) “Spec Compliance v2” — pass written requirements exactly.
7. `G9_S1C7` (Silly) “Pattern Meme” — silly template art with constraints.

**Set 2 (New concepts): `G9_S2` (formal logic + structured design)**
1. `G9_S2C1` (Silly) “Boolean Burrito” — combine `&&` / `||` conditions.
2. `G9_S2C2` (Intriguing) “Logic Maze” — decisions based on x/y/angle.
3. `G9_S2C3` (Silly) “Color Law Book” — rule-based coloring with else chains.
4. `G9_S2C4` (Intriguing) “State Machine Lite” — switch behaviors based on variables.
5. `G9_S2C5` (Silly) “Robot Mood Swing” — variable controls behavior.
6. `G9_S2C6` (Intriguing) “Proof by Construction” — satisfy a set of logical constraints.
7. `G9_S2C7` (Silly) “Turtle Trial” — silly courtroom: justify your logic.

---

### Grade 10 (G10)

**Set 1 (Reinforcement of G9): `G10_S1` (logic + specs + efficiency)**
1. `G10_S1C1` (Silly) “Overruled!” — fix a bad condition chain.
2. `G10_S1C2` (Intriguing) “Minimal Branches” — same behavior, fewer conditions.
3. `G10_S1C3` (Silly) “Turtle Bureaucracy 2” — everything via functions.
4. `G10_S1C4` (Intriguing) “Constraint Triathlon” — code length + execution steps + style constraints.
5. `G10_S1C5` (Silly) “Rule‑Based Confetti” — deterministic color rules.
6. `G10_S1C6` (Intriguing) “Hidden Tests v2” — must satisfy multiple checks.
7. `G10_S1C7` (Silly) “Logo Lawsuit” — client spec changed; update code safely.

**Set 2 (New concepts): `G10_S2` (capstone mini‑projects as 7 “challenges”)**
1. `G10_S2C1` (Silly) “Brand New Brand” — define a logo API (functions) from spec.
2. `G10_S2C2` (Intriguing) “Geometric Proof Art” — demonstrate a property via drawing.
3. `G10_S2C3` (Silly) “Turtle Comic Strip” — 3 panels using reusable functions.
4. `G10_S2C4` (Intriguing) “Parametric Tile” — design one tile; repeat to fill.
5. `G10_S2C5` (Silly) “Boss Level Template” — create a template others can tweak.
6. `G10_S2C6` (Intriguing) “Performance Budget” — must stay under execution limit.
7. `G10_S2C7` (Silly) “Showcase Piece” — final art with constraints.

---

### Grade 11 (G11)

**Set 1 (Reinforcement of G10): `G11_S1` (hard capstone constraints)**
1. `G11_S1C1` (Silly) “Too Serious Turtle” — strict rules, silly output.
2. `G11_S1C2` (Intriguing) “Refactor Like a Pro” — restructure into clean modules.
3. `G11_S1C3` (Silly) “Function Soup” — clean up messy naming.
4. `G11_S1C4` (Intriguing) “Spec v3” — implement exact requirements.
5. `G11_S1C5` (Silly) “Debug Drama” — fix 3 bugs in a given program.
6. `G11_S1C6` (Intriguing) “Constraint Solver v2” — multiple budgets.
7. `G11_S1C7` (Silly) “Turtle Portfolio” — produce a portfolio pattern set.

**Set 2 (New concepts): `G11_S2` (advanced modeling; optional engine additions)**
1. `G11_S2C1` (Silly) “Seeded Random Rain” — controlled randomness (optional).
2. `G11_S2C2` (Intriguing) “Deterministic Generative Art” — same seed, same art.
3. `G11_S2C3` (Silly) “Chaos (But Safe)” — bounded random rules.
4. `G11_S2C4` (Intriguing) “Geometry Transforms” — translate/rotate composed shapes.
5. `G11_S2C5` (Silly) “Alien City” — generate a city skyline.
6. `G11_S2C6` (Intriguing) “Design System” — build a tiny drawing “library”.
7. `G11_S2C7` (Silly) “Gallery Submission” — final piece with a brief.

---

### Grade 12 (G12)

**Set 1 (Reinforcement of G11): `G12_S1` (portfolio-grade constraints)**
1. `G12_S1C1` (Silly) “Turtle Thesis (Tiny)” — say something serious with silly art.
2. `G12_S1C2` (Intriguing) “Architecture Challenge” — organize code into layers.
3. `G12_S1C3` (Silly) “Bug Court Supreme” — explain + fix logic issues.
4. `G12_S1C4` (Intriguing) “Formal Spec” — implement written spec exactly.
5. `G12_S1C5` (Silly) “Rewrite Without Changing Output” — refactor only.
6. `G12_S1C6` (Intriguing) “Performance + Clarity” — meet a budget and readability rules.
7. `G12_S1C7` (Silly) “Final Boss Turtle” — a fun boss-level drawing constraint.

**Set 2 (New concepts): `G12_S2` (capstone showcase + “teach others”)**
1. `G12_S2C1` (Silly) “Tutorial Turtle” — write code that is also a lesson (clear steps).
2. `G12_S2C2` (Intriguing) “Mini-Framework” — define a reusable drawing toolkit.
3. `G12_S2C3` (Silly) “Make a Meme Template” — parameterized meme art.
4. `G12_S2C4` (Intriguing) “Constraint Generator” — create a new challenge spec.
5. `G12_S2C5` (Silly) “Community Pack” — 3 mini patterns with documentation.
6. `G12_S2C6` (Intriguing) “Evaluation Criteria” — pass a rubric: symmetry, reuse, budget.
7. `G12_S2C7` (Silly) “Graduation Badge” — final celebratory drawing.

---

## D. Approval Questions (choose defaults)

1) For grades **6–12**, do you approve adding small engine features (`goto`, etc.), or keep strictly to current features?
2) Do you want **exactly 2 sets per grade for launch**, or add more sets (up to 5) for specific grades?
3) Should sets be named (e.g., “Set 1: Reinforcement”, “Set 2: New Ideas”) in the UI, or just numbered?

