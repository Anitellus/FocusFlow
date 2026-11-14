// ============================================================================
// Focus Flow | Master Operator & Executive Co-Pilot Engine (js/app.js)
// ============================================================================

let isPlaying = false;
let timerInterval = null;
let tickCounter = 0;
let currentMode = 'operator'; // 'operator' | 'architect'
let currentView = 'focus';    // 'focus' | 'map' | 'vault' | 'calendar' | 'progress' | 'analytics'
let jitterAudioTimer = null;
let activeSessionStart = null;
let activeSessionMode = 'focus';
let visibilityTimeout = null;
let activePostDocProjectId = null;
let breakInterval = null;
let activeSlicerTarget = null; // { projectId, taskId }

// Tab visibility guard against runaway background sessions (pauses after 15m AFK)
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) {
        visibilityTimeout = setTimeout(() => {
            if (isPlaying) {
                forcePause();
                console.info("Timer automatically paused to prevent runaway telemetry.");
            }
        }, 15 * 60 * 1000);
    } else {
        if (visibilityTimeout) clearTimeout(visibilityTimeout);
    }
});

// ============================================================================
// 1. STATE QUERIES, HIERARCHY & "1 HEADLINER + 1 CO-PILOT" SLOT GUARDRAILS
// ============================================================================

function getActiveProject() {
    return (appState.projects || []).find(p => p.id === appState.activeProjectId) || (appState.projects || [])[0];
}

function getRootProject(proj) {
    let curr = proj;
    while (curr && curr.parentId) {
        const parent = (appState.projects || []).find(p => p.id === curr.parentId);
        if (!parent) break;
        curr = parent;
    }
    return curr;
}

function getLeafProjects(rootId) {
    const leaves = [];
    function traverse(id) {
        const children = (appState.projects || []).filter(p => p.parentId === id && !p.completedAt);
        if (children.length === 0) {
            const node = (appState.projects || []).find(p => p.id === id);
            if (node) leaves.push(node);
        } else {
            children.forEach(c => traverse(c.id));
        }
    }
    traverse(rootId);
    return leaves;
}

function getAllDescendants(rootId) {
    const list = [];
    function walk(id) {
        (appState.projects || []).filter(p => p.parentId === id).forEach(child => {
            list.push(child);
            walk(child.id);
        });
    }
    walk(rootId);
    return list;
}

function getActiveTask() {
    const p = getActiveProject();
    return p ? (p.tasks || []).find(t => t.id === p.activeTaskId) : null;
}

function hasSubProjects(projectId) {
    return (appState.projects || []).some(p => p.parentId === projectId);
}

function getProjectDepth(projectId) {
    let depth = 0;
    let curr = (appState.projects || []).find(p => p.id === projectId);
    while (curr && curr.parentId) {
        depth++;
        curr = (appState.projects || []).find(p => p.id === curr.parentId);
    }
    return depth;
}

function getCumulativeTime(projectId) {
    const p = (appState.projects || []).find(x => x.id === projectId);
    if (!p) return 0;
    let total = p.totalTimeSpent || 0;
    (appState.projects || []).filter(sp => sp.parentId === projectId).forEach(sp => {
        total += getCumulativeTime(sp.id);
    });
    return total;
}

function getActiveRootProjects() {
    return (appState.projects || []).filter(p => !p.parentId && !p.isParked && !p.completedAt);
}

function getParkedRootProjects() {
    return (appState.projects || []).filter(p => !p.parentId && p.isParked && !p.completedAt);
}

function getCompletedRootProjects() {
    return (appState.projects || []).filter(p => !p.parentId && p.completedAt);
}

// Enforce strict 1 Headliner + 1 Co-Pilot cap to eliminate project-hopping scatter
function enforceProjectSlotLimits() {
    const activeRoots = getActiveRootProjects();
    if (activeRoots.length === 0) return;

    let headliner = activeRoots.find(p => p.slotRole === 'headliner');
    let copilot = activeRoots.find(p => p.slotRole === 'copilot' && (!headliner || p.id !== headliner.id));

    if (!headliner) {
        const currentRoot = getRootProject(getActiveProject());
        headliner = (currentRoot && !currentRoot.isParked && !currentRoot.completedAt && (!copilot || currentRoot.id !== copilot.id))
            ? currentRoot
            : activeRoots.find(p => !copilot || p.id !== copilot.id);
        if (headliner) headliner.slotRole = 'headliner';
    }

    if (!copilot) {
        const second = activeRoots.find(p => p.id !== headliner?.id);
        if (second) {
            copilot = second;
            copilot.slotRole = 'copilot';
        }
    }

    // Park any overflow active roots beyond the 2 slots without losing their data
    activeRoots.forEach(p => {
        if (p.id !== headliner?.id && p.id !== copilot?.id) {
            p.isParked = true;
            p.slotRole = null;
        }
    });

    // Ensure activeProjectId points to an unparked project if possible
    const activeProj = getActiveProject();
    const activeRoot = getRootProject(activeProj);
    if (!activeRoot || activeRoot.isParked || activeRoot.completedAt) {
        const targetRoot = headliner || copilot;
        if (targetRoot) {
            const leaves = getLeafProjects(targetRoot.id);
            appState.activeProjectId = leaves[0]?.id || targetRoot.id;
        }
    }
}

function getHeadlinerProject() {
    enforceProjectSlotLimits();
    return getActiveRootProjects().find(p => p.slotRole === 'headliner') || null;
}

function getCopilotProject() {
    enforceProjectSlotLimits();
    return getActiveRootProjects().find(p => p.slotRole === 'copilot') || null;
}

function getTaskReadiness(task) {
    if (!task) return 'slice';
    return task.readiness || 'slice';
}

function getOnDeckTasksForRoot(rootId) {
    const scope = [
        (appState.projects || []).find(p => p.id === rootId),
        ...getAllDescendants(rootId)
    ].filter(Boolean);

    const starred = [];
    scope.forEach(proj => {
        (proj.tasks || []).forEach(t => {
            if (!t.isCompleted && t.isOnDeck) {
                starred.push({ task: t, project: proj });
            }
        });
    });
    return starred.slice(0, 3);
}

// ============================================================================
// 2. COGNITIVE MODE ROUTER (OPERATOR vs. ARCHITECT)
// ============================================================================

function enterOperatorMode() {
    if (typeof TreeScopeEngine !== 'undefined' && TreeScopeEngine.isFullscreen) {
        TreeScopeEngine.toggleFullscreen();
    }
    currentMode = 'operator';
    currentView = 'focus';

    const focusContainer = document.getElementById('view-focus-container');
    const architectShell = document.getElementById('architect-shell');
    const btnOp = document.getElementById('mode-btn-operator');
    const btnArch = document.getElementById('mode-btn-architect');

    if (focusContainer) focusContainer.classList.remove('hidden');
    if (architectShell) architectShell.classList.add('hidden');
    if (btnOp) btnOp.className = 'mode-switch-btn active-operator';
    if (btnArch) btnArch.className = 'mode-switch-btn';

    renderApp();
    safeCreateIcons();
}

function enterArchitectMode(subView = 'map') {
    if (isPlaying) {
        forcePause();
    }
    currentMode = 'architect';
    const targetSub = (subView === 'focus' || !subView) ? 'map' : subView;

    const focusContainer = document.getElementById('view-focus-container');
    const architectShell = document.getElementById('architect-shell');
    const btnOp = document.getElementById('mode-btn-operator');
    const btnArch = document.getElementById('mode-btn-architect');

    if (focusContainer) focusContainer.classList.add('hidden');
    if (architectShell) architectShell.classList.remove('hidden');
    if (btnOp) btnOp.className = 'mode-switch-btn';
    if (btnArch) btnArch.className = 'mode-switch-btn active-architect';

    switchView(targetSub);
}

function switchView(viewName) {
    if (viewName === 'focus') {
        enterOperatorMode();
        return;
    }

    if (currentMode !== 'architect') {
        currentMode = 'architect';
        const focusContainer = document.getElementById('view-focus-container');
        const architectShell = document.getElementById('architect-shell');
        const btnOp = document.getElementById('mode-btn-operator');
        const btnArch = document.getElementById('mode-btn-architect');
        if (focusContainer) focusContainer.classList.add('hidden');
        if (architectShell) architectShell.classList.remove('hidden');
        if (btnOp) btnOp.className = 'mode-switch-btn';
        if (btnArch) btnArch.className = 'mode-switch-btn active-architect';
    }

    currentView = viewName;

    const views = {
        map: document.getElementById('view-map-container'),
        vault: document.getElementById('view-vault-container'),
        calendar: document.getElementById('view-calendar-container'),
        progress: document.getElementById('view-progression-container'),
        analytics: document.getElementById('view-analytics-container')
    };

    Object.entries(views).forEach(([key, el]) => {
        if (el) el.classList.toggle('hidden', key !== viewName);
    });

    const activeTab = "px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-brand-600 shadow-2xs border border-stone-200 flex items-center gap-1.5 shrink-0";
    const inactiveTab = "px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-white/70 flex items-center gap-1.5 shrink-0";

    ['map', 'vault', 'calendar', 'progress', 'analytics'].forEach(key => {
        const navBtn = document.getElementById(`arch-nav-${key}`);
        if (navBtn) navBtn.className = key === viewName ? activeTab : inactiveTab;
    });

    if (viewName === 'map' && typeof TreeScopeEngine !== 'undefined') {
        const root = getRootProject(getActiveProject());
        if (root) TreeScopeEngine.activeProjectId = root.id;
        TreeScopeEngine.render();
    } else if (viewName === 'vault') {
        renderProjectVault();
    } else if (viewName === 'calendar' && typeof renderCalendarView === 'function') {
        renderCalendarView();
    } else if (viewName === 'progress' && typeof ProgressionEngine !== 'undefined') {
        const root = getRootProject(getActiveProject());
        if (root) ProgressionEngine.activeProjectId = root.id;
        ProgressionEngine.render();
    } else if (viewName === 'analytics' && typeof renderAnalytics === 'function') {
        renderAnalytics(30);
    }

    safeCreateIcons();
}

// ============================================================================
// 3. RESILIENT TIMER ENGINE & SLICE/SPIKE/BOULDER GUARDRAILS
// ============================================================================

