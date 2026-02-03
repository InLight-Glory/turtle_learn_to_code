console.log("Welcome to the Coding Challenge site!");

// --- Global App State ---
// ALL_DATA is loaded from data.js
let ALL_DATA = window.ALL_DATA || {};
const state = {
    turtle: { x: 0, y: 0, angle: 0, penDown: true, color: 'black' },
    lines: [],
    functions: {},
    vars: {},
    currentChallenge: null,
    projectContext: null,
    lastWin: null
};
let ctx;
let turtleIcon;

// --- Persistence (localStorage) ---
const STORAGE_KEYS = {
    completedChallengesLegacy: 'completedChallenges',
    completedChallenges: 'cc_completedChallenges_v1',
    wallet: 'cc_wallet_v1',
    profile: 'cc_profile_v1',
    inventory: 'cc_inventory_v1',
    equipped: 'cc_equipped_v1',
    projectProgress: 'cc_projectProgress_v1'
};

function readJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getCompletedChallenges() {
    return readJson(STORAGE_KEYS.completedChallenges, []);
}

function setCompletedChallenges(ids) {
    writeJson(STORAGE_KEYS.completedChallenges, ids);
}

function getWallet() {
    const wallet = readJson(STORAGE_KEYS.wallet, null);
    if (wallet && typeof wallet.points === 'number') return wallet;
    const fresh = { points: 0, lifetimePoints: 0 };
    writeJson(STORAGE_KEYS.wallet, fresh);
    return fresh;
}

function setWallet(wallet) {
    writeJson(STORAGE_KEYS.wallet, wallet);
    updateHeaderStatus();
}

function addPoints(amount) {
    const wallet = getWallet();
    wallet.points += amount;
    wallet.lifetimePoints += Math.max(0, amount);
    setWallet(wallet);
}

function spendPoints(amount) {
    const wallet = getWallet();
    if (wallet.points < amount) return false;
    wallet.points -= amount;
    setWallet(wallet);
    return true;
}

function getProfile() {
    const profile = readJson(STORAGE_KEYS.profile, null);
    if (profile && typeof profile.displayName === 'string') return profile;
    const fresh = { displayName: 'Coder Turtle' };
    writeJson(STORAGE_KEYS.profile, fresh);
    return fresh;
}

function setProfile(profile) {
    writeJson(STORAGE_KEYS.profile, profile);
    updateHeaderStatus();
}

function getInventory() {
    const inv = readJson(STORAGE_KEYS.inventory, null);
    if (inv && typeof inv === 'object') return inv;
    const fresh = {};
    writeJson(STORAGE_KEYS.inventory, fresh);
    return fresh;
}

function setInventory(inv) {
    writeJson(STORAGE_KEYS.inventory, inv);
}

function isOwned(itemId) {
    const inv = getInventory();
    return !!inv[itemId];
}

function grantItem(itemId) {
    const inv = getInventory();
    if (!inv[itemId]) {
        inv[itemId] = { ownedAt: new Date().toISOString() };
        setInventory(inv);
    }
}

function getEquipped() {
    const eq = readJson(STORAGE_KEYS.equipped, null);
    if (eq && typeof eq === 'object') return eq;
    const fresh = { background: 'bg_none', hat: 'hat_none', shell: 'shell_none' };
    writeJson(STORAGE_KEYS.equipped, fresh);
    return fresh;
}

function setEquipped(eq) {
    writeJson(STORAGE_KEYS.equipped, eq);
    updateHeaderStatus();
}

function getProjectProgress() {
    const pp = readJson(STORAGE_KEYS.projectProgress, null);
    if (pp && typeof pp === 'object') return pp;
    const fresh = {};
    writeJson(STORAGE_KEYS.projectProgress, fresh);
    return fresh;
}

function setProjectProgress(pp) {
    writeJson(STORAGE_KEYS.projectProgress, pp);
}

function getShopItems() {
    return (ALL_DATA.shop && Array.isArray(ALL_DATA.shop.items)) ? ALL_DATA.shop.items : [];
}

function getShopItem(itemId) {
    return getShopItems().find(i => i.id === itemId);
}

function getProject(projectId) {
    return (ALL_DATA.projects || []).find(p => p.id === projectId);
}

