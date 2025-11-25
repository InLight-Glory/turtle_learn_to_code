console.log("Welcome to the Coding Challenge site!");

// --- Global App State ---
// ALL_DATA is loaded from data.js
let ALL_DATA = window.ALL_DATA || {};
const state = {
    turtle: { x: 0, y: 0, angle: 0, penDown: true, color: 'black' },
    lines: [],
    functions: {},
    vars: {},
    currentChallenge: null
};
let ctx;
let turtleIcon;

// --- Render Engine ---
function render() {
    if (!ctx || !turtleIcon || !state.currentChallenge) return;
    const canvas = document.getElementById('turtle-canvas');
    if (canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);

    const target = state.currentChallenge.target;
    if (target) {
        ctx.beginPath();
        ctx.arc(target.x, target.y, target.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.strokeStyle = 'orange';
        ctx.stroke();
    }

    state.lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(line.to.x, line.to.y);
        ctx.strokeStyle = line.color || 'black';
        ctx.stroke();
    });

    // Clamp turtle position to stay within canvas bounds
    const canvasWidth = canvas ? canvas.width : 400;
    const canvasHeight = canvas ? canvas.height : 400;
    let clampedX = Math.max(0, Math.min(state.turtle.x, canvasWidth));
    let clampedY = Math.max(0, Math.min(state.turtle.y, canvasHeight));

    // Get the actual displayed size of the canvas to calculate scale
    const displayedWidth = canvas ? canvas.offsetWidth : canvasWidth;
    const displayedHeight = canvas ? canvas.offsetHeight : canvasHeight;
    const scaleX = displayedWidth / canvasWidth;
    const scaleY = displayedHeight / canvasHeight;

    // Position turtle icon relative to the displayed canvas size
    turtleIcon.style.left = `${clampedX * scaleX}px`;
    turtleIcon.style.top = `${clampedY * scaleY}px`;
    turtleIcon.style.transform = `translate(-50%, -50%) rotate(${state.turtle.angle + 90}deg)`;
}

// --- State & Movement Logic ---
function reset() {
    if (!state.currentChallenge) return;
    const start = state.currentChallenge.startPosition;
    state.turtle.x = start.x;
    state.turtle.y = start.y;
    state.turtle.angle = start.angle;
    state.turtle.penDown = true;
    state.turtle.color = 'black';
    state.lines = [];
    state.functions = {};
    state.vars = {};
    render();
}

function forward(distance) {
    const angleInRadians = state.turtle.angle * Math.PI / 180;
    const newX = state.turtle.x + distance * Math.cos(angleInRadians);
    const newY = state.turtle.y + distance * Math.sin(angleInRadians);
    if (state.turtle.penDown) {
        state.lines.push({
            from: { x: state.turtle.x, y: state.turtle.y },
            to: { x: newX, y: newY },
            color: state.turtle.color
        });
    }
    state.turtle.x = newX;
    state.turtle.y = newY;
}

function turn(degrees) {
    state.turtle.angle += degrees;
}

function penUp() {
    state.turtle.penDown = false;
}

function penDown() {
    state.turtle.penDown = true;
}

function penColor(color) {
    state.turtle.color = color;
}

function checkWinCondition() {
    if (!state.currentChallenge || !state.currentChallenge.target) return;
    const target = state.currentChallenge.target;
    const distance = Math.sqrt(Math.pow(state.turtle.x - target.x, 2) + Math.pow(state.turtle.y - target.y, 2));
    if (distance < target.radius) {
        const id = state.currentChallenge.id;
        let completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
        if (!completed.includes(id)) {
            completed.push(id);
            localStorage.setItem('completedChallenges', JSON.stringify(completed));
        }
        showWinModal();
    }
}

function showWinModal() {
    const modal = document.getElementById('win-modal');
    if (modal) {
        modal.classList.add('show');
        // Add fireworks or celebration sound here later?
    } else {
        alert("Congratulations! You completed the challenge!");
    }
}

function initModal() {
    const modal = document.getElementById('win-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    if (modal && closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.remove('show');
            window.location.href = 'index.html'; // Return to menu on close
        };
    }
}

