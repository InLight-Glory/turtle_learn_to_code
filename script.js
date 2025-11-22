console.log("Welcome to the Coding Challenge site!");

// --- Global App State ---
const ALL_DATA = window.ALL_DATA; // Loaded from data.js
const state = {
    turtle: { x: 0, y: 0, angle: 0, penDown: true, color: 'black' },
    lines: [],
    currentChallenge: null,
    progress: { completedChallenges: [] }
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
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    // Clamp turtle position to stay within canvas bounds
    const canvasWidth = canvas ? canvas.width : 400;
    const canvasHeight = canvas ? canvas.height : 400;
    let clampedX = Math.max(0, Math.min(state.turtle.x, canvasWidth));
    let clampedY = Math.max(0, Math.min(state.turtle.y, canvasHeight));
    turtleIcon.style.left = `${clampedX}px`;
    turtleIcon.style.top = `${clampedY}px`;

    // Turtle emoji faces Left by default. 
    // Logical 0 is Right. 
    // We need to rotate 180 deg to make Left face Right.
    turtleIcon.style.transform = `translate(-50%, -50%) scaleX(-1) rotate(${state.turtle.angle}deg)`;
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

// --- Progress Management ---
function getProgress() {
    const progress = localStorage.getItem('codingChampionsProgress');
    return progress ? JSON.parse(progress) : { completedChallenges: [] };
}

function saveProgress(progress) {
    localStorage.setItem('codingChampionsProgress', JSON.stringify(progress));
}

function checkWinCondition() {
    if (!state.currentChallenge || !state.currentChallenge.target) return;
    const target = state.currentChallenge.target;
    const distance = Math.sqrt(Math.pow(state.turtle.x - target.x, 2) + Math.pow(state.turtle.y - target.y, 2));
    if (distance < target.radius) {
        markChallengeCompleted(state.currentChallenge.id);
        setTimeout(() => alert("Congratulations! You completed the challenge!"), 100);
    }
}

// --- Page Initializers & UI Logic ---
function loadChallenge(id) {
    const challenge = ALL_DATA.challenges[id];
    if (!challenge) {
        console.error("Challenge not found:", id);
        return;
    }
    challenge.id = id; // Add id to the challenge object
    state.currentChallenge = challenge;

    const titleEl = document.getElementById('challenge-title');
    const instructionsEl = document.getElementById('challenge-instructions');
    if (titleEl) titleEl.textContent = challenge.title;
    if (instructionsEl) instructionsEl.innerHTML = (challenge.goal || '') + "<br><br>" + (challenge.learningObjective || '');

    reset();
}

function populateChallengeList(grade, set) {
    const challengeList = document.getElementById('challenge-list');
    challengeList.innerHTML = '';
    const completedChallenges = getCompletedChallenges();

    const challengeIds = ALL_DATA.curriculum[grade][set];
    if (!challengeIds) return;

    challengeIds.forEach(id => {
        const challenge = ALL_DATA.challenges[id];
        if (challenge) {
            const link = document.createElement('a');
            link.href = `challenge.html?id=${id}`;
            link.innerHTML = `<h4>${challenge.title}</h4><p>${challenge.goal || ''}</p>`;
            if (completedChallenges.has(id)) {
                link.classList.add('completed');
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
    state.progress = getProgress(); // Load progress on page init
    const gradeSelection = document.getElementById('grade-selection');
    const gradeOrder = Object.keys(ALL_DATA.curriculum).sort((a, b) => {
        if (a === 'K') return -1;
        if (b === 'K') return 1;
        return parseInt(a) - parseInt(b);
    });

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
    const mainContainer = document.querySelector('main .container');

    if (!layoutSelect || !challengeLayout) return;

    const applyLayout = (layoutKey) => {
        const layout = ALL_DATA.layouts[layoutKey];
        if (layout) {
            challengeLayout.style.gridTemplateAreas = layout.areas.join(' ');

            // Toggle full-width class for side-by-side layout
            if (layoutKey === 'side-by-side') {
                mainContainer.classList.add('full-width');
            } else {
                mainContainer.classList.remove('full-width');
            }
        }
    };

    layoutSelect.onchange = (e) => {
        applyLayout(e.target.value);
    };

    // Set default layout
    if (ALL_DATA.layouts.default) {
        layoutSelect.value = 'default';
        applyLayout('default');
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

    const runCodeBtn = document.getElementById('run-code-btn');
    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', async () => {
            runCodeBtn.disabled = true;
            const codeEditor = document.getElementById('code-editor');
            await parseAndExecute(codeEditor.value);
            runCodeBtn.disabled = false;
        });
    }

    // Enable Tab indentation in textarea
    const codeEditor = document.getElementById('code-editor');
    if (codeEditor) {
        codeEditor.addEventListener('keydown', function (e) {
            if (e.key == 'Tab') {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;

                // set textarea value to: text before caret + tab + text after caret
                this.value = this.value.substring(0, start) +
                    "\t" + this.value.substring(end);

                // put caret at right position again
                this.selectionStart = this.selectionEnd = start + 1;
            }
        });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function parseAndExecute(code) {
    reset();
    await sleep(100); // give turtle time to reset on screen

    const lines = code.split('\n');
    const commandRegex = /(\w+)\s*(?:\(\s*([^)]*)\s*\))?/;

    for (const line of lines) {
        // Skip comments and empty lines
        if (line.trim().startsWith('//') || line.trim() === '') continue;

        const match = line.trim().match(commandRegex);

        if (match) {
            const command = match[1].toLowerCase();
            const args = match[2] ? match[2].split(',').map(arg => arg.trim()) : [];

            // Handle commands
            if (command === 'forward' || command === 'fd') {
                const value = parseInt(args[0], 10);
                if (!isNaN(value)) forward(value);
            } else if (command === 'turn' || command === 'rt' || command === 'right') {
                const value = parseInt(args[0], 10);
                if (!isNaN(value)) turn(value);
            } else if (command === 'left' || command === 'lt') {
                const value = parseInt(args[0], 10);
                if (!isNaN(value)) turn(-value);
            } else if (command === 'penup' || command === 'pu') {
                state.turtle.penDown = false;
            } else if (command === 'pendown' || command === 'pd') {
                state.turtle.penDown = true;
            } else if (command === 'setcolor' || command === 'pencolor' || command === 'color') {
                // Remove quotes if present
                const color = args[0].replace(/['"]/g, '');
                state.turtle.color = color;
            }

            render();
            await sleep(200); // pause between commands
        }
    }
    checkWinCondition();
}

// --- Main Execution ---
function main() {
    // ALL_DATA is loaded from data.js and assigned to window.ALL_DATA
    if (!ALL_DATA) {
        console.error('ALL_DATA is not defined. Make sure data.js is loaded.');
        return;
    }

    if (document.getElementById('challenge-selection')) {
        initIndexPage();
    } else if (document.querySelector('.challenge-layout')) {
        initChallengePage();
    }
}

document.addEventListener('DOMContentLoaded', main); // Run the application after DOM is ready
