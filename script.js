console.log("Welcome to the Coding Challenge site!");

// --- State Management ---
const state = {
    turtle: {
        x: 0,
        y: 0,
        angle: 0,
        penDown: true,
    },
    lines: [],
    currentChallenge: null
};

let ctx; // Canvas 2D context
let turtleIcon;

// --- Render Engine ---
function render() {
    if (!ctx || !turtleIcon || !state.currentChallenge) return;

    // Clear canvas
    const canvas = document.getElementById('turtle-canvas');
    if (canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Draw challenge target
    const target = state.currentChallenge.target;
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.strokeStyle = 'orange';
    ctx.stroke();

    // Draw pen lines
    state.lines.forEach(line => {
        ctx.beginPath();
        ctx.moveTo(line.from.x, line.from.y);
        ctx.lineTo(line.to.x, line.to.y);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    });

    // Update DOM turtle
    turtleIcon.style.left = `${state.turtle.x}px`;
    turtleIcon.style.top = `${state.turtle.y}px`;
    turtleIcon.style.transform = `translate(-50%, -50%) rotate(${state.turtle.angle + 90}deg)`; // Add 90deg to align emoji
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
    if (!state.currentChallenge) return;
    const target = state.currentChallenge.target;
    const distance = Math.sqrt(
        Math.pow(state.turtle.x - target.x, 2) +
        Math.pow(state.turtle.y - target.y, 2)
    );

    if (distance < target.radius) {
        setTimeout(() => {
            alert("Congratulations! You completed the challenge!");
        }, 100);
    }
}

function loadChallenge(id) {
    const challenge = CHALLENGES[id];
    if (!challenge) {
        console.error(`Challenge with id ${id} not found.`);
        return;
    }
    state.currentChallenge = challenge;

    // Update DOM elements
    const titleEl = document.getElementById('challenge-title');
    const instructionsEl = document.getElementById('challenge-instructions');
    if (titleEl) titleEl.textContent = challenge.title;
    if (instructionsEl) instructionsEl.textContent = challenge.instructions;

    reset();
}

function init() {
    const canvas = document.getElementById('turtle-canvas');
    turtleIcon = document.getElementById('turtle-icon');

    if (!canvas || !turtleIcon) {
        return;
    }
    ctx = canvas.getContext('2d');
    loadChallenge('CH001'); // Load the first challenge by default
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

            if (command === 'forward') {
                forward(value);
            } else if (command === 'turn') {
                turn(value);
            }
        }
    });

    render(); // Final render after all commands
    checkWinCondition();
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the turtle challenge environment
    init();

    const runCodeBtn = document.getElementById('run-code-btn');
    const codeEditor = document.getElementById('code-editor');

    if (runCodeBtn && codeEditor) {
        runCodeBtn.addEventListener('click', () => {
            const userCode = codeEditor.value;
            parseAndExecute(userCode);
        });
    }
});