function ensureStarterData() {
    // Migrate legacy completion key if present.
    const legacy = readJson(STORAGE_KEYS.completedChallengesLegacy, null);
    if (Array.isArray(legacy) && legacy.length && !getCompletedChallenges().length) {
        setCompletedChallenges(legacy);
    }

    getWallet();
    getProfile();
    getInventory();
    getEquipped();
    getProjectProgress();

    // Ensure starter inventory.
    const starter = (ALL_DATA.shop && Array.isArray(ALL_DATA.shop.starterInventory)) ? ALL_DATA.shop.starterInventory : [];
    starter.forEach(id => grantItem(id));
}

function updateHeaderStatus() {
    const wallet = getWallet();
    const pointsEls = document.querySelectorAll('#header-points');
    pointsEls.forEach(el => (el.textContent = String(wallet.points)));

    const eq = getEquipped();
    const hat = getShopItem(eq.hat);
    const avatarEls = document.querySelectorAll('#header-avatar');
    avatarEls.forEach(el => {
        const hatEmoji = hat && hat.emoji && eq.hat !== 'hat_none' ? hat.emoji : '🐢';
        el.textContent = hatEmoji;
    });
}

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
        const completed = getCompletedChallenges();
        const wasNewCompletion = !completed.includes(id);
        let pointsAwarded = 0;
        if (wasNewCompletion) {
            completed.push(id);
            setCompletedChallenges(completed);
            pointsAwarded = estimateChallengePoints(id);
            addPoints(pointsAwarded);
        }

        let projectReward = null;
        if (state.projectContext) {
            projectReward = markProjectStepComplete(state.projectContext.projectId, state.projectContext.stepIndex);
        }

        state.lastWin = {
            challengeId: id,
            pointsAwarded,
            projectReward,
            balance: getWallet().points
        };
        showWinModal();
    }
}

function estimateChallengePoints(challengeId) {
    const ch = ALL_DATA.challenges && ALL_DATA.challenges[challengeId];
    if (ch && typeof ch.points === 'number') return ch.points;

    // Fallback: scale by grade prefix.
    const gradePrefix = (challengeId || '').split('_')[0];
    if (gradePrefix === 'K') return 5;
    if (gradePrefix === 'G1' || gradePrefix === '1') return 8;
    if (gradePrefix === 'G2' || gradePrefix === '2') return 10;
    if (gradePrefix === 'G3' || gradePrefix === '3') return 14;
    if (gradePrefix === 'G4' || gradePrefix === '4') return 18;
    if (gradePrefix === 'G5' || gradePrefix === '5') return 22;
    return 10;
}

function grantReward(reward) {
    if (!reward) return;
    if (typeof reward.points === 'number' && reward.points > 0) addPoints(reward.points);
    if (Array.isArray(reward.grantItemIds)) reward.grantItemIds.forEach(id => grantItem(id));
}

function markProjectStepComplete(projectId, stepIndex) {
    const project = getProject(projectId);
    if (!project) return;

    const pp = getProjectProgress();
    const current = pp[projectId] || { completedSteps: [], rewardedAt: null, completedAt: null };
    const steps = Array.isArray(current.completedSteps) ? current.completedSteps : [];
    if (!steps.includes(stepIndex)) steps.push(stepIndex);
    current.completedSteps = steps.sort((a, b) => a - b);

    const allComplete = project.steps.every((_, idx) => current.completedSteps.includes(idx));
    const shouldReward = allComplete && !current.rewardedAt;
    if (shouldReward) {
        current.completedAt = current.completedAt || new Date().toISOString();
        current.rewardedAt = new Date().toISOString();
        grantReward(project.reward);
    }

    pp[projectId] = current;
    setProjectProgress(pp);

    return shouldReward ? project.reward : null;
}

function showWinModal() {
    const modal = document.getElementById('win-modal');
    const nextBtn = document.getElementById('next-step-btn');
    const rewardEl = document.getElementById('win-reward-text');
    if (modal) {
        modal.classList.add('show');

        if (rewardEl) {
            const points = state.lastWin && typeof state.lastWin.pointsAwarded === 'number' ? state.lastWin.pointsAwarded : 0;
            const projectReward = state.lastWin ? state.lastWin.projectReward : null;
            const bonus = projectReward && typeof projectReward.points === 'number' ? projectReward.points : 0;
            const total = points + bonus;
            rewardEl.textContent = total ? `+${total} pts (Balance: ${getWallet().points})` : '';
        }

        if (nextBtn) {
            if (state.projectContext) {
                const { projectId, stepIndex } = state.projectContext;
                const project = getProject(projectId);
                const nextIndex = stepIndex + 1;
                if (project && nextIndex < project.steps.length) {
                    nextBtn.style.display = 'inline-block';
                    nextBtn.textContent = 'Next Step';
                    nextBtn.href = `challenge.html?project=${encodeURIComponent(projectId)}&step=${nextIndex}`;
                } else if (project) {
                    nextBtn.style.display = 'inline-block';
                    nextBtn.textContent = 'Finish Project';
                    nextBtn.href = 'projects.html';
                } else {
                    nextBtn.style.display = 'none';
                    nextBtn.href = '#';
                }
            } else {
                nextBtn.style.display = 'none';
                nextBtn.href = '#';
            }
        }
        // Add fireworks or celebration sound here later?
    } else {
        alert("Congratulations! You completed the challenge!");
    }
}