function toggleTimer() {
    const task = getActiveTask();
    const proj = getActiveProject();
    if (!task || task.isCompleted) {
        const input = document.getElementById('new-task-title-input');
        if (input) input.focus();
        return;
    }

    if (isPlaying) {
        openParkModal();
        return;
    }

    // Anti-Paralysis Guardrail: Boulders must be sliced before starting the clock
    if (getTaskReadiness(task) === 'boulder') {
        openTaskSlicerModal(proj.id, task.id);
        return;
    }

    // Research Spikes automatically set a 20m curiosity box if open-ended
    if (getTaskReadiness(task) === 'spike' && (!task.estimatedTime || task.estimatedTime === 0)) {
        task.estimatedTime = 20 * 60;
    }

    isPlaying = true;
    activeSessionStart = new Date();
    if (!task.startedAt) task.startedAt = new Date().toISOString();

    appState.activeTimerSession = {
        taskId: task.id,
        projectId: proj.id,
        startedTimestamp: Date.now(),
        taskBaseActualTime: task.actualTime
    };
    saveStateLocally();

    renderTimerVisuals();
    playSound('start');
    timerInterval = setInterval(timerTick, 1000);
    scheduleNextAudioJitter();
}

function timerTick() {
    const p = getActiveProject();
    const t = getActiveTask();
    if (!t || t.isCompleted) {
        if (isPlaying) forcePause();
        return;
    }

    t.actualTime += 1;
    p.totalTimeSpent += 1;
    appState.continuousFocusSeconds = (appState.continuousFocusSeconds || 0) + 1;

    if (appState.continuousFocusSeconds >= 5400) {
        forcePause();
        triggerCompulsoryBreak();
        return;
    }

    tickCounter++;
    if (tickCounter >= 5) {
        saveStateLocally();
        tickCounter = 0;
    }
    updateTimerTexts(p, t);
}

function forcePause() {
    if (!isPlaying) return;
    isPlaying = false;
    clearInterval(timerInterval);
    if (jitterAudioTimer) clearTimeout(jitterAudioTimer);

    appState.activeTimerSession = null;

    if (activeSessionStart) {
        const durationSec = Math.round((Date.now() - activeSessionStart.getTime()) / 1000);
        const cappedDuration = Math.min(durationSec, 14400);
        logSessionTelemetry(getActiveTask()?.id, getActiveProject()?.id, cappedDuration, false);
        activeSessionStart = null;
    }

    renderTimerVisuals();
    renderStudioGPS();
    saveStateLocally();
}

function triggerCompulsoryBreak() {
    const overlay = document.getElementById('compulsory-break-overlay');
    const display = document.getElementById('break-countdown-display');
    const dismissBtn = document.getElementById('btn-dismiss-break');
    if (!overlay) return;

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    let remainingSeconds = 180;
    dismissBtn.disabled = true;
    dismissBtn.className = "w-full py-3 bg-stone-800 text-stone-500 font-bold text-xs rounded-xl cursor-not-allowed";
    dismissBtn.textContent = "Reset in Progress...";

    if (breakInterval) clearInterval(breakInterval);
    breakInterval = setInterval(() => {
        remainingSeconds--;
        const m = Math.floor(remainingSeconds / 60);
        const s = remainingSeconds % 60;
        if (display) display.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        if (remainingSeconds <= 0) {
            clearInterval(breakInterval);
            dismissBtn.disabled = false;
            dismissBtn.className = "w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg";
            dismissBtn.textContent = "Reset Complete — Back to Studio";
        }
    }, 1000);
}

function dismissCompulsoryBreak() {
    const overlay = document.getElementById('compulsory-break-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
    }
    appState.continuousFocusSeconds = 0;
    saveStateLocally();
    renderApp();
}

function completeActiveTask() {
    const t = getActiveTask();
    const p = getActiveProject();
    if (!t || t.isCompleted) return;
    if (isPlaying) forcePause();

    t.isCompleted = true;
    t.isOnDeck = false;
    t.completionDate = new Date().toISOString();
    playSound('complete');
    confetti({ particleCount: 85, spread: 65 });
    logSessionTelemetry(t.id, p.id, t.actualTime, true);

    // Advance smoothly to the next On-Deck slice or next incomplete task in this track
    const root = getRootProject(p);
    const remainingOnDeck = root ? getOnDeckTasksForRoot(root.id) : [];
    if (remainingOnDeck.length > 0) {
        appState.activeProjectId = remainingOnDeck[0].project.id;
        remainingOnDeck[0].project.activeTaskId = remainingOnDeck[0].task.id;
    } else {
        const nextLocal = (p.tasks || []).find(x => !x.isCompleted);
        p.activeTaskId = nextLocal ? nextLocal.id : null;
    }

    saveStateLocally();
    renderApp();
}

function updateTimerTexts(p, task) {
    const timerDisp = document.getElementById('active-timer-display');
    const cumTimer = document.getElementById('project-cumulative-timer');
    const gpsTime = document.getElementById('gps-time-invested');
    const estEl = document.getElementById('active-timer-estimate');

    if (timerDisp) timerDisp.textContent = formatTimeCompact(task.actualTime);
    const root = getRootProject(p);
    const rootSec = root ? getCumulativeTime(root.id) : getCumulativeTime(p.id);
    if (cumTimer) cumTimer.textContent = formatTimeCompact(rootSec);
    if (gpsTime) gpsTime.textContent = `${formatTimeCompact(rootSec)} invested`;

    if (estEl) {
        if (getTaskReadiness(task) === 'boulder') {
            estEl.innerHTML = `<i data-lucide="scissors" class="w-3.5 h-3.5 text-amber-600"></i> <span>Click to slice first</span>`;
        } else if (task.estimatedTime > 0) {
            estEl.innerHTML = `<i data-lucide="clock" class="w-3.5 h-3.5"></i> <span>${Math.round(task.estimatedTime / 60)}m box</span>`;
        } else {
            estEl.innerHTML = `<i data-lucide="sparkles" class="w-3.5 h-3.5"></i> <span>Open flow</span>`;
        }
    }

    const zenDisplay = document.getElementById('zen-timer-display');
    const zenState = document.getElementById('zen-timer-state');
    if (zenDisplay) zenDisplay.textContent = formatTimeCompact(task.actualTime);

    const c = 930;
    const target = task.estimatedTime > 0 ? task.estimatedTime : 1800;
    const arc = document.getElementById('radial-progress-arc');
    const halo = document.getElementById('radial-overtime-halo');
    const stateText = document.getElementById('timer-state-text');
    const timerBtn = document.getElementById('main-timer-btn');
    const zenBtn = document.getElementById('zen-timer-btn');
    const bloomLayer = document.getElementById('inner-bloom-layer');
    const zenBloom = document.getElementById('zen-bloom-layer');

    if (bloomLayer) bloomLayer.classList.toggle('zen-breathing-bloom', isPlaying);
    if (zenBloom) zenBloom.classList.toggle('zen-breathing-bloom', isPlaying);

    if (arc) {
        const progress = Math.min(task.actualTime / target, 1.0);
        arc.style.strokeDashoffset = (c * (1 - progress)).toString();
        if (task.actualTime <= target || task.estimatedTime === 0) {
            arc.style.stroke = isPlaying ? '#10b981' : '#a8a29e';
            if (halo) halo.classList.add('opacity-0');
            const label = isPlaying ? 'In Flow' : 'Ready when you are';
            if (stateText) stateText.textContent = label;
            if (zenState) zenState.textContent = isPlaying ? 'In Flow' : 'Paused';
            if (timerBtn) {
                timerBtn.classList.remove('timer-amber-container');
                timerBtn.classList.toggle('timer-green-container', isPlaying);
                timerBtn.classList.toggle('timer-red-container', !isPlaying);
            }
            if (zenBtn) {
                zenBtn.classList.remove('timer-amber-container');
                zenBtn.classList.toggle('timer-green-container', isPlaying);
                zenBtn.classList.toggle('timer-red-container', !isPlaying);
            }
        } else {
            const overtime = task.actualTime - target;
            arc.style.stroke = '#f59e0b';
            if (halo) {
                const haloC = 980;
                const otProgress = Math.min(overtime / target, 1.0);
                halo.style.strokeDashoffset = (haloC * (1 - otProgress)).toString();
                halo.classList.remove('opacity-0');
                halo.classList.add('overtime-pulse');
            }
            const bonusLabel = `Bonus Flow (+${formatTimeCompact(overtime)})`;
            if (stateText) stateText.textContent = bonusLabel;
            if (zenState) zenState.textContent = bonusLabel;
            if (timerBtn) {
                timerBtn.classList.remove('timer-green-container', 'timer-red-container');
                timerBtn.classList.add('timer-amber-container');
            }
            if (zenBtn) {
                zenBtn.classList.remove('timer-green-container', 'timer-red-container');
                zenBtn.classList.add('timer-amber-container');
            }
        }
    }
}

function logSessionTelemetry(taskId, projectId, durationSec, completed = false) {
    if (!durationSec || durationSec < 4) return;
    const taskObj = (appState.projects || []).flatMap(p => p.tasks || []).find(x => x.id === taskId);
    const projObj = (appState.projects || []).find(x => x.id === projectId);
    appState.sessionLogs = appState.sessionLogs || [];
    appState.sessionLogs.push({
        id: 'sess-' + generateId(),
        taskId: taskId,
        taskTitle: taskObj ? taskObj.title : 'Focus Session',
        projectId: projectId,
        projectTitle: projObj ? projObj.title : 'Studio Track',
        startedAt: new Date(Date.now() - durationSec * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        durationSeconds: durationSec,
        mode: activeSessionMode || 'focus',
        completedTask: completed
    });
    saveStateLocally();
}

// ============================================================================
// 4. STUDIO GPS RE-ENTRY CARD ("Where You Are in the Plan")
// ============================================================================

function formatRelativeTimeAgo(isoDate) {
    if (!isoDate) return 'recently';
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 2) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return days === 1 ? 'yesterday' : `${days} days ago`;
}

function switchActiveRootSlot(rootId) {
    if (isPlaying) forcePause();
    const leaves = getLeafProjects(rootId);
    const root = (appState.projects || []).find(p => p.id === rootId);
    if (!root) return;

    const targetLeaf = (root.activePhaseId && leaves.find(l => l.id === root.activePhaseId)) || leaves[0] || root;
    appState.activeProjectId = targetLeaf.id;
    saveStateLocally();
    renderApp();
}

