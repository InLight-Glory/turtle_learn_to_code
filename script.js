console.log("Welcome to the Coding Challenge site!");

// --- Global App State ---
let ALL_DATA = {}; // Will be populated by fetching json files
const state = {
    turtle: { x: 0, y: 0, angle: 0, penDown: true },
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
        ctx.strokeStyle = 'black';
        ctx.stroke();
    });

    turtleIcon.style.left = `${state.turtle.x}px`;
    turtleIcon.style.top = `${state.turtle.y}px`;
    turtleIcon.style.transform = `translate(-50%, -50%) rotate(${state.turtle.angle + 90}deg)`;
}

// --- State & Movement Logic ---
function reset() {
    if (!state.currentChallenge) return;
    const start = state.currentChallenge.startPosition;
    state.turtle.x = start.x;
    state.turtle.y = start.y;
    state.turtle.angle = start.angle;
    state.lines = [];
    render();
}

function forward(distance) {
    const angleInRadians = state.turtle.angle * Math.PI / 180;
    const newX = state.turtle.x + distance * Math.cos(angleInRadians);
    const newY = state.turtle.y + distance * Math.sin(angleInRadians);
    if (state.turtle.penDown) {
        state.lines.push({ from: { x: state.turtle.x, y: state.turtle.y }, to: { x: newX, y: newY } });
    }
    state.turtle.x = newX;
    state.turtle.y = newY;
}

function turn(degrees) {
    state.turtle.angle += degrees;
}

function checkWinCondition() {
    if (!state.currentChallenge || !state.currentChallenge.target) return;
    const target = state.currentChallenge.target;
    const distance = Math.sqrt(Math.pow(state.turtle.x - target.x, 2) + Math.pow(state.turtle.y - target.y, 2));
    if (distance < target.radius) {
        setTimeout(() => alert("Congratulations! You completed the challenge!"), 100);
    }
}

// --- Page Initializers & UI Logic ---
function loadChallenge(id) {
    const challenge = ALL_DATA.challenges[id];
    if (!challenge) return;
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

    const challengeIds = ALL_DATA.curriculum[grade][set];
    if (!challengeIds) return;

    challengeIds.forEach(id => {
        const challenge = ALL_DATA.challenges[id];
        if (challenge) {
            const link = document.createElement('a');
            link.href = `challenge.html?id=${id}`;
            link.innerHTML = `<h4>${challenge.title}</h4><p>${challenge.goal || ''}</p>`;
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
    const lines = code.split('\n');
    const commandRegex = /(\w+)\s*\(\s*(-?\d+)\s*\)/;
    lines.forEach(line => {
        const match = line.trim().match(commandRegex);
        if (match) {
            const command = match[1].toLowerCase();
            const value = parseInt(match[2], 10);
            if (command === 'forward') forward(value);
            else if (command === 'turn') turn(value);
        }
    });
    render();
    checkWinCondition();
}

// --- Main Execution ---
document.addEventListener('DOMContentLoaded', () => {
    const challengeDataPromise = fetch('challenges.json').then(res => res.json());
    const layoutDataPromise = fetch('layouts.json').then(res => res.json());

    Promise.all([challengeDataPromise, layoutDataPromise])
        .then(([challengeData, layoutData]) => {
            ALL_DATA = { ...challengeData, layouts: layoutData };

            if (document.getElementById('challenge-selection')) {
                initIndexPage();
            } else if (document.getElementById('challenge-layout')) {
                initChallengePage();
            }
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
});