function initModal() {
    const modal = document.getElementById('win-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const nextBtn = document.getElementById('next-step-btn');
    if (modal && closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.remove('show');
            window.location.href = state.projectContext ? 'projects.html' : 'index.html'; // Return to menu on close
        };
    }

    if (nextBtn) {
        nextBtn.onclick = (e) => {
            if (nextBtn.getAttribute('href') === '#') e.preventDefault();
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

    const completed = getCompletedChallenges();

    challengeIds.forEach(id => {
        const challenge = ALL_DATA.challenges[id];
        if (challenge) {
            const link = document.createElement('a');
            link.href = `challenge.html?id=${id}`;

            const title = document.createElement('h4');
            title.textContent = challenge.title;
            const goal = document.createElement('p');
            goal.textContent = challenge.goal || '';
            link.appendChild(title);
            link.appendChild(goal);

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
    const projectId = urlParams.get('project');
    const stepParam = urlParams.get('step');
    const requestedChallengeId = urlParams.get('id');

    let challengeId = requestedChallengeId || 'G1_S1C1';
    state.projectContext = null;

    if (projectId) {
        const project = getProject(projectId);
        const stepIndex = Math.max(0, parseInt(stepParam || '0', 10) || 0);
        if (project && Array.isArray(project.steps) && project.steps[stepIndex]) {
            challengeId = project.steps[stepIndex];
            state.projectContext = { projectId, stepIndex };
        }
    }

    const banner = document.getElementById('project-banner');
    if (banner) {
        if (state.projectContext) {
            const project = getProject(state.projectContext.projectId);
            const titleEl = document.getElementById('project-banner-title');
            const subEl = document.getElementById('project-banner-sub');
            if (titleEl) titleEl.textContent = project ? project.title : 'Project';
            if (subEl) {
                const total = project && Array.isArray(project.steps) ? project.steps.length : 0;
                subEl.textContent = total ? `Step ${state.projectContext.stepIndex + 1} of ${total}` : '';
            }
            banner.style.display = 'flex';
        } else {
            banner.style.display = 'none';
        }
    }

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
        executeLines(lines, {}, createExecBudget());
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

const EXEC_LIMITS = {
    maxSteps: 6000,
    maxRepeat: 2000,
    maxLineLength: 300
};

function createExecBudget() {
    return { stepsRemaining: EXEC_LIMITS.maxSteps };
}

function consumeSteps(budget, count = 1) {
    if (!budget) return;
    budget.stepsRemaining -= count;
    if (budget.stepsRemaining < 0) {
        throw new Error("Your code ran too long. Try smaller loops or fewer steps.");
    }
}

function coerceValue(value) {
    const raw = String(value ?? '').trim();
    const unquoted = raw.replace(/^["']|["']$/g, '');
    if (/^-?\d+(\.\d+)?$/.test(unquoted)) return Number(unquoted);
    if (unquoted === 'true') return true;
    if (unquoted === 'false') return false;
    return unquoted;
}

function tokenizeCondition(input) {
    const tokens = [];
    let i = 0;

    const push = (type, value) => tokens.push({ type, value });

    while (i < input.length) {
        const ch = input[i];
        if (/\s/.test(ch)) {
            i++;
            continue;
        }

        if (/[0-9.]/.test(ch)) {
            let j = i;
            while (j < input.length && /[0-9.]/.test(input[j])) j++;
            const numStr = input.slice(i, j);
            if (!/^\d+(\.\d+)?$/.test(numStr)) {
                throw new Error("I couldn't read that number in your if statement.");
            }
            push('number', Number(numStr));
            i = j;
            continue;
        }

        if (/[A-Za-z_]/.test(ch)) {
            let j = i;
            while (j < input.length && /[A-Za-z0-9_]/.test(input[j])) j++;
            const word = input.slice(i, j);
            if (word === 'true') push('boolean', true);
            else if (word === 'false') push('boolean', false);
            else push('ident', word);
            i = j;
            continue;
        }

        const two = input.slice(i, i + 2);
        if (['&&', '||', '<=', '>=', '==', '!='].includes(two)) {
            push('op', two);
            i += 2;
            continue;
        }

        if (['+', '-', '*', '/', '(', ')', '<', '>'].includes(ch)) {
            push(ch === '(' || ch === ')' ? 'paren' : 'op', ch);
            i += 1;
            continue;
        }

        throw new Error("I found a symbol in your if statement that I don't understand.");
    }

    return tokens;
}

function evaluateCondition(conditionStr, vars) {
    const tokens = tokenizeCondition(conditionStr);
    let pos = 0;

    const peek = () => tokens[pos];
    const next = () => tokens[pos++];
    const matchOp = (op) => peek() && peek().type === 'op' && peek().value === op;

    const asNumber = (v) => {
        if (typeof v === 'number') return v;
        if (typeof v === 'boolean') return v ? 1 : 0;
        throw new Error("That math in your if statement needs numbers.");
    };

    const asBoolean = (v) => {
        if (typeof v === 'boolean') return v;
        if (typeof v === 'number') return v !== 0;
        throw new Error("That logic in your if statement needs true/false.");
    };

    const parsePrimary = () => {
        const t = next();
        if (!t) throw new Error("Your if statement looks incomplete.");
        if (t.type === 'number' || t.type === 'boolean') return t.value;
        if (t.type === 'ident') {
            if (!vars || !(t.value in vars)) throw new Error(`I don't know the value of '${t.value}' yet.`);
            return vars[t.value];
        }
        if (t.type === 'paren' && t.value === '(') {
            const v = parseOr();
            const close = next();
            if (!close || close.type !== 'paren' || close.value !== ')') throw new Error("Missing ')' in your if statement.");
            return v;
        }
        throw new Error("I couldn't understand that part of your if statement.");
    };

    const parseUnary = () => {
        if (matchOp('-')) {
            next();
            return -asNumber(parseUnary());
        }
        return parsePrimary();
    };

    const parseMul = () => {
        let left = parseUnary();
        while (peek() && peek().type === 'op' && ['*', '/'].includes(peek().value)) {
            const op = next().value;
            const right = parseUnary();
            left = op === '*' ? asNumber(left) * asNumber(right) : asNumber(left) / asNumber(right);
        }
        return left;
    };

    const parseAdd = () => {
        let left = parseMul();
        while (peek() && peek().type === 'op' && ['+', '-'].includes(peek().value)) {
            const op = next().value;
            const right = parseMul();
            left = op === '+' ? asNumber(left) + asNumber(right) : asNumber(left) - asNumber(right);
        }
        return left;
    };

    const parseRel = () => {
        let left = parseAdd();
        while (peek() && peek().type === 'op' && ['<', '>', '<=', '>='].includes(peek().value)) {
            const op = next().value;
            const right = parseAdd();
            if (op === '<') left = asNumber(left) < asNumber(right);
            else if (op === '>') left = asNumber(left) > asNumber(right);
            else if (op === '<=') left = asNumber(left) <= asNumber(right);
            else left = asNumber(left) >= asNumber(right);
        }
        return left;
    };

    const parseEq = () => {
        let left = parseRel();
        while (peek() && peek().type === 'op' && ['==', '!='].includes(peek().value)) {
            const op = next().value;
            const right = parseRel();
            left = op === '==' ? left === right : left !== right;
        }
        return left;
    };

    const parseAnd = () => {
        let left = parseEq();
        while (matchOp('&&')) {
            next();
            const right = parseEq();
            left = asBoolean(left) && asBoolean(right);
        }
        return left;
    };

    const parseOr = () => {
        let left = parseAnd();
        while (matchOp('||')) {
            next();
            const right = parseAnd();
            left = asBoolean(left) || asBoolean(right);
        }
        return left;
    };

    const result = parseOr();
    if (pos !== tokens.length) throw new Error("I couldn't understand all of your if statement.");
    return asBoolean(result);
}

function executeLines(lines, argsMap = {}, budget) {
    const commandRegex = /(\w+)\s*\(\s*(.*)\s*\)/;
    const repeatStartRegex = /repeat\s+(\d+)\s*{/;
    const ifStartRegex = /if\s*\((.+)\)\s*{/;
    const functionStartRegex = /function\s+(\w+)\s*\((.*)\)\s*{/;
    const varRegex = /var\s+(\w+)\s*=\s*(.*)/;
    const elseStartRegex = /else\s*{/;
    const endBlockRegex = /}/;

    // Pre-pass to define functions?
    // Or just handle definitions as we encounter them (hoisting might be too complex for now).
    // Let's handle definitions as we see them.

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;
        if (line.length > EXEC_LIMITS.maxLineLength) throw new Error("That line is too long. Try breaking it into smaller steps.");
        consumeSteps(budget, 1);

        // Check for Variable Definition
        const varMatch = line.match(varRegex);
        if (varMatch) {
            const varName = varMatch[1];
            let value = varMatch[2];
            // Resolve value if it's another variable or param
            if (argsMap[value] !== undefined) value = argsMap[value];
            else if (state.vars[value] !== undefined) value = state.vars[value];

            state.vars[varName] = coerceValue(value);
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
            state.functions[funcName] = { lines: blockLines, params: params };
            continue;
        }

        // Check for Repeat Loop
        const repeatMatch = line.match(repeatStartRegex);
        if (repeatMatch) {
            const count = parseInt(repeatMatch[1], 10);
            if (count > EXEC_LIMITS.maxRepeat) throw new Error("That repeat number is too big. Try a smaller loop.");
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
                executeLines(blockLines, argsMap, budget);
            }
            continue;
        }

        // Check for If Condition
        const ifMatch = line.match(ifStartRegex);
        if (ifMatch) {
            const conditionStr = ifMatch[1];
            const conditionVars = {
                x: state.turtle.x,
                y: state.turtle.y,
                angle: state.turtle.angle,
                ...state.vars,
                ...argsMap
            };

            const conditionResult = evaluateCondition(conditionStr, conditionVars);

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

            // Optional else { ... }
            let elseLines = null;
            let j = i + 1;
            while (j < lines.length && !lines[j].trim()) j++;
            if (j < lines.length && lines[j].trim().match(elseStartRegex)) {
                elseLines = [];
                i = j + 1;
                depth = 1;
                while (i < lines.length && depth > 0) {
                    const innerLine = lines[i];
                    if (innerLine.trim().match(repeatStartRegex) || innerLine.trim().match(ifStartRegex) || innerLine.trim().match(functionStartRegex)) {
                        depth++;
                    } else if (innerLine.trim().match(endBlockRegex)) {
                        depth--;
                    }
                    if (depth > 0) {
                        elseLines.push(innerLine);
                        i++;
                    }
                }
            }

            if (conditionResult) executeLines(blockLines, argsMap, budget);
            else if (elseLines) executeLines(elseLines, argsMap, budget);
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

            const cleanArgs = coerceValue(args);

            if (lowerCommand === 'forward') {
                const n = Number(cleanArgs);
                if (Number.isNaN(n)) throw new Error("forward(...) needs a number.");
                forward(n);
            }
            else if (lowerCommand === 'turn') {
                const n = Number(cleanArgs);
                if (Number.isNaN(n)) throw new Error("turn(...) needs a number.");
                turn(n);
            }
            else if (lowerCommand === 'penup') penUp();
            else if (lowerCommand === 'pendown') penDown();
            else if (lowerCommand === 'pencolor') penColor(String(cleanArgs));
            else if (state.functions[command]) {
                // Execute User Function
                const funcDef = state.functions[command];
                // Handle new style {lines, params} or old style [lines] just in case
                // But we are overwriting, so assume new style.

                if (Array.isArray(funcDef)) {
                    // Fallback if somehow old format persists (shouldn't happen with clean reload)
                    executeLines(funcDef, argsMap, budget);
                } else {
                    const callArgs = String(cleanArgs).split(',').map(a => a.trim());
                    const newArgsMap = {};
                    funcDef.params.forEach((param, index) => {
                        // resolve argument if it's a variable in current scope
                        let val = callArgs[index];
                        if (argsMap[val] !== undefined) val = argsMap[val];
                        newArgsMap[param] = coerceValue(val);
                    });
                    executeLines(funcDef.lines, newArgsMap, budget);
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

function findNextProjectStepIndex(project, progressEntry) {
    const completed = (progressEntry && Array.isArray(progressEntry.completedSteps)) ? progressEntry.completedSteps : [];
    for (let i = 0; i < project.steps.length; i++) {
        if (!completed.includes(i)) return i;
    }
    return Math.max(0, project.steps.length - 1);
}

function initProjectsPage() {
    const list = document.getElementById('project-list');
    if (!list) return;
    list.innerHTML = '';

    const projects = Array.isArray(ALL_DATA.projects) ? ALL_DATA.projects : [];
    const pp = getProjectProgress();

    projects.forEach(project => {
        const entry = pp[project.id] || { completedSteps: [], rewardedAt: null };
        const completedCount = Array.isArray(entry.completedSteps) ? entry.completedSteps.length : 0;
        const total = Array.isArray(project.steps) ? project.steps.length : 0;
        const nextIndex = findNextProjectStepIndex(project, entry);

        const card = document.createElement('div');
        card.className = 'card';

        const h = document.createElement('h3');
        h.textContent = project.title;

        const p = document.createElement('p');
        p.textContent = project.description || '';

        const meta = document.createElement('div');
        meta.className = 'card-meta';
        meta.textContent = total ? `Progress: ${Math.min(completedCount, total)} / ${total}` : 'Progress: 0 / 0';

        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const primary = document.createElement('a');
        primary.className = 'button';
        primary.href = `challenge.html?project=${encodeURIComponent(project.id)}&step=${nextIndex}`;
        primary.textContent = completedCount >= total && total ? 'Replay' : (completedCount ? 'Continue' : 'Start');

        const reward = document.createElement('span');
        reward.className = 'pill';
        const rewardPoints = project.reward && typeof project.reward.points === 'number' ? project.reward.points : 0;
        reward.textContent = rewardPoints ? `Reward: ${rewardPoints} pts` : 'Reward: items';

        actions.appendChild(primary);
        actions.appendChild(reward);

        card.appendChild(h);
        card.appendChild(p);
        card.appendChild(meta);
        card.appendChild(actions);

        list.appendChild(card);
    });
}

function setMessage(el, text, kind = 'info') {
    if (!el) return;
    el.textContent = text;
    el.style.display = 'block';
    el.style.padding = '10px';
    el.style.borderRadius = '8px';
    el.style.border = kind === 'error' ? '1px solid #d8000c' : '1px solid var(--light-gray)';
    el.style.background = kind === 'error' ? '#ffdddd' : '#ffffff';
    el.style.color = kind === 'error' ? '#d8000c' : 'var(--text-color)';
}

function initShopPage() {
    const list = document.getElementById('shop-list');
    const balanceEl = document.getElementById('shop-balance');
    const filterEl = document.getElementById('shop-filter');
    const messageEl = document.getElementById('shop-message');
    if (!list || !balanceEl || !filterEl) return;

    const render = () => {
        const wallet = getWallet();
        balanceEl.textContent = String(wallet.points);
        list.innerHTML = '';

        const filter = filterEl.value;
        const items = getShopItems().filter(item => filter === 'all' || item.slot === filter);

        items.forEach(item => {
            const owned = isOwned(item.id);
            const card = document.createElement('div');
            card.className = 'card';

            const emoji = document.createElement('div');
            emoji.className = 'shop-item-emoji';
            emoji.textContent = item.emoji || '🎁';

            const h = document.createElement('h3');
            h.textContent = item.name;

            const p = document.createElement('p');
            p.textContent = item.description || '';

            const meta = document.createElement('div');
            meta.className = 'card-meta';
            meta.textContent = `${item.cost} pts • ${item.slot}`;

            const actions = document.createElement('div');
            actions.className = 'card-actions';

            if (!owned) {
                const buy = document.createElement('button');
                buy.className = 'button';
                buy.type = 'button';
                buy.textContent = `Buy (${item.cost})`;
                buy.disabled = getWallet().points < item.cost;
                buy.onclick = () => {
                    if (!spendPoints(item.cost)) {
                        setMessage(messageEl, "Not enough points yet. Complete more challenges!", 'error');
                        return;
                    }
                    grantItem(item.id);
                    setMessage(messageEl, `Purchased: ${item.name}`, 'info');
                    render();
                    updateHeaderStatus();
                };
                actions.appendChild(buy);
            } else {
                const ownedPill = document.createElement('span');
                ownedPill.className = 'pill';
                ownedPill.textContent = 'Owned';

                const equip = document.createElement('button');
                equip.className = 'button button-secondary';
                equip.type = 'button';
                equip.textContent = 'Equip';
                equip.onclick = () => {
                    const eq = getEquipped();
                    if (item.slot) eq[item.slot] = item.id;
                    setEquipped(eq);
                    setMessage(messageEl, `Equipped: ${item.name}`, 'info');
                    render();
                };

                actions.appendChild(ownedPill);
                actions.appendChild(equip);
            }

            card.appendChild(emoji);
            card.appendChild(h);
            card.appendChild(p);
            card.appendChild(meta);
            card.appendChild(actions);
            list.appendChild(card);
        });
    };

    filterEl.onchange = () => render();
    render();
}

function renderAvatarPreview() {
    const eq = getEquipped();
    const bg = getShopItem(eq.background);
    const hat = getShopItem(eq.hat);
    const shell = getShopItem(eq.shell);

    const bgEl = document.getElementById('avatar-bg');
    const hatEl = document.getElementById('avatar-hat');
    const shellEl = document.getElementById('avatar-shell');

    if (bgEl) bgEl.textContent = bg ? bg.emoji : '⬜';
    if (hatEl) hatEl.textContent = hat ? hat.emoji : '➖';
    if (shellEl) shellEl.textContent = shell ? shell.emoji : '🟩';
}

function populateEquipSelect(selectEl, slot) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    const eq = getEquipped();
    const items = getShopItems().filter(i => i.slot === slot && isOwned(i.id));
    items.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = `${item.emoji} ${item.name}`;
        selectEl.appendChild(opt);
    });
    if (eq[slot]) selectEl.value = eq[slot];
}

function initProfilePage() {
    const nameEl = document.getElementById('profile-name');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const saveEquipBtn = document.getElementById('save-equipment-btn');
    const resetBtn = document.getElementById('reset-progress-btn');
    const messageEl = document.getElementById('profile-message');

    if (!nameEl || !saveProfileBtn || !saveEquipBtn || !resetBtn) return;

    const profile = getProfile();
    nameEl.value = profile.displayName || '';

    const bgSelect = document.getElementById('equip-background');
    const hatSelect = document.getElementById('equip-hat');
    const shellSelect = document.getElementById('equip-shell');

    populateEquipSelect(bgSelect, 'background');
    populateEquipSelect(hatSelect, 'hat');
    populateEquipSelect(shellSelect, 'shell');
    renderAvatarPreview();

    saveProfileBtn.onclick = () => {
        const next = { ...getProfile(), displayName: String(nameEl.value || '').trim().slice(0, 24) || 'Coder Turtle' };
        setProfile(next);
        setMessage(messageEl, "Saved profile.", 'info');
    };

    saveEquipBtn.onclick = () => {
        const eq = getEquipped();
        if (bgSelect && bgSelect.value) eq.background = bgSelect.value;
        if (hatSelect && hatSelect.value) eq.hat = hatSelect.value;
        if (shellSelect && shellSelect.value) eq.shell = shellSelect.value;
        setEquipped(eq);
        renderAvatarPreview();
        setMessage(messageEl, "Equipped your items.", 'info');
    };

    resetBtn.onclick = () => {
        const ok = confirm("Reset challenges and project progress on this device? Your avatar items stay.");
        if (!ok) return;
        setCompletedChallenges([]);
        setProjectProgress({});
        const wallet = getWallet();
        setWallet({ points: 0, lifetimePoints: wallet.lifetimePoints });
        setMessage(messageEl, "Progress reset.", 'info');
    };
}

// --- Main Execution ---
function main() {
    // Wait for DOM content loaded if script runs before DOM
    if (!window.ALL_DATA) {
        console.error("ALL_DATA not found. Ensure data.js is loaded.");
        return;
    }
    ALL_DATA = window.ALL_DATA;
    ensureStarterData();
    updateHeaderStatus();

    if (document.getElementById('challenge-selection')) {
        initIndexPage();
    } else if (document.querySelector('.challenge-layout')) {
        initChallengePage();
    } else if (document.getElementById('project-list')) {
        initProjectsPage();
    } else if (document.getElementById('shop-list')) {
        initShopPage();
    } else if (document.getElementById('profile-name')) {
        initProfilePage();
    }
}

// If script is deferred, main runs immediately.
// If script is sync at bottom of body, it also runs immediately.
// But data.js must be loaded first.
main();