function renderStudioGPS() {
    enforceProjectSlotLimits();

    const activeProj = getActiveProject();
    const root = getRootProject(activeProj);
    if (!root) return;

    // Ensure activeProj is a leaf track if children exist so user never hits a dead-end parent screen
    const leaves = getLeafProjects(root.id);
    let currentLeaf = activeProj;
    if (hasSubProjects(activeProj.id) && leaves.length > 0) {
        currentLeaf = (root.activePhaseId && leaves.find(l => l.id === root.activePhaseId)) || leaves[0];
        appState.activeProjectId = currentLeaf.id;
    }

    // Slot badge + instant switch pill if both Headliner & Co-Pilot exist
    const headliner = getHeadlinerProject();
    const copilot = getCopilotProject();
    const slotBadge = document.getElementById('gps-slot-badge');
    if (slotBadge) {
        const isHeadliner = root.slotRole === 'headliner';
        if (headliner && copilot) {
            const other = isHeadliner ? copilot : headliner;
            slotBadge.className = "inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider";
            slotBadge.innerHTML = `
                <span class="px-2 py-0.5 rounded-md ${isHeadliner ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'}">
                    ${isHeadliner ? '★ Headliner' : '⚡ Co-Pilot'}
                </span>
                <button onclick="switchActiveRootSlot('${other.id}')" class="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer" title="Switch to ${other.title}">
                    ⇄ ${other.title}
                </button>
            `;
        } else {
            slotBadge.className = "px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider";
            slotBadge.textContent = isHeadliner ? '★ Headliner Project' : '⚡ Co-Pilot Project';
        }
    }

    // Horizon Title, Goal, Time & Deadline
    const titleEl = document.getElementById('gps-project-title');
    const goalEl = document.getElementById('gps-project-goal');
    const timeEl = document.getElementById('gps-time-invested');
    const deadEl = document.getElementById('gps-deadline-badge');

    if (titleEl) titleEl.textContent = root.title || 'Untitled Project';
    if (goalEl) goalEl.textContent = root.goal || 'Define your North Star finish line in project details';
    if (timeEl) timeEl.textContent = `${formatTimeCompact(getCumulativeTime(root.id))} invested`;
    if (deadEl) deadEl.textContent = root.deadline ? `• Target ${root.deadline}` : '';

    // Phase Progress & Stepper Rail
    const allTasksInRoot = [root, ...getAllDescendants(root.id)].flatMap(p => p.tasks || []);
    const doneCount = allTasksInRoot.filter(t => t.isCompleted).length;
    const totalCount = allTasksInRoot.length;
    const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    const phaseLbl = document.getElementById('gps-phase-label');
    const phasePct = document.getElementById('gps-phase-pct');
    const phaseBar = document.getElementById('gps-phase-bar');
    const stepperEl = document.getElementById('gps-phase-stepper');

    if (phaseLbl) {
        phaseLbl.textContent = currentLeaf.id === root.id
            ? `Active Track: ${root.title}`
            : `Active Track: ${currentLeaf.title}`;
    }
    if (phasePct) phasePct.textContent = `${pct}% (${doneCount}/${totalCount} slices)`;
    if (phaseBar) phaseBar.style.width = `${pct}%`;

    if (stepperEl) {
        if (leaves.length <= 1) {
            stepperEl.innerHTML = `<span class="text-[11px] text-stone-400">Single-track project • Open Architect Map anytime to break into phases.</span>`;
        } else {
            stepperEl.innerHTML = leaves.map((leaf, idx) => {
                const leafTasks = leaf.tasks || [];
                const isDone = leafTasks.length > 0 && leafTasks.every(t => t.isCompleted);
                const isCurrent = leaf.id === currentLeaf.id;
                const stateCls = isCurrent ? 'current' : (isDone ? 'done' : 'upcoming');
                const icon = isDone ? '✓' : (isCurrent ? '●' : `${idx + 1}`);
                return `
                    <button onclick="selectProject('${leaf.id}')" class="phase-node ${stateCls} cursor-pointer" title="Switch track to ${leaf.title}">
                        <span>${icon}</span>
                        <span class="truncate max-w-[140px]">${leaf.title}</span>
                    </button>
                `;
            }).join('');
        }
    }

    // Band B: Warm Re-Entry Anchor (Manual Breadcrumb + Auto Session Telemetry)
    renderResumptionBanner();

    // Band C: Curated "On Deck" Queue (Max 3 Slices)
    renderOnDeckQueue(root.id);
}