// --- Page Initializers & UI Logic ---
function loadChallenge(id) {
    const challenge = ALL_DATA.challenges[id];
    if (!challenge) return;
    state.currentChallenge = { ...challenge, id: id };

    const titleEl = document.getElementById('challenge-title');
    const instructionsEl = document.getElementById('challenge-instructions');
    if (titleEl) titleEl.textContent = challenge.title;
    if (instructionsEl) instructionsEl.innerHTML = (challenge.goal || '') + "<br><br>" + (challenge.learningObjective || '');

    reset();
}

function populateChallengeList(grade, set) {
    const challengeList = document.getElementById('challenge-list');
    challengeList.innerHTML = '';

    const challengeIds = ALL_DATA.curriculum[grade][set];
    if (!challengeIds) return;

    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');

    challengeIds.forEach(id => {
        const challenge = ALL_DATA.challenges[id];
        if (challenge) {
            const link = document.createElement('a');
            link.href = `challenge.html?id=${id}`;
            link.innerHTML = `<h4>${challenge.title}</h4><p>${challenge.goal || ''}</p>`;
            if (completed.includes(id)) {
                link.classList.add('completed-challenge');
            }
            challengeList.appendChild(link);
        }
    });
}

function populateSetButtons(grade) {
    const setSelection = document.getElementById('set-selection');
    setSelection.innerHTML = '';
    const challengeList = document.getElementById('challenge-list');
    challengeList.innerHTML = '';

    const sets = ALL_DATA.curriculum[grade];
    Object.keys(sets).forEach((set, index) => {
        const btn = document.createElement('button');
        btn.className = 'grade-btn';
        btn.textContent = `Set ${set}`;
        btn.onclick = () => {
            document.querySelectorAll('#set-selection .grade-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            populateChallengeList(grade, set);
        };
        setSelection.appendChild(btn);
        if (index === 0) btn.click();
    });
}

function initIndexPage() {
    const gradeSelection = document.getElementById('grade-selection');
    const gradeOrder = ['K', '1', '2', '3', '4', '5'];

    gradeOrder.forEach((grade, index) => {
        if (!ALL_DATA.curriculum[grade]) return;
        const btn = document.createElement('button');
        btn.className = 'grade-btn';
        btn.textContent = `Grade ${grade}`;
        btn.onclick = () => {
            document.querySelectorAll('#grade-selection .grade-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            populateSetButtons(grade);
        };
        gradeSelection.appendChild(btn);
        if (index === 0) btn.click();
    });
}

function initLayoutSwitcher() {
    const layoutSelect = document.getElementById('layout-select');
    const challengeLayout = document.querySelector('.challenge-layout');
    if (!layoutSelect || !challengeLayout) return;

    for (const key in ALL_DATA.layouts) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = ALL_DATA.layouts[key].title;
        layoutSelect.appendChild(option);
    }

    layoutSelect.onchange = (e) => {
        const selectedLayoutKey = e.target.value;
        const layout = ALL_DATA.layouts[selectedLayoutKey];
        if (layout) {
            challengeLayout.style.gridTemplateAreas = layout.areas.join(' ');

            // Toggle full-width class for side-by-side layout
            const mainEl = document.querySelector('main');
            if (selectedLayoutKey === 'side-by-side') {
                mainEl.classList.add('layout-full-width');
            } else {
                mainEl.classList.remove('layout-full-width');
            }

            // Force re-render to update turtle position based on new canvas size/position
            setTimeout(render, 0);
        }
    };

    // Set default layout
    if (ALL_DATA.layouts.default) {
        const defaultOption = layoutSelect.querySelector('option[value="default"]');
        if (defaultOption) defaultOption.selected = true;
        challengeLayout.style.gridTemplateAreas = ALL_DATA.layouts.default.areas.join(' ');

        // Ensure class is unset initially if default is not side-by-side
        const mainEl = document.querySelector('main');
        if (mainEl) mainEl.classList.remove('layout-full-width');
    }
}

function initChallengePage() {
    const canvas = document.getElementById('turtle-canvas');
    turtleIcon = document.getElementById('turtle-icon');
    if (!canvas || !turtleIcon) return;
    ctx = canvas.getContext('2d');

    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('id') || 'G1_S1C1';
    loadChallenge(challengeId);
    initLayoutSwitcher();
    initModal();

    const runCodeBtn = document.getElementById('run-code-btn');
    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', () => {
            const codeEditor = document.getElementById('code-editor');
            parseAndExecute(codeEditor.value);
        });
    }
}

