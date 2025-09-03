console.log("Welcome to the Coding Challenge site!");

// --- State Management ---
const state = {
    turtle: {
        x: 200,
        y: 200,
        angle: -90, // Start facing up
        penDown: true,
    },
    lines: [],
    challenge: {
        target: { x: 200, y: 100, radius: 10 }
    }
};

let ctx; // Canvas 2D context
let turtleIcon;

// --- Render Engine ---
function render() {
    if (!ctx || !turtleIcon) return;

    // Clear canvas
    const canvas = document.getElementById('turtle-canvas');
    if (canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Draw challenge target
    ctx.beginPath();
    ctx.arc(state.challenge.target.x, state.challenge.target.y, state.challenge.target.radius, 0, 2 * Math.PI);
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
    state.turtle.x = 200;
    state.turtle.y = 200;
    state.turtle.angle = -90;
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
    const distance = Math.sqrt(
        Math.pow(state.turtle.x - state.challenge.target.x, 2) +
        Math.pow(state.turtle.y - state.challenge.target.y, 2)
    );

    if (distance < state.challenge.target.radius) {
        setTimeout(() => {
            alert("Congratulations! You completed the challenge!");
        }, 100);
    }
}

function init() {
    const canvas = document.getElementById('turtle-canvas');
    turtleIcon = document.getElementById('turtle-icon');

    if (!canvas || !turtleIcon) {
        return;
    }
    ctx = canvas.getContext('2d');
    reset();
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