function renderResumptionBanner() {
    const mount = document.getElementById('resumption-banner-mount');
    if (!mount) return;

    const activeProj = getActiveProject();
    const root = getRootProject(activeProj);
    const task = getActiveTask();

    // 1. Check manual breadcrumb on active task first
    if (task && task.lastParkedContext) {
        const ctx = task.lastParkedContext;
        mount.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="space-y-0.5 min-w-0">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                            <i data-lucide="bookmark" class="w-3.5 h-3.5 text-amber-600"></i> Where You Left Off
                        </span>
                        <span class="text-[11px] text-amber-700/80 font-mono-code truncate">Stopped: ${ctx.whereStopped}</span>
                    </div>
                    <p class="text-xs font-extrabold text-amber-950 truncate">
                        60s Spark: <span class="text-brand-700 font-bold">${ctx.next60sAction}</span>
                    </p>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                    <button onclick="dismissLaunchpad()" class="px-2.5 py-1 bg-white/80 hover:bg-white border border-amber-200 text-amber-900 rounded-xl text-[11px] font-bold">Clear</button>
                    <button onclick="executeLaunchpadResume()" class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center gap-1">
                        <i data-lucide="play" class="w-3 h-3 fill-current"></i> Resume Spark
                    </button>
                </div>
            </div>
        `;
        safeCreateIcons();
        return;
    }

    // 2. Fallback: Auto-generate warm re-entry context from sessionLogs
    const scopeIds = new Set([root?.id, ...(root ? getAllDescendants(root.id).map(d => d.id) : [])]);
    const recentLogs = (appState.sessionLogs || [])
        .filter(l => scopeIds.has(l.projectId))
        .sort((a, b) => new Date(b.endedAt) - new Date(a.endedAt));

    if (recentLogs.length > 0) {
        const last = recentLogs[0];
        const ago = formatRelativeTimeAgo(last.endedAt);
        const mins = Math.max(1, Math.round((last.durationSeconds || 0) / 60));
        mount.innerHTML = `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div class="flex items-center gap-2 min-w-0">
                    <i data-lucide="history" class="w-4 h-4 text-amber-600 shrink-0"></i>
                    <span class="text-amber-950 truncate">
                        <strong>Last session (${ago}):</strong> ${mins}m on <em>"${last.taskTitle}"</em>
                        ${last.completedTask ? ' <span class="text-emerald-700 font-bold">(Completed ✓)</span>' : ''}
                    </span>
                </div>
                <span class="text-[11px] font-semibold text-amber-800 shrink-0">Pick up your next slice below ↓</span>
            </div>
        `;
    } else {
        mount.innerHTML = `
            <div class="flex items-center justify-between text-xs text-amber-950">
                <span class="flex items-center gap-2">
                    <i data-lucide="sunrise" class="w-4 h-4 text-amber-600 shrink-0"></i>
                    <span><strong>Fresh canvas:</strong> Pick one small slice below and press the dial when ready.</span>
                </span>
            </div>
        `;
    }
    safeCreateIcons();
}

function renderOnDeckQueue(rootId) {
    const listEl = document.getElementById('gps-ondeck-list');
    const countEl = document.getElementById('gps-ondeck-count');
    if (!listEl) return;

    const onDeck = getOnDeckTasksForRoot(rootId);
    if (countEl) countEl.textContent = `(${onDeck.length}/3)`;

    const activeTask = getActiveTask();
    let cardsHtml = '';

    for (let i = 0; i < 3; i++) {
        const entry = onDeck[i];
        if (entry) {
            const isCurrent = activeTask && activeTask.id === entry.task.id;
            const rType = getTaskReadiness(entry.task);
            const rIcon = rType === 'spike' ? '🔍' : (rType === 'boulder' ? '🐘' : '⚡');
            cardsHtml += `
                <div onclick="activateOnDeckSlice('${entry.project.id}', '${entry.task.id}')" class="p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${isCurrent ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400/40' : 'bg-stone-50 hover:bg-white border-stone-200'}">
                    <div class="flex items-center justify-between gap-1">
                        <span class="text-[10px] font-extrabold uppercase tracking-wider ${isCurrent ? 'text-emerald-700' : 'text-stone-400'}">
                            ${isCurrent ? '● Active' : `#${i + 1} Up Next`}
                        </span>
                        <button onclick="toggleTaskOnDeck('${entry.project.id}', '${entry.task.id}', event)" class="text-amber-500 hover:text-stone-400 text-xs" title="Remove from On Deck">★</button>
                    </div>
                    <p class="text-xs font-bold text-stone-800 line-clamp-2 leading-snug">${rIcon} ${entry.task.title}</p>
                    <span class="text-[10px] text-stone-400 truncate">${entry.project.title}</span>
                </div>
            `;
        } else {
            cardsHtml += `
                <div onclick="enterArchitectMode('map')" class="p-2.5 rounded-2xl border border-dashed border-stone-200 hover:border-brand-300 bg-stone-50/40 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[74px]">
                    <span class="text-[11px] font-bold text-stone-400">+ Empty Slot ${i + 1}</span>
                    <span class="text-[10px] text-stone-400">Star a slice in Map or Track</span>
                </div>
            `;
        }
    }

    listEl.innerHTML = cardsHtml;
}

function activateOnDeckSlice(projectId, taskId) {
    if (isPlaying) forcePause();
    appState.activeProjectId = projectId;
    const p = (appState.projects || []).find(x => x.id === projectId);
    if (p) p.activeTaskId = taskId;
    saveStateLocally();
    renderApp();
}

function toggleTaskOnDeck(projectId, taskId, e) {
    if (e) e.stopPropagation();
    const p = (appState.projects || []).find(x => x.id === projectId);
    if (!p) return;
    const t = (p.tasks || []).find(x => x.id === taskId);
    if (!t) return;

    if (t.isOnDeck) {
        t.isOnDeck = false;
    } else {
        const root = getRootProject(p);
        const currentCount = root ? getOnDeckTasksForRoot(root.id).length : 0;
        if (currentCount >= 3) {
            alert("Your On-Deck Queue already has 3 slices. Complete or unstar one first so your focus stays calm.");
            return;
        }
        t.isOnDeck = true;
    }
    saveStateLocally();
    renderApp();
    if (currentView === 'map' && typeof TreeScopeEngine !== 'undefined') {
        TreeScopeEngine.render();
    }
}

// ============================================================================
// 5. TASK SLICER MODAL (ANTI-PARALYSIS BOULDER SPLITTER)
// ============================================================================

function openTaskSlicerModal(projectId = null, taskId = null) {
    const p = projectId
        ? (appState.projects || []).find(x => x.id === projectId)
        : getActiveProject();
    const t = (p && taskId)
        ? (p.tasks || []).find(x => x.id === taskId)
        : getActiveTask();

    if (!p || !t) {
        alert("Select a task first to slice it into smaller steps.");
        return;
    }

    activeSlicerTarget = { projectId: p.id, taskId: t.id };
    const modal = document.getElementById('task-slicer-modal');
    const titleEl = document.getElementById('slicer-target-title');
    if (titleEl) titleEl.textContent = t.title;

    ['slice-input-1', 'slice-input-2', 'slice-input-3', 'slice-input-4'].forEach(id => {
        const inp = document.getElementById(id);
        if (inp) inp.value = '';
    });

    if (modal) modal.classList.remove('hidden');
    const firstInp = document.getElementById('slice-input-1');
    if (firstInp) firstInp.focus();
    safeCreateIcons();
}

function closeTaskSlicerModal() {
    const modal = document.getElementById('task-slicer-modal');
    if (modal) modal.classList.add('hidden');
    activeSlicerTarget = null;
}

function convertSlicerTargetToSpike() {
    if (!activeSlicerTarget) return;
    const p = (appState.projects || []).find(x => x.id === activeSlicerTarget.projectId);
    const t = p ? (p.tasks || []).find(x => x.id === activeSlicerTarget.taskId) : null;
    if (t) {
        t.readiness = 'spike';
        if (!t.estimatedTime || t.estimatedTime === 0) t.estimatedTime = 20 * 60;
        saveStateLocally();
    }
    closeTaskSlicerModal();
    renderApp();
    if (currentView === 'map' && typeof TreeScopeEngine !== 'undefined') TreeScopeEngine.render();
}

function confirmTaskSlice() {
    if (!activeSlicerTarget) return;
    const p = (appState.projects || []).find(x => x.id === activeSlicerTarget.projectId);
    const parentTask = p ? (p.tasks || []).find(x => x.id === activeSlicerTarget.taskId) : null;
    if (!p || !parentTask) return;

    const sliceTitles = ['slice-input-1', 'slice-input-2', 'slice-input-3', 'slice-input-4']
        .map(id => document.getElementById(id)?.value.trim())
        .filter(Boolean);

    if (sliceTitles.length === 0) {
        alert("Enter at least 1 smaller slice, or turn this task into a 20m Research Spike.");
        return;
    }

    const idx = p.tasks.findIndex(x => x.id === parentTask.id);
    const newSlices = sliceTitles.map((title, i) => ({
        id: 't-' + generateId(),
        title: title,
        readiness: 'slice',
        isOnDeck: i === 0 ? true : false,
        estimatedTime: 0,
        actualTime: 0,
        isCompleted: false,
        deadline: parentTask.deadline || '',
        notes: `Sliced from: ${parentTask.title}`,
        createdAt: new Date().toISOString(),
        microSteps: [],
        lastParkedContext: null
    }));

    // Replace the boulder with its crisp Ready Slices
    p.tasks.splice(idx, 1, ...newSlices);
    p.activeTaskId = newSlices[0].id;
    appState.activeProjectId = p.id;

    saveStateLocally();
    closeTaskSlicerModal();
    confetti({ particleCount: 45, spread: 45 });
    renderApp();
    if (currentView === 'map' && typeof TreeScopeEngine !== 'undefined') TreeScopeEngine.render();
}

// ============================================================================
// 6. PROJECT VAULT (1 HEADLINER + 1 CO-PILOT + PARKING LOT)
// ============================================================================

function renderProjectVault() {
    enforceProjectSlotLimits();
    updateSprintCycleUI();

    const headliner = getHeadlinerProject();
    const copilot = getCopilotProject();
    const parked = getParkedRootProjects();
    const completed = getCompletedRootProjects();

    const headEl = document.getElementById('vault-headliner-slot');
    const copilotEl = document.getElementById('vault-copilot-slot');
    const parkedEl = document.getElementById('vault-parking-list');
    const parkedCount = document.getElementById('vault-parked-count');
    const compEl = document.getElementById('vault-completed-list');
    const compCount = document.getElementById('vault-completed-count');

    function buildActiveSlotCard(proj, roleLabel) {
        if (!proj) {
            return `
                <div class="p-6 rounded-2xl border border-dashed border-stone-200 text-center space-y-2">
                    <p class="text-xs text-stone-400 italic">No ${roleLabel} assigned.</p>
                    <button onclick="createNewProject()" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold">+ Create ${roleLabel}</button>
                </div>
            `;
        }
        const totalSec = getCumulativeTime(proj.id);
        const allTasks = [proj, ...getAllDescendants(proj.id)].flatMap(x => x.tasks || []);
        const done = allTasks.filter(t => t.isCompleted).length;

        return `
            <div class="space-y-3">
                <div>
                    <h3 class="text-base font-black text-stone-900">${proj.title}</h3>
                    <p class="text-xs text-stone-500 mt-0.5 line-clamp-2">${proj.goal || 'No North Star goal set yet.'}</p>
                </div>
                <div class="flex items-center gap-3 text-[11px] font-mono-code text-stone-500">
                    <span>${done}/${allTasks.length} slices</span>
                    <span>•</span>
                    <span>${formatTimeCompact(totalSec)}</span>
                    ${proj.deadline ? `<span>• Due ${proj.deadline}</span>` : ''}
                </div>
                <div class="flex flex-wrap items-center gap-2 pt-1">
                    <button onclick="switchActiveRootSlot('${proj.id}'); enterOperatorMode();" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold">Focus Now</button>
                    <button onclick="TreeScopeEngine.switchProject('${proj.id}'); switchView('map');" class="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-brand-700 rounded-xl text-xs font-bold">Open Map</button>
                    <button onclick="parkRootProject('${proj.id}')" class="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold">Park</button>
                    <button onclick="toggleCompleteProject('${proj.id}')" class="px-2.5 py-1.5 bg-stone-100 hover:bg-emerald-100 text-stone-600 hover:text-emerald-700 rounded-xl text-xs font-bold">Finish</button>
                </div>
            </div>
        `;
    }

    if (headEl) headEl.innerHTML = buildActiveSlotCard(headliner, 'Headliner');
    if (copilotEl) copilotEl.innerHTML = buildActiveSlotCard(copilot, 'Co-Pilot');
    if (parkedCount) parkedCount.textContent = parked.length;
    if (compCount) compCount.textContent = completed.length;

    if (parkedEl) {
        if (parked.length === 0) {
            parkedEl.innerHTML = `<p class="text-xs text-stone-400 italic py-3 text-center">Parking Lot is empty. Any extra projects you create will rest safely here.</p>`;
        } else {
            parkedEl.innerHTML = parked.map(p => `
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <div class="min-w-0">
                        <h4 class="text-xs font-extrabold text-stone-800 truncate">${p.title}</h4>
                        <p class="text-[11px] text-stone-500 truncate">${p.goal || 'Parked idea'}</p>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button onclick="promoteToSlot('${p.id}', 'headliner')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold">Make Headliner</button>
                        <button onclick="promoteToSlot('${p.id}', 'copilot')" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-brand-700 border border-indigo-200 rounded-lg text-[11px] font-bold">Make Co-Pilot</button>
                        <button onclick="deleteProject('${p.id}')" class="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg" title="Delete"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                    </div>
                </div>
            `).join('');
        }
    }

    if (compEl) {
        if (completed.length === 0) {
            compEl.innerHTML = `<p class="text-xs text-stone-400 italic py-2 text-center">No finished projects archived yet.</p>`;
        } else {
            compEl.innerHTML = completed.map(p => `
                <div class="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
                    <span class="line-through font-bold text-stone-500 truncate pr-2">${p.title}</span>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <button onclick="openProjectRetrospective('${p.id}')" class="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold">Post-Doc</button>
                        <button onclick="toggleCompleteProject('${p.id}')" class="px-2.5 py-1 bg-white border border-stone-200 text-stone-600 rounded-lg font-bold">Reopen</button>
                    </div>
                </div>
            `).join('');
        }
    }

    safeCreateIcons();
}

function parkRootProject(rootId) {
    const p = (appState.projects || []).find(x => x.id === rootId);
    if (!p) return;
    p.isParked = true;
    p.slotRole = null;
    enforceProjectSlotLimits();
    saveStateLocally();
    renderProjectVault();
}

function promoteToSlot(rootId, targetRole) {
    const incoming = (appState.projects || []).find(x => x.id === rootId);
    if (!incoming) return;

    const currentOccupant = targetRole === 'headliner' ? getHeadlinerProject() : getCopilotProject();
    if (currentOccupant && currentOccupant.id !== incoming.id) {
        const note = prompt(
            `Context-Switch Check:\nYou are parking "${currentOccupant.title}" to activate "${incoming.title}".\n\nLeave a 1-line breadcrumb for where you stopped on "${currentOccupant.title}" (or leave blank):`
        );
        if (note === null) return; // Cancelled switch
        if (note.trim()) {
            const leaves = getLeafProjects(currentOccupant.id);
            const activeLeaf = leaves.find(l => l.activeTaskId) || leaves[0];
            const activeTask = activeLeaf ? (activeLeaf.tasks || []).find(t => t.id === activeLeaf.activeTaskId) : null;
            if (activeTask) {
                activeTask.lastParkedContext = {
                    whereStopped: note.trim(),
                    next60sAction: `Resume ${activeTask.title}`,
                    parkedAt: new Date().toISOString()
                };
            }
        }
        currentOccupant.isParked = true;
        currentOccupant.slotRole = null;
    }

    incoming.isParked = false;
    incoming.slotRole = targetRole;
    const leaves = getLeafProjects(incoming.id);
    appState.activeProjectId = leaves[0]?.id || incoming.id;

    saveStateLocally();
    renderProjectVault();
}

// ============================================================================
// 7. PROJECT CREATION, COMPLETION & POST-DOC RETROSPECTIVE
// ============================================================================

function createNewProject(parentId = null) {
    syncHeaderInputsToState();
    let makeParked = false;
    let slotRole = null;
    let tasksToMigrate = [];

    if (!parentId) {
        const headliner = getHeadlinerProject();
        const copilot = getCopilotProject();
        if (!headliner) {
            slotRole = 'headliner';
        } else if (!copilot) {
            slotRole = 'copilot';
        } else {
            makeParked = true;
        }
    } else {
        const depth = getProjectDepth(parentId);
        if (depth >= 2) {
            alert("Maximum 3-tier hierarchy reached (Main Project -> Phase -> Component Track).");
            return;
        }
        const parent = (appState.projects || []).find(p => p.id === parentId);
        if (parent && parent.tasks && parent.tasks.length > 0) {
            tasksToMigrate = [...parent.tasks];
            parent.tasks = [];
            parent.activeTaskId = null;
        }
    }

    const id = 'proj-' + generateId();
    const parentDepth = parentId ? getProjectDepth(parentId) : -1;
    const projectTitle = parentDepth === 0 ? 'New Phase' : (parentDepth === 1 ? 'New Component Track' : 'New Studio Project');

    const newProject = {
        id,
        parentId: parentId,
        title: projectTitle,
        goal: '',
        deadline: '',
        notes: '',
        retrospectiveNotes: '',
        isParked: makeParked,
        slotRole: slotRole,
        totalTimeSpent: 0,
        activeTaskId: tasksToMigrate.length > 0 ? tasksToMigrate[0].id : null,
        activeMascotId: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
        tasks: tasksToMigrate
    };

    appState.projects = appState.projects || [];
    appState.projects.push(newProject);
    if (!makeParked) {
        appState.activeProjectId = id;
    }

    saveStateLocally();
    if (makeParked) {
        alert(`"${projectTitle}" was placed safely in your Parking Lot because both Headliner and Co-Pilot slots are full.`);
        renderProjectVault();
    } else if (currentView === 'vault') {
        renderProjectVault();
    } else {
        renderApp();
    }
}

function selectProject(projectId) {
    syncHeaderInputsToState();
    appState.activeProjectId = projectId;
    const proj = (appState.projects || []).find(p => p.id === projectId);
    const root = getRootProject(proj);
    if (root && proj && proj.id !== root.id) {
        root.activePhaseId = proj.id;
    }
    saveStateLocally();
    renderApp();
}

function deleteProject(projectId, e) {
    if (e) e.stopPropagation();
    const proj = (appState.projects || []).find(p => p.id === projectId);
    if (!proj) return;
    if (confirm(`Delete "${proj.title}" and all its sub-tracks and slices?`)) {
        const toDelete = new Set();
        function collectIds(id) {
            toDelete.add(id);
            (appState.projects || []).filter(p => p.parentId === id).forEach(sp => collectIds(sp.id));
        }
        collectIds(projectId);

        appState.projects = (appState.projects || []).filter(p => !toDelete.has(p.id));
        if (appState.projects.length === 0) {
            loadDefaultData();
        }
        enforceProjectSlotLimits();
        saveStateLocally();
        if (currentView === 'vault') renderProjectVault();
        else renderApp();
    }
}

function toggleCompleteCurrentProject() {
    const p = getRootProject(getActiveProject()) || getActiveProject();
    if (!p) return;
    closeProjectSettingsModal();
    toggleCompleteProject(p.id);
}

function toggleCompleteProject(projectId, e) {
    if (e) e.stopPropagation();
    const p = (appState.projects || []).find(x => x.id === projectId);
    if (!p) return;

    if (!p.completedAt) {
        if (isPlaying) forcePause();
        p.completedAt = new Date().toISOString();
        p.slotRole = null;
        enforceProjectSlotLimits();
        saveStateLocally();
        playSound('complete');
        confetti({ particleCount: 100, spread: 70 });
        if (currentView === 'vault') renderProjectVault();
        else renderApp();
        openProjectRetrospective(p.id);
    } else {
        p.completedAt = null;
        p.isParked = true;
        saveStateLocally();
        if (currentView === 'vault') renderProjectVault();
        else renderApp();
    }
}

function openProjectRetrospective(projectId) {
    const p = (appState.projects || []).find(x => x.id === projectId);
    if (!p) return;
    activePostDocProjectId = p.id;

    const modal = document.getElementById('project-retrospective-modal');
    if (!modal) return;

    const allProjTasks = [];
    function collectTasks(proj) {
        (proj.tasks || []).forEach(t => allProjTasks.push({ ...t, projectTitle: proj.title }));
        (appState.projects || []).filter(sp => sp.parentId === proj.id).forEach(collectTasks);
    }
    collectTasks(p);

    const totalActual = getCumulativeTime(p.id);
    const totalEst = allProjTasks.reduce((acc, t) => acc + (t.estimatedTime || 0), 0);
    const completedCount = allProjTasks.filter(t => t.isCompleted).length;
    const accuracy = totalEst > 0 ? Math.round((totalActual / totalEst) * 100) : 100;

    const created = p.createdAt ? new Date(p.createdAt) : new Date();
    const completed = p.completedAt ? new Date(p.completedAt) : new Date();
    const daysActive = Math.max(1, Math.round((completed.getTime() - created.getTime()) / 86400000));

    document.getElementById('postdoc-modal-title').textContent = `${p.title} Post-Doc`;
    document.getElementById('postdoc-headline').textContent = `${p.title} Shipped!`;
    document.getElementById('postdoc-dates-label').textContent = `Completed on ${getLocalFormattedDate(completed)} • ${daysActive} day(s) active`;

    document.getElementById('postdoc-total-time').textContent = formatTimeHuman(totalActual);
    document.getElementById('postdoc-target-time').textContent = totalEst > 0 ? formatTimeHuman(totalEst) : 'Open';
    document.getElementById('postdoc-accuracy').textContent = `${accuracy}%`;
    document.getElementById('postdoc-tasks-count').textContent = `${completedCount}/${allProjTasks.length}`;

    const taskLogContainer = document.getElementById('postdoc-tasks-breakdown');
    if (taskLogContainer) {
        taskLogContainer.innerHTML = allProjTasks.length === 0
            ? `<div class="p-3 text-xs text-stone-400 italic text-center">No slices recorded.</div>`
            : allProjTasks.map(t => `
                <div class="px-3.5 py-2 flex items-center justify-between text-xs">
                    <span class="flex items-center gap-2 font-medium text-stone-700 truncate pr-2">
                        <i data-lucide="${t.isCompleted ? 'check-circle' : 'circle'}" class="w-3.5 h-3.5 ${t.isCompleted ? 'text-emerald-500' : 'text-stone-300'}"></i>
                        <span class="truncate ${t.isCompleted ? 'line-through text-stone-500' : ''}">${t.title}</span>
                    </span>
                    <span class="font-mono-code text-[11px] text-stone-500 shrink-0">${formatTimeCompact(t.actualTime)}</span>
                </div>
            `).join('');
    }

    const notesTa = document.getElementById('postdoc-reflection-notes');
    if (notesTa) {
        notesTa.value = p.retrospectiveNotes || '';
        notesTa.oninput = (e) => {
            p.retrospectiveNotes = e.target.value;
            saveStateLocally();
        };
    }

    modal.classList.remove('hidden');
    safeCreateIcons();
}

function closeProjectRetrospectiveModal() {
    const modal = document.getElementById('project-retrospective-modal');
    if (modal) modal.classList.add('hidden');
    activePostDocProjectId = null;
}

function reopenPostDocProject() {
    if (!activePostDocProjectId) return;
    const p = (appState.projects || []).find(x => x.id === activePostDocProjectId);
    if (p) {
        p.completedAt = null;
        p.isParked = true;
        saveStateLocally();
        renderApp();
    }
    closeProjectRetrospectiveModal();
}

// ============================================================================
// 8. OPERATOR TASK LIST & SLICE/SPIKE/BOULDER RENDERING
// ============================================================================

function renderTasks() {
    const p = getActiveProject();
    const taskContainer = document.getElementById('task-list-container');
    const milestoneHub = document.getElementById('container-milestone-hub');
    const completedWrapper = document.getElementById('completed-tasks-wrapper');
    const completedContainer = document.getElementById('completed-tasks-container');
    const completedLabel = document.getElementById('completed-tasks-count-label');
    const taskProgressText = document.getElementById('task-progress-text');
    const addTaskContainer = document.getElementById('add-task-container');
    const titleSection = document.getElementById('tasks-section-title');

    if (!p) return;

    if (titleSection) {
        titleSection.innerHTML = `<i data-lucide="list-checks" class="w-4 h-4 text-emerald-600"></i> ${p.title} Slices`;
    }

    if (milestoneHub) milestoneHub.classList.add('hidden');
    if (addTaskContainer) addTaskContainer.classList.remove('hidden');

    const tasks = p.tasks || [];
    const pendingTasks = tasks.filter(t => !t.isCompleted);
    const completedTasks = tasks.filter(t => t.isCompleted);

    if (taskProgressText) {
        taskProgressText.textContent = `${completedTasks.length}/${tasks.length} Done`;
    }

    if (taskContainer) {
        if (pendingTasks.length === 0) {
            taskContainer.innerHTML = `<div class="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 text-center text-xs text-stone-500">All slices in this track are clear! Add a new slice below or switch tracks in the GPS bar above.</div>`;
        } else {
            taskContainer.innerHTML = pendingTasks.map(t => {
                const isCurrent = t.id === p.activeTaskId;
                const rType = getTaskReadiness(t);
                const badgeHtml = rType === 'spike'
                    ? `<span class="readiness-badge readiness-spike">🔍 20m Spike</span>`
                    : (rType === 'boulder'
                        ? `<span class="readiness-badge readiness-boulder">🐘 Boulder</span>`
                        : `<span class="readiness-badge readiness-slice">⚡ Slice</span>`);

                return `
                    <div onclick="selectTask('${t.id}')" class="group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${isCurrent ? 'bg-emerald-50/40 border-emerald-400 ring-1 ring-emerald-400/30' : 'bg-white border-stone-200/80 hover:border-stone-300'}">
                        <div class="flex items-center gap-3 min-w-0 flex-1">
                            <input type="checkbox" onclick="event.stopPropagation()" onchange="toggleTaskComplete('${t.id}', event)" class="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer">
                            <div class="flex flex-col min-w-0 flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    ${badgeHtml}
                                    <span class="text-xs font-bold text-stone-800 truncate">${t.title}</span>
                                </div>
                                <div class="flex items-center gap-2 text-[10px] text-stone-400 font-mono-code mt-0.5">
                                    <span>Logged: ${formatTimeCompact(t.actualTime)}</span>
                                    ${t.estimatedTime > 0 ? `<span>• Box: ${Math.round(t.estimatedTime / 60)}m</span>` : ''}
                                    ${t.deadline ? `<span>• Due: ${t.deadline}</span>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 shrink-0 ml-2">
                            <button onclick="toggleTaskOnDeck('${p.id}', '${t.id}', event)" title="${t.isOnDeck ? 'Remove from On Deck' : 'Star to On Deck (Max 3)'}" class="p-1.5 rounded-lg text-xs transition-colors ${t.isOnDeck ? 'text-amber-500 bg-amber-50' : 'text-stone-300 hover:text-amber-500'}">
                                ★
                            </button>
                            <button onclick="event.stopPropagation(); openTaskSlicerModal('${p.id}', '${t.id}')" title="Slice into smaller tasks" class="p-1.5 text-stone-400 hover:text-amber-600 rounded-lg transition-colors">
                                <i data-lucide="scissors" class="w-3.5 h-3.5"></i>
                            </button>
                            <button onclick="deleteTask('${t.id}', event)" title="Delete" class="p-1.5 text-stone-300 hover:text-rose-500 rounded-lg transition-colors">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    if (completedWrapper && completedContainer) {
        if (completedTasks.length > 0) {
            completedWrapper.classList.remove('hidden');
            if (completedLabel) completedLabel.textContent = `Completed Slices (${completedTasks.length})`;
            completedContainer.classList.toggle('hidden', !appState.completedTasksDrawerOpen);
            completedContainer.innerHTML = completedTasks.map(t => `
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 text-xs border border-stone-200/60 opacity-75">
                    <label class="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                        <input type="checkbox" checked onchange="toggleTaskComplete('${t.id}', event)" class="w-4 h-4 rounded text-emerald-600 focus:ring-0">
                        <span class="line-through text-stone-500 font-medium truncate">${t.title}</span>
                    </label>
                    <span class="text-[10px] font-mono-code text-stone-400 shrink-0 ml-2">${formatTimeCompact(t.actualTime)}</span>
                </div>
            `).join('');
        } else {
            completedWrapper.classList.add('hidden');
        }
    }
    safeCreateIcons();
}

function handleAddTask() {
    const inTitle = document.getElementById('new-task-title-input');
    const inType = document.getElementById('new-task-type-input');
    const title = inTitle?.value.trim();
    const readiness = inType?.value || 'slice';
    const p = getActiveProject();

    if (!title || !p) return;

    p.tasks = p.tasks || [];
    const root = getRootProject(p);
    const currentOnDeck = root ? getOnDeckTasksForRoot(root.id).length : 0;

    const newTask = {
        id: 't-' + generateId(),
        title: title,
        readiness: readiness,
        isOnDeck: currentOnDeck < 3,
        estimatedTime: readiness === 'spike' ? 20 * 60 : 0,
        actualTime: 0,
        isCompleted: false,
        deadline: '',
        notes: '',
        createdAt: new Date().toISOString(),
        microSteps: [],
        lastParkedContext: null
    };

    p.tasks.push(newTask);
    if (!p.activeTaskId) p.activeTaskId = newTask.id;
    inTitle.value = '';
    saveStateLocally();
    renderApp();
}

function selectTask(taskId) {
    if (isPlaying) forcePause();
    const p = getActiveProject();
    if (!p) return;
    p.activeTaskId = taskId;
    saveStateLocally();
    renderApp();
}

function toggleTaskComplete(taskId, e) {
    if (e) e.stopPropagation();
    const p = getActiveProject();
    if (!p) return;
    const task = (p.tasks || []).find(t => t.id === taskId);
    if (!task) return;

    if (!task.isCompleted) {
        if (isPlaying && p.activeTaskId === taskId) forcePause();
        task.isCompleted = true;
        task.isOnDeck = false;
        task.completionDate = new Date().toISOString();
        playSound('complete');
        confetti({ particleCount: 70, spread: 55 });
        logSessionTelemetry(task.id, p.id, task.actualTime, true);

        const next = (p.tasks || []).find(t => !t.isCompleted);
        p.activeTaskId = next ? next.id : null;
    } else {
        task.isCompleted = false;
        task.completionDate = null;
        if (!p.activeTaskId) p.activeTaskId = task.id;
    }
    saveStateLocally();
    renderApp();
}

function deleteTask(taskId, e) {
    if (e) e.stopPropagation();
    const p = getActiveProject();
    if (!p) return;
    if (confirm("Delete this slice?")) {
        p.tasks = (p.tasks || []).filter(t => t.id !== taskId);
        if (p.activeTaskId === taskId) {
            const next = (p.tasks || []).find(t => !t.isCompleted);
            p.activeTaskId = next ? next.id : (p.tasks[0]?.id || null);
        }
        saveStateLocally();
        renderApp();
    }
}

function changeActiveTaskReadiness(newType) {
    const task = getActiveTask();
    if (!task) return;
    task.readiness = newType;
    if (newType === 'spike' && (!task.estimatedTime || task.estimatedTime === 0)) {
        task.estimatedTime = 20 * 60;
    }
    saveStateLocally();
    renderApp();
}

function handleActiveTaskEstimateChange(newVal) {
    const task = getActiveTask();
    if (!task || task.isCompleted) return;
    const cleanMins = newVal === '' ? 0 : parseInt(newVal, 10);
    if (isNaN(cleanMins) || cleanMins < 0) return;
    task.estimatedTime = cleanMins * 60;
    saveStateLocally();
    renderApp();
}

// ============================================================================
// 9. ACTIVE TASK STAGE & VISUALS
// ============================================================================

function renderTimerVisuals() {
    const p = getActiveProject();
    const task = getActiveTask();

    const titleEl = document.getElementById('active-task-title');
    const badgeEl = document.getElementById('active-task-readiness-badge');
    const readinessSel = document.getElementById('active-task-readiness-select');
    const zenTitleEl = document.getElementById('zen-active-task-title');
    const zenNotesEl = document.getElementById('zen-task-notes');
    const taskNotesEl = document.getElementById('active-task-notes');
    const taskDeadEl = document.getElementById('active-task-deadline');
    const estInput = document.getElementById('active-task-est-mins');

    if (task) {
        const rType = getTaskReadiness(task);
        if (titleEl) titleEl.textContent = task.title;
        if (zenTitleEl) zenTitleEl.textContent = task.title;
        if (zenNotesEl) zenNotesEl.textContent = task.notes || 'Stay present with this single slice';
        if (taskNotesEl && document.activeElement !== taskNotesEl) taskNotesEl.value = task.notes || '';
        if (taskDeadEl && document.activeElement !== taskDeadEl) taskDeadEl.value = task.deadline || '';
        if (readinessSel) readinessSel.value = rType;

        if (badgeEl) {
            if (rType === 'spike') {
                badgeEl.className = 'readiness-badge readiness-spike shrink-0';
                badgeEl.textContent = '🔍 20m Spike';
            } else if (rType === 'boulder') {
                badgeEl.className = 'readiness-badge readiness-boulder shrink-0';
                badgeEl.textContent = '🐘 Needs Slicing';
            } else {
                badgeEl.className = 'readiness-badge readiness-slice shrink-0';
                badgeEl.textContent = '⚡ Ready Slice';
            }
        }

        if (estInput && document.activeElement !== estInput) {
            estInput.value = task.estimatedTime > 0 ? Math.round(task.estimatedTime / 60) : '';
            estInput.disabled = !!task.isCompleted;
        }

        updateTimerTexts(p, task);
    } else {
        if (titleEl) titleEl.textContent = 'Pick or add a slice below to start';
        if (zenTitleEl) zenTitleEl.textContent = 'Select a slice to begin';
        if (badgeEl) {
            badgeEl.className = 'readiness-badge readiness-slice shrink-0';
            badgeEl.textContent = '⚡ Ready';
        }
        const disp = document.getElementById('active-timer-display');
        if (disp) disp.textContent = '00:00:00';
        const stateTxt = document.getElementById('timer-state-text');
        if (stateTxt) stateTxt.textContent = 'Ready when you are';
    }
}

// ============================================================================
// 10. ANCHORING, MICRO-STEPS, SCRATCHPAD, COMPANIONS & POPOVERS
// ============================================================================

function openParkModal() {
    const modal = document.getElementById('park-resume-modal');
    if (!modal) {
        forcePause();
        return;
    }
    document.getElementById('park-stopped-input').value = '';
    document.getElementById('park-next60s-input').value = '';
    modal.classList.remove('hidden');
    document.getElementById('park-stopped-input').focus();
}

function dismissParkModal() {
    document.getElementById('park-resume-modal').classList.add('hidden');
    forcePause();
}

function confirmParkAndPause() {
    const task = getActiveTask();
    if (task) {
        task.lastParkedContext = {
            whereStopped: document.getElementById('park-stopped-input').value.trim() || 'Mid-session pause',
            next60sAction: document.getElementById('park-next60s-input').value.trim() || `Continue ${task.title}`,
            parkedAt: new Date().toISOString()
        };
        task.pausedAt = new Date().toISOString();
    }
    document.getElementById('park-resume-modal').classList.add('hidden');
    forcePause();
    renderApp();
}

function executeLaunchpadResume() {
    const task = getActiveTask();
    if (task) {
        task.lastParkedContext = null;
        saveStateLocally();
    }
    renderApp();
    if (!isPlaying) toggleTimer();
}

function dismissLaunchpad() {
    const task = getActiveTask();
    if (task) {
        task.lastParkedContext = null;
        saveStateLocally();
    }
    renderApp();
}

function renderMicroSteps(task) {
    const list = document.getElementById('active-task-microsteps-list');
    const summary = document.getElementById('microstep-summary');
    if (!list || !summary) return;
    if (!task) {
        list.innerHTML = '';
        summary.textContent = '0/0 done';
        return;
    }
    task.microSteps = task.microSteps || [];
    const completed = task.microSteps.filter(s => s.isCompleted).length;
    summary.textContent = `${completed}/${task.microSteps.length} done`;
    list.innerHTML = task.microSteps.map(s => `
        <div class="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-stone-200/80 text-xs">
            <label class="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                <input type="checkbox" ${s.isCompleted ? 'checked' : ''} onchange="toggleMicroStep('${s.id}')" class="rounded text-emerald-600 focus:ring-0">
                <span class="${s.isCompleted ? 'line-through text-stone-400' : 'text-stone-700 font-medium'} truncate">${s.title}</span>
            </label>
            <button onclick="deleteMicroStep('${s.id}')" class="text-stone-300 hover:text-rose-500 p-1">
                <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
        </div>
    `).join('');
    safeCreateIcons();
}

function addPresetMicroStep(title, mins) {
    const task = getActiveTask();
    if (!task) return;
    task.microSteps = task.microSteps || [];
    task.microSteps.push({ id: 'ms-' + generateId(), title: `${title} (${mins}m)`, isCompleted: false });
    saveStateLocally();
    renderMicroSteps(task);
}

function addCustomMicroStep() {
    const input = document.getElementById('custom-microstep-input');
    const val = input.value.trim();
    const task = getActiveTask();
    if (!val || !task) return;
    task.microSteps = task.microSteps || [];
    task.microSteps.push({ id: 'ms-' + generateId(), title: val, isCompleted: false });
    input.value = '';
    saveStateLocally();
    renderMicroSteps(task);
}

function toggleMicroStep(stepId) {
    const task = getActiveTask();
    if (!task) return;
    const s = (task.microSteps || []).find(x => x.id === stepId);
    if (s) {
        s.isCompleted = !s.isCompleted;
        if (s.isCompleted) {
            playSound('complete');
            confetti({ particleCount: 35, spread: 40 });
        }
        saveStateLocally();
        renderMicroSteps(task);
    }
}

function deleteMicroStep(stepId) {
    const task = getActiveTask();
    if (!task) return;
    task.microSteps = (task.microSteps || []).filter(x => x.id !== stepId);
    saveStateLocally();
    renderMicroSteps(task);
}

function toggleTaskDetailsDrawer() {
    const drawer = document.getElementById('task-details-drawer');
    const chevron = document.getElementById('task-details-chevron');
    if (drawer) drawer.classList.toggle('hidden');
    if (chevron && drawer) {
        chevron.style.transform = drawer.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
    }
}

function toggleCompletedTasksDrawer() {
    appState.completedTasksDrawerOpen = !appState.completedTasksDrawerOpen;
    const container = document.getElementById('completed-tasks-container');
    const chevron = document.getElementById('completed-tasks-chevron');
    if (container) container.classList.toggle('hidden', !appState.completedTasksDrawerOpen);
    if (chevron) chevron.style.transform = appState.completedTasksDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    saveStateLocally();
}

// Mental RAM Dump (Scratchpad)
function toggleScratchpadModal() {
    const modal = document.getElementById('scratchpad-modal');
    modal.classList.toggle('hidden');
    if (!modal.classList.contains('hidden')) {
        renderScratchpadList();
        document.getElementById('scratchpad-input').focus();
    }
}

function submitScratchpadItem() {
    const input = document.getElementById('scratchpad-input');
    const text = input.value.trim();
    if (!text) return;
    appState.scratchpad = appState.scratchpad || [];
    appState.scratchpad.unshift({
        id: 'sp-' + generateId(),
        text: text,
        createdAt: new Date().toISOString(),
        relatedTaskId: getActiveTask()?.id || null
    });
    input.value = '';
    saveStateLocally();
    renderScratchpadList();
}

function renderScratchpadList() {
    const container = document.getElementById('scratchpad-items-list');
    if (!container) return;
    const items = appState.scratchpad || [];
    if (items.length === 0) {
        container.innerHTML = `<p class="text-xs text-stone-400 py-4 text-center italic">Your mental RAM is clear.</p>`;
        return;
    }
    container.innerHTML = items.map(item => `
        <div class="flex items-center justify-between py-2.5 text-xs">
            <span class="text-stone-700 flex-1 truncate pr-2">${item.text}</span>
            <div class="flex items-center gap-1 shrink-0">
                <button onclick="convertScratchpadToTask('${item.id}')" class="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-brand-700 rounded-lg text-[10px] font-bold">To Slice</button>
                <button onclick="deleteScratchpadItem('${item.id}')" class="text-stone-400 hover:text-rose-500 p-1"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
            </div>
        </div>
    `).join('');
    safeCreateIcons();
}

function convertScratchpadToTask(itemId) {
    const item = (appState.scratchpad || []).find(x => x.id === itemId);
    const p = getActiveProject();
    if (!item || !p) return;

    const newTask = {
        id: 't-' + generateId(),
        title: item.text,
        readiness: 'slice',
        isOnDeck: false,
        estimatedTime: 0,
        actualTime: 0,
        isCompleted: false,
        deadline: '',
        notes: 'Captured from RAM Dump',
        createdAt: new Date().toISOString(),
        microSteps: [],
        lastParkedContext: null
    };
    p.tasks = p.tasks || [];
    p.tasks.push(newTask);
    if (!p.activeTaskId) p.activeTaskId = newTask.id;
    deleteScratchpadItem(itemId);
    renderApp();
}

function deleteScratchpadItem(itemId) {
    appState.scratchpad = (appState.scratchpad || []).filter(x => x.id !== itemId);
    saveStateLocally();
    renderScratchpadList();
}

window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        toggleScratchpadModal();
    }
});

// Companions
function getAvailableMascots() {
    if (typeof mascotDatabase !== 'undefined' && Array.isArray(mascotDatabase) && mascotDatabase.length > 0) {
        return mascotDatabase;
    }
    if (typeof window !== 'undefined' && window.mascotDatabase && Array.isArray(window.mascotDatabase)) {
        return window.mascotDatabase;
    }
    return [{ id: 'm-bunny', name: 'Bunny', emoji: '🐰', svg: '<span class="text-2xl">🐰</span>' }];
}

function toggleCompanionPopover(e) {
    if (e) e.stopPropagation();
    const pop = document.getElementById('companion-popover');
    if (!pop) return;
    pop.classList.toggle('hidden');
    if (!pop.classList.contains('hidden')) {
        renderMascotGallery();
    }
}

function closeCompanionPopover() {
    const pop = document.getElementById('companion-popover');
    if (pop) pop.classList.add('hidden');
}

function renderMascotGallery() {
    const grid = document.getElementById('mascot-gallery-grid');
    if (!grid) return;
    const root = getRootProject(getActiveProject());
    const activeMascotId = root ? root.activeMascotId : null;
    const mascots = getAvailableMascots();

    grid.innerHTML = mascots.map(m => {
        const isSelected = activeMascotId === m.id;
        return `
            <button onclick="selectCompanion('${m.id}')" class="p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 text-center ${isSelected ? 'bg-indigo-50 border-brand-500 ring-2 ring-brand-400 shadow-sm' : 'bg-stone-50 border-stone-200 hover:bg-white'}">
                <div class="w-12 h-12 flex items-center justify-center pointer-events-none mascot-card-svg-wrapper">
                    ${m.svg || `<span class="text-2xl">${m.emoji || '🐾'}</span>`}
                </div>
                <span class="text-[10px] font-bold text-stone-700 truncate w-full px-1">${m.name}</span>
            </button>
        `;
    }).join('');
    safeCreateIcons();
}

function selectCompanion(id) {
    const root = getRootProject(getActiveProject());
    if (!root) return;
    root.activeMascotId = id;
    saveStateLocally();
    closeCompanionPopover();
    renderApp();
}

function removeCompanion() {
    const root = getRootProject(getActiveProject());
    if (!root) return;
    root.activeMascotId = null;
    saveStateLocally();
    closeCompanionPopover();
    renderApp();
}

function unlockAllMascotsTest() {
    alert("All studio companions are unlocked!");
}

function relockAllMascots() {
    alert("Companion progression reset.");
}

function renderActiveMascot() {
    const root = getRootProject(getActiveProject());
    const mascots = getAvailableMascots();
    const mascot = mascots.find(m => m.id === (root ? root.activeMascotId : null));
    const mainMount = document.getElementById('main-mascot-mount');
    const nameLabel = document.getElementById('compact-companion-name');
    const zenRoam = document.getElementById('mascot-roam-wrapper');
    const zenMount = document.getElementById('zen-mascot-mount');

    if (mascot) {
        if (mainMount) mainMount.innerHTML = mascot.svg || `<span class="text-base">${mascot.emoji || '🐾'}</span>`;
        if (nameLabel) nameLabel.textContent = mascot.name;
        if (zenRoam) zenRoam.classList.remove('hidden');
        if (zenMount) zenMount.innerHTML = mascot.svg || `<span class="text-5xl">${mascot.emoji || '🐾'}</span>`;
    } else {
        if (mainMount) mainMount.innerHTML = '🐾';
        if (nameLabel) nameLabel.textContent = 'Companion';
        if (zenRoam) zenRoam.classList.add('hidden');
    }
}

function triggerMascotAnim(anim) {
    const target = document.getElementById('mascot-anim-wrapper');
    if (!target) return;
    target.classList.remove('anim-hop', 'anim-squish', 'anim-frontflip');
    void target.offsetWidth;
    target.classList.add(`anim-${anim}`);
}

// Project Settings Modal & Popovers
function openProjectSettingsModal() {
    const root = getRootProject(getActiveProject()) || getActiveProject();
    if (!root) return;

    const tEl = document.getElementById('project-title-input');
    const gEl = document.getElementById('project-goal-input');
    const dEl = document.getElementById('project-deadline-input');
    const nEl = document.getElementById('project-notes-summary-input');
    const cumEl = document.getElementById('project-cumulative-timer');

    if (tEl) tEl.value = root.title || '';
    if (gEl) gEl.value = root.goal || '';
    if (dEl) dEl.value = root.deadline || '';
    if (nEl) nEl.value = root.notes || '';
    if (cumEl) cumEl.textContent = formatTimeCompact(getCumulativeTime(root.id));

    const modal = document.getElementById('project-settings-modal');
    if (modal) modal.classList.remove('hidden');
    safeCreateIcons();
}

function closeProjectSettingsModal() {
    const root = getRootProject(getActiveProject()) || getActiveProject();
    if (root) {
        const tEl = document.getElementById('project-title-input');
        const gEl = document.getElementById('project-goal-input');
        const dEl = document.getElementById('project-deadline-input');
        const nEl = document.getElementById('project-notes-summary-input');
        if (tEl && tEl.value.trim()) root.title = tEl.value.trim();
        if (gEl) root.goal = gEl.value.trim();
        if (dEl) root.deadline = dEl.value;
        if (nEl) root.notes = nEl.value;
        saveStateLocally();
    }
    const modal = document.getElementById('project-settings-modal');
    if (modal) modal.classList.add('hidden');
    renderApp();
}

function toggleWorkspacePopover(e) {
    if (e) e.stopPropagation();
    const pop = document.getElementById('workspace-popover');
    if (pop) pop.classList.toggle('hidden');
    safeCreateIcons();
}

function closeWorkspacePopover() {
    const pop = document.getElementById('workspace-popover');
    if (pop) pop.classList.add('hidden');
}

function toggleBloomPopover() {
    const pop = document.getElementById('bloom-popover');
    if (pop) pop.classList.toggle('hidden');
}

function updateBloomOpacity(val) {
    appState.bloomOpacity = parseInt(val, 10);
    document.documentElement.style.setProperty('--bloom-opacity', (val / 100).toString());
    const lbl = document.getElementById('bloom-val-label');
    if (lbl) lbl.textContent = val + '%';
    saveStateLocally();
}

function toggleAudioPopover() {
    const pop = document.getElementById('audio-popover');
    if (pop) pop.classList.toggle('hidden');
}

function toggleInstructionsModal() {
    const m = document.getElementById('instructions-modal');
    if (m) m.classList.toggle('hidden');
}

function toggleProjectNotesModal() {
    const m = document.getElementById('project-notes-modal');
    if (!m) return;
    m.classList.toggle('hidden');
    if (!m.classList.contains('hidden')) {
        const root = getRootProject(getActiveProject()) || getActiveProject();
        const ta = document.getElementById('project-full-notes-textarea');
        if (ta && root) ta.value = root.notes || '';
    }
}

function saveFullProjectNotes() {
    const root = getRootProject(getActiveProject()) || getActiveProject();
    const ta = document.getElementById('project-full-notes-textarea');
    if (root && ta) {
        root.notes = ta.value;
        saveStateLocally();
    }
    toggleProjectNotesModal();
}

// Sprint Cycle Helpers
function getSprintCycleInfo() {
    const start = appState.sprintStartDate ? new Date(appState.sprintStartDate) : new Date();
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const elapsedDays = Math.max(1, Math.floor(diffMs / 86400000) + 1);
    const totalDays = appState.sprintCycleDays || 30;
    const remainingDays = Math.max(0, totalDays - elapsedDays);
    const progressPct = Math.min(100, Math.round((elapsedDays / totalDays) * 100));
    return { elapsedDays, totalDays, remainingDays, progressPct };
}

function updateSprintCycleUI() {
    const info = getSprintCycleInfo();
    const lbl = document.getElementById('sprint-cycle-label');
    const rem = document.getElementById('sprint-days-remaining');
    const bar = document.getElementById('sprint-cycle-bar');
    if (lbl) lbl.textContent = `Cycle: Day ${info.elapsedDays} of ${info.totalDays}`;
    if (rem) rem.textContent = `${info.remainingDays}d left`;
    if (bar) bar.style.width = `${info.progressPct}%`;
}

function openSprintReviewModal() {
    const info = getSprintCycleInfo();
    const badge = document.getElementById('sprint-modal-status-badge');
    if (badge) badge.textContent = `Day ${info.elapsedDays} / ${info.totalDays} • ${info.remainingDays}d left`;
    const modal = document.getElementById('sprint-review-modal');
    if (modal) modal.classList.remove('hidden');
    safeCreateIcons();
}

function closeSprintReviewModal() {
    const modal = document.getElementById('sprint-review-modal');
    if (modal) modal.classList.add('hidden');
}

function confirmSprintReset() {
    appState.sprintStartDate = new Date().toISOString();
    saveStateLocally();
    closeSprintReviewModal();
    updateSprintCycleUI();
    confetti({ particleCount: 60, spread: 55 });
}

// Zen View Controller
function openZenView() {
    const overlay = document.getElementById('zen-overlay');
    if (!overlay) return;
    overlay.classList.remove('hidden');
    activeSessionMode = 'zen';
    applyBackdropStyles();
    renderTimerVisuals();
    safeCreateIcons();
}

function closeZenView() {
    const overlay = document.getElementById('zen-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    activeSessionMode = 'focus';
    renderApp();
}

function toggleBackdropModal() {
    const modal = document.getElementById('backdrop-modal');
    if (modal) modal.classList.toggle('hidden');
}

function onCustomColorChange() {
    appState.pickerPrimary = document.getElementById('picker-primary')?.value || '#090d16';
    appState.pickerSecondary = document.getElementById('picker-secondary')?.value || '#1e1b4b';
    appState.pickerTertiary = document.getElementById('picker-tertiary')?.value || '#4338ca';
    appState.selectPattern = document.getElementById('select-pattern')?.value || 'radial-center';
    applyBackdropStyles();
    saveStateLocally();
}

function applyBackdropStyles() {
    const overlay = document.getElementById('zen-overlay');
    if (!overlay) return;
    const p = appState.pickerPrimary || '#090d16';
    const s = appState.pickerSecondary || '#1e1b4b';
    const t = appState.pickerTertiary || '#4338ca';
    const pattern = appState.selectPattern || 'radial-center';

    if (pattern === 'solid') overlay.style.background = p;
    else if (pattern === 'linear-vert') overlay.style.background = `linear-gradient(to bottom, ${p}, ${s})`;
    else if (pattern === 'linear-diag') overlay.style.background = `linear-gradient(135deg, ${p}, ${s}, ${t})`;
    else if (pattern === 'spotlight') overlay.style.background = `radial-gradient(circle at 10% 10%, ${t} 0%, ${s} 40%, ${p} 90%)`;
    else if (pattern === 'mesh') overlay.style.background = `radial-gradient(at 0% 0%, ${t} 0px, transparent 50%), radial-gradient(at 100% 100%, ${s} 0px, transparent 50%), ${p}`;
    else overlay.style.background = `radial-gradient(circle at center, ${s} 0%, ${p} 100%)`;
}

// Global Theme Controller
const AVAILABLE_THEMES = [
    { id: 'light', name: 'Warm Studio (Light)', desc: 'Alabaster Workbench & Sage', dot: '#f8f6f1', border: '#d6d1c7' },
    { id: 'dark', name: 'Midnight Studio', desc: 'Deep Obsidian & Indigo', dot: '#090d16', border: '#6366f1' },
    { id: 'earth', name: 'Forest Moss', desc: 'Grounded Sage & Pine', dot: '#101511', border: '#34d399' },
    { id: 'fire', name: 'Warm Ember', desc: 'Terracotta & Hearth', dot: '#140d0a', border: '#f97316' }
];

function setAppTheme(themeId) {
    if (!AVAILABLE_THEMES.some(t => t.id === themeId)) themeId = 'light';
    appState.theme = themeId;
    document.documentElement.setAttribute('data-theme', themeId);
    saveStateLocally();
    renderThemeUI();
    closeThemePopover();
}

function toggleThemePopover(e) {
    if (e) e.stopPropagation();
    const popover = document.getElementById('theme-popover');
    if (!popover) return;
    if (popover.classList.contains('hidden')) {
        renderThemeUI();
        popover.classList.remove('hidden');
    } else {
        popover.classList.add('hidden');
    }
}

function closeThemePopover() {
    const popover = document.getElementById('theme-popover');
    if (popover) popover.classList.add('hidden');
}

function renderThemeUI() {
    const container = document.getElementById('theme-options-container');
    if (!container) return;
    const currentTheme = appState.theme || 'light';

    container.innerHTML = AVAILABLE_THEMES.map(t => {
        const isActive = t.id === currentTheme;
        return `
            <button onclick="setAppTheme('${t.id}')" class="w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${isActive ? 'ring-2 ring-brand-500 border-transparent bg-brand-50/40 font-bold' : 'border-stone-200 hover:bg-stone-100/60'}">
                <div class="flex items-center gap-2.5">
                    <span class="w-5 h-5 rounded-full border shadow-2xs shrink-0" style="background-color: ${t.dot}; border-color: ${t.border};"></span>
                    <div>
                        <div class="text-xs font-bold leading-tight">${t.name}</div>
                        <div class="text-[10px] text-stone-400 font-normal">${t.desc}</div>
                    </div>
                </div>
                ${isActive ? '<i data-lucide="check" class="w-4 h-4 text-brand-600 shrink-0"></i>' : ''}
            </button>
        `;
    }).join('');
    safeCreateIcons();
}

document.addEventListener('click', (e) => {
    const themePop = document.getElementById('theme-popover');
    const themeTrig = e.target.closest('[onclick*="toggleThemePopover"]');
    if (themePop && !themePop.classList.contains('hidden') && !themePop.contains(e.target) && !themeTrig) {
        closeThemePopover();
    }
    const wsPop = document.getElementById('workspace-popover');
    const wsTrig = e.target.closest('[onclick*="toggleWorkspacePopover"]');
    if (wsPop && !wsPop.classList.contains('hidden') && !wsPop.contains(e.target) && !wsTrig) {
        closeWorkspacePopover();
    }
});

// ============================================================================
// 11. MASTER RENDER LOOP & INITIALIZATION
// ============================================================================

function renderApp() {
    enforceProjectSlotLimits();
    renderStudioGPS();
    renderTasks();
    renderMicroSteps(getActiveTask());
    renderTimerVisuals();
    renderActiveMascot();
    safeCreateIcons();
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = appState.theme || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateBloomOpacity(appState.bloomOpacity || 60);

    const volSlider = document.getElementById('volume-slider');
    if (volSlider) volSlider.value = appState.audioVolume || 80;
    const volLabel = document.getElementById('volume-label');
    if (volLabel) volLabel.textContent = (appState.audioVolume || 80) + '%';
    const famSelect = document.getElementById('audio-family-select');
    if (famSelect) famSelect.value = appState.audioFamily || 'woodblock';

    const taskNotes = document.getElementById('active-task-notes');
    if (taskNotes) {
        taskNotes.addEventListener('input', (e) => {
            const t = getActiveTask();
            if (t) {
                t.notes = e.target.value;
                saveStateLocally();
            }
        });
    }

    const taskDeadline = document.getElementById('active-task-deadline');
    if (taskDeadline) {
        taskDeadline.addEventListener('change', (e) => {
            const t = getActiveTask();
            if (t) {
                t.deadline = e.target.value;
                saveStateLocally();
            }
        });
    }

    const newTaskInput = document.getElementById('new-task-title-input');
    if (newTaskInput) {
        newTaskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleAddTask();
        });
    }

    const scratchInput = document.getElementById('scratchpad-input');
    if (scratchInput) {
        scratchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitScratchpadItem();
        });
    }

    const customMicroInput = document.getElementById('custom-microstep-input');
    if (customMicroInput) {
        customMicroInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') addCustomMicroStep();
        });
    }

    // Hard-reload timer delta recovery
    if (appState.activeTimerSession) {
        const sess = appState.activeTimerSession;
        const proj = (appState.projects || []).find(p => p.id === sess.projectId);
        if (proj) {
            const task = (proj.tasks || []).find(t => t.id === sess.taskId);
            if (task && !task.isCompleted) {
                const deltaSec = Math.floor((Date.now() - sess.startedTimestamp) / 1000);
                task.actualTime = sess.taskBaseActualTime + deltaSec;
                proj.totalTimeSpent = (proj.totalTimeSpent || 0) + deltaSec;
                appState.activeProjectId = proj.id;
                proj.activeTaskId = task.id;
            }
        }
        appState.activeTimerSession = null;
        saveStateLocally();
    }

    enterOperatorMode();
});