function parseAndExecute(code) {
    reset();
    clearError();
    const lines = code.split('\n');
    try {
        executeLines(lines);
        render();
        checkWinCondition();
    } catch (e) {
        showError(e.message);
    }
}

function showError(msg) {
    const errEl = document.getElementById('error-message');
    if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
    }
}

function clearError() {
    const errEl = document.getElementById('error-message');
    if (errEl) {
        errEl.style.display = 'none';
        errEl.textContent = '';
    }
}

function executeLines(lines, argsMap = {}) {
    const commandRegex = /(\w+)\s*\(\s*(.*)\s*\)/;
    const repeatStartRegex = /repeat\s+(\d+)\s*{/;
    const ifStartRegex = /if\s*\((.+)\)\s*{/;
    const functionStartRegex = /function\s+(\w+)\s*\((.*)\)\s*{/;
    const varRegex = /var\s+(\w+)\s*=\s*(.*)/;
    const endBlockRegex = /}/;

    // Pre-pass to define functions?
    // Or just handle definitions as we encounter them (hoisting might be too complex for now).
    // Let's handle definitions as we see them.

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        // Check for Variable Definition
        const varMatch = line.match(varRegex);
        if (varMatch) {
            const varName = varMatch[1];
            let value = varMatch[2];
            // Resolve value if it's another variable or param
            if (argsMap[value] !== undefined) value = argsMap[value];
            else if (state.vars[value] !== undefined) value = state.vars[value];

            state.vars[varName] = value;
            continue;
        }

        // Check for Function Definition
        const funcMatch = line.match(functionStartRegex);
        if (funcMatch) {
            const funcName = funcMatch[1];
            const params = funcMatch[2].split(',').map(p => p.trim()).filter(p => p);
            const blockLines = [];
            let depth = 1;
            i++;

            while (i < lines.length && depth > 0) {
                let innerLine = lines[i];
                // Check for nested blocks (loops or other functions? Nested functions not supported yet)
                if (innerLine.trim().match(repeatStartRegex) || innerLine.trim().match(functionStartRegex)) {
                    depth++;
                } else if (innerLine.trim().match(endBlockRegex)) {
                    depth--;
                }

                if (depth > 0) {
                    blockLines.push(innerLine);
                    i++;
                }
            }
            state.functions[funcName] = { lines: blockLines, params: params };
            continue;
        }

        // Check for Repeat Loop
        const repeatMatch = line.match(repeatStartRegex);
        if (repeatMatch) {
            const count = parseInt(repeatMatch[1], 10);
            const blockLines = [];
            let depth = 1;
            i++;

            while (i < lines.length && depth > 0) {
                let innerLine = lines[i];
                if (innerLine.trim().match(repeatStartRegex) || innerLine.trim().match(ifStartRegex) || innerLine.trim().match(functionStartRegex)) {
                    depth++;
                } else if (innerLine.trim().match(endBlockRegex)) {
                    depth--;
                }

                if (depth > 0) {
                    blockLines.push(innerLine);
                    i++;
                }
            }

            for (let k = 0; k < count; k++) {
                executeLines(blockLines, argsMap);
            }
            continue;
        }

        // Check for If Condition
        const ifMatch = line.match(ifStartRegex);
        if (ifMatch) {
            let conditionStr = ifMatch[1];
            // Resolve variables in condition (simple regex replace for known vars)
            // A proper parser would be better, but we'll do simple substitution for now.
            Object.keys(state.vars).forEach(v => {
                const regex = new RegExp(`\\b${v}\\b`, 'g');
                conditionStr = conditionStr.replace(regex, state.vars[v]);
            });
            Object.keys(argsMap).forEach(v => {
                const regex = new RegExp(`\\b${v}\\b`, 'g');
                conditionStr = conditionStr.replace(regex, argsMap[v]);
            });

            // Safe eval (sort of) - only allow math and comparisons
            // NOTE: This is a security risk in a real app, but acceptable for this contained sandbox environment?
            // Let's implement a safer evaluator for numbers and basic operators.
            let conditionResult = false;
            try {
                // Sanitize: allow numbers, operators, parens, true/false
                if (/^[\d\s+\-*/<>=!&|()truefalse.]+$/.test(conditionStr)) {
                    // eslint-disable-next-line no-new-func
                    conditionResult = new Function('return ' + conditionStr)();
                }
            } catch (e) {
                console.warn("Condition parse error", e);
            }

            const blockLines = [];
            let depth = 1;
            i++;

            while (i < lines.length && depth > 0) {
                let innerLine = lines[i];
                if (innerLine.trim().match(repeatStartRegex) || innerLine.trim().match(ifStartRegex) || innerLine.trim().match(functionStartRegex)) {
                    depth++;
                } else if (innerLine.trim().match(endBlockRegex)) {
                    depth--;
                }

                if (depth > 0) {
                    blockLines.push(innerLine);
                    i++;
                }
            }

            if (conditionResult) {
                executeLines(blockLines, argsMap);
            }
            continue;
        }

        // Standard commands or Function Calls
        const match = line.match(commandRegex);
        if (match) {
            const command = match[1]; // Case sensitive for function names? Let's make commands case-insensitive but functions strict or loose.
            // Let's try lower case for commands, but keep original for function check if needed.
            const lowerCommand = command.toLowerCase();
            let args = match[2].trim();

            // Substitute variables/params
            if (argsMap[args] !== undefined) {
                args = String(argsMap[args]);
            } else if (state.vars[args] !== undefined) {
                args = String(state.vars[args]);
            }

            const cleanArgs = args.replace(/^["']|["']$/g, '');

            if (lowerCommand === 'forward') forward(parseInt(cleanArgs, 10));
            else if (lowerCommand === 'turn') turn(parseInt(cleanArgs, 10));
            else if (lowerCommand === 'penup') penUp();
            else if (lowerCommand === 'pendown') penDown();
            else if (lowerCommand === 'pencolor') penColor(cleanArgs);
            else if (state.functions[command]) {
                // Execute User Function
                const funcDef = state.functions[command];
                // Handle new style {lines, params} or old style [lines] just in case
                // But we are overwriting, so assume new style.

                if (Array.isArray(funcDef)) {
                    // Fallback if somehow old format persists (shouldn't happen with clean reload)
                    executeLines(funcDef, argsMap);
                } else {
                    const callArgs = cleanArgs.split(',').map(a => a.trim());
                    const newArgsMap = {};
                    funcDef.params.forEach((param, index) => {
                        // resolve argument if it's a variable in current scope
                        let val = callArgs[index];
                        if (argsMap[val] !== undefined) val = argsMap[val];
                        newArgsMap[param] = val;
                    });
                    executeLines(funcDef.lines, newArgsMap);
                }
            }
            else {
                throw new Error(`I don't know the command '${command}'.`);
            }
        } else {
            // Ignore closing braces that might be lingering from sloppy parsing?
            if (line === '}') continue;
            throw new Error(`I don't understand this line: "${line}". Check your spelling or parentheses.`);
        }
    }
}

// --- Main Execution ---
function main() {
    // Wait for DOM content loaded if script runs before DOM
    if (!window.ALL_DATA) {
        console.error("ALL_DATA not found. Ensure data.js is loaded.");
        return;
    }
    ALL_DATA = window.ALL_DATA;

    if (document.getElementById('challenge-selection')) {
        initIndexPage();
    } else if (document.querySelector('.challenge-layout')) {
        initChallengePage();
    }
}

// If script is deferred, main runs immediately.
// If script is sync at bottom of body, it also runs immediately.
// But data.js must be loaded first.
main();
