# Coding Champions

This project is a coding challenge site designed to help kids from 4 to 18 years old learn to code and become experts in problem-solving. The site will feature a series of challenges that ramp up in difficulty as the user progresses through different grade levels.

## Technology Stack

This project is being built using **HTML, CSS, and vanilla JavaScript**. The challenge curriculum and layouts are loaded dynamically from local **JSON** files.

## Project Roadmap

This roadmap outlines the current status of the project and the planned next steps.

### ✅ Phase 1: Foundation & Core Gameplay (Complete)
- **Static Site Structure:** The application is built on a simple and robust HTML, CSS, and JS foundation.
- **Data-Driven Content:** Challenge and layout data are externalized into `challenges.json` and `layouts.json`, allowing for easy content management.
- **Interactive Challenge UI:** The `challenge.html` page features a code editor, a visualization area, and instruction panels.
- **Core Gameplay Loop:** The application can parse user code (`forward`, `turn`), move a turtle icon on the screen, and check for a win condition against a target.
- **Dynamic Curriculum UI:** The landing page features a UI to select Grades and Sets, which dynamically displays the available challenges from the JSON data.
- **Customizable Layouts:** The challenge page includes a dropdown to dynamically change the page layout using CSS Grid.

### ✅ Phase 2: Enhancing the User Experience (Complete)
- **Client-Side Progress Tracking:** Implemented using `localStorage` to save user progress and visually mark completed challenges.
- **Expanded Turtle Command Set:** Implemented advanced commands including `penUp`, `penDown`, `penColor`, and loops (`repeat`).
- **Curriculum Content:** Curriculum expanded to cover Grades K-5 with support for Functions, Variables, and Conditionals.
- **Note on Code Editor:** Decision made to stick with a standard HTML `<textarea>` to avoid external dependencies, prioritizing stability and simplicity.

### 未来 Phase 3: Future Backend Integration (Future)
- **User Accounts:** Implement user registration and login.
- **Persistent Progress:** Save user progress to a server-side database.
- **Server-Side Code Validation:** For more complex challenges, implement a secure, server-side validation system.
