console.log("Welcome to the Coding Challenge site!");

// --- Global App State ---
let ALL_DATA = {}; // Will be populated by fetching json files
const state = {
    turtle: { x: 0, y: 0, angle: 0, penDown: true, color: 'black' },
    lines: [],
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
    turtleIcon.style.left = `${clampedX}px`;
    turtleIcon.style.top = `${clampedY}px`;
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
    const gradeOrder = ['K', '1', '2'];

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
        }
    };

    // Set default layout
    if (ALL_DATA.layouts.default) {
        const defaultOption = layoutSelect.querySelector('option[value="default"]');
        if (defaultOption) defaultOption.selected = true;
        challengeLayout.style.gridTemplateAreas = ALL_DATA.layouts.default.areas.join(' ');
    }
}

function initChallengePage() {
    const canvas = document.getElementById('turtle-canvas');
    turtleIcon = document.getElementById('turtle-icon');
    if (!canvas || !turtleIcon) return;
    ctx = canvas.getContext('2d');

    const urlParams = new URLSearchParams(window.location.search);
    const challengeId = urlParams.get('id') || 'K_S1C1';
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

function executeLines(lines) {
    const commandRegex = /(\w+)\s*\(\s*(.*)\s*\)/;
    const repeatStartRegex = /repeat\s+(\d+)\s*{/;
    const repeatEndRegex = /}/;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        // Check for repeat block start
        const repeatMatch = line.match(repeatStartRegex);
        if (repeatMatch) {
            const count = parseInt(repeatMatch[1], 10);
            const blockLines = [];
            let depth = 1;
            i++; // Move to next line

            while (i < lines.length && depth > 0) {
                let innerLine = lines[i];
                if (innerLine.trim().match(repeatStartRegex)) {
                    depth++;
                } else if (innerLine.trim().match(repeatEndRegex)) {
                    depth--;
                }

                if (depth > 0) {
                    blockLines.push(innerLine);
                    i++;
                }
            }

            // Execute block lines 'count' times
            for (let k = 0; k < count; k++) {
                executeLines(blockLines);
            }
            continue; // Loop continues after the closing brace
        }

        // Standard commands
        const match = line.match(commandRegex);
        if (match) {
            const command = match[1].toLowerCase();
            const args = match[2].trim();

            // Remove quotes if present for string args
            const cleanArgs = args.replace(/^["']|["']$/g, '');

            if (command === 'forward') forward(parseInt(cleanArgs, 10));
            else if (command === 'turn') turn(parseInt(cleanArgs, 10));
            else if (command === 'penup') penUp();
            else if (command === 'pendown') penDown();
            else if (command === 'pencolor') penColor(cleanArgs);
            else {
                throw new Error(`I don't know the command '${command}'.`);
            }
        } else {
            throw new Error(`I don't understand this line: "${line}". Check your spelling or parentheses.`);
        }
    }
}

// --- Main Execution ---
function main() {
    const challengeDataPromise = fetch('challenges.json').then(res => res.json());
    const layoutDataPromise = fetch('layouts.json').then(res => res.json());

    Promise.all([challengeDataPromise, layoutDataPromise])
        .then(([challengeData, layoutData]) => {
            ALL_DATA = { ...challengeData, layouts: layoutData };

            if (document.getElementById('challenge-selection')) {
                initIndexPage();
            } else if (document.querySelector('.challenge-layout')) {
                initChallengePage();
            }
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
}

main(); // Run the application
