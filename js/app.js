// --- Core Workspace & Interaction Coordinator ---
let isPlaying = false, timerInterval = null, tickCounter = 0, currentView = 'focus';
let jitterAudioTimer = null, jitterMascotTimer = null;
let activeSessionStart = null, activeSessionMode = 'focus';
let visibilityTimeout = null;

// Tab visibility guard against runaway background sessions. Pauses after 15 minutes of user AFK.
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isPlaying) {
        visibilityTimeout = setTimeout(() => {
            if (isPlaying) {
                forcePause();
                console.info("Timer automatically paused to prevent runaway session telemetry.");
            }
        }, 15 * 60 * 1000); // 15 mins
    } else {
        if (visibilityTimeout) clearTimeout(visibilityTimeout);
    }
});

function getActiveProject() { return (appState.projects || []).find(p => p.id === appState.activeProjectId) || (appState.projects || [])[0]; }
function getRootProject(proj) {
    let curr = proj;
    while (curr && curr.parentId) {
        const parent = (appState.projects || []).find(p => p.id === curr.parentId);
        if (!parent) break;
        curr = parent;
    }
    return curr;
}
function getActiveTask() { const p = getActiveProject(); return p ? (p.tasks || []).find(t => t.id === p.activeTaskId) : null; }
function hasSubProjects(projectId) { return (appState.projects || []).some(p => p.parentId === projectId); }
function getProjectDepth(projectId) {
    let depth = 0; let curr = (appState.projects || []).find(p => p.id === projectId);
    while (curr && curr.parentId) { depth++; curr = (appState.projects || []).find(p => p.id === curr.parentId); }
    return depth;
}
function getCumulativeTime(projectId) {
    const p = (appState.projects || []).find(x => x.id === projectId);
    if (!p) return 0;
    let total = p.totalTimeSpent || 0;
    (appState.projects || []).filter(sp => sp.parentId === projectId).forEach(sp => { total += getCumulativeTime(sp.id); });
    return total;
}

// ... [Sprint/Cycle UI functions kept identical to original] ...
function getSprintCycleInfo() {
    const start = appState.sprintStartDate ? new Date(appState.sprintStartDate) : new Date();
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const elapsedDays = Math.max(1, Math.floor(diffMs / 86400000) + 1);
    const totalDays = appState.sprintCycleDays || 30;
    const remainingDays = Math.max(0, totalDays - elapsedDays);
    const progressPct = Math.min(100, Math.round((elapsedDays / totalDays) * 100));
    const isCompleted = elapsedDays >= totalDays;
    return { elapsedDays, totalDays, remainingDays, progressPct, isCompleted };
}

function openSprintReviewModal() {
    const info = getSprintCycleInfo();
    const badge = document.getElementById('sprint-modal-status-badge');
    if (badge) {
        badge.textContent = `Day ${info.elapsedDays} / ${info.totalDays} • ${info.remainingDays}d runway left`;
        badge.className = info.isCompleted ? "px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold" : "px-2 py-0.5 rounded-full text-[10px] bg-brand-100 text-brand-700 font-bold";
    }
    const modal = document.getElementById('sprint-review-modal');
    if (modal) modal.classList.remove('hidden');
    safeCreateIcons();
}
function closeSprintReviewModal() { const modal = document.getElementById('sprint-review-modal'); if (modal) modal.classList.add('hidden'); }
function confirmSprintReset() { appState.sprintStartDate = new Date().toISOString(); saveStateLocally(); closeSprintReviewModal(); renderApp(); confetti({ particleCount: 60, spread: 55 }); }

// ... [Drawer Toggles kept identical] ...
function toggleSaveStateDrawer() { appState.saveStateDrawerOpen = !appState.saveStateDrawerOpen; const drawer = document.getElementById('save-state-drawer'); const chevron = document.getElementById('save-state-chevron'); if (drawer) drawer.classList.toggle('hidden', !appState.saveStateDrawerOpen); if (chevron) chevron.style.transform = appState.saveStateDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)'; saveStateLocally(); }
function toggleParkingLotDrawer() { appState.parkingLotOpen = !appState.parkingLotOpen; saveStateLocally(); renderSidebar(); }
function toggleCompletedTasksDrawer() { appState.completedTasksDrawerOpen = !appState.completedTasksDrawerOpen; const container = document.getElementById('completed-tasks-container'); const chevron = document.getElementById('completed-tasks-chevron'); if (container) container.classList.toggle('hidden', !appState.completedTasksDrawerOpen); if (chevron) chevron.style.transform = appState.completedTasksDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)'; saveStateLocally(); }
function toggleMobileSidebar() { const sidebar = document.getElementById('sidebar-drawer'); const backdrop = document.getElementById('sidebar-backdrop'); if (!sidebar || !backdrop) return; const isClosed = sidebar.classList.contains('-translate-x-full'); if (isClosed) { sidebar.classList.remove('-translate-x-full'); backdrop.classList.remove('hidden'); } else { sidebar.classList.add('-translate-x-full'); backdrop.classList.add('hidden'); } }
function closeMobileSidebar() { const sidebar = document.getElementById('sidebar-drawer'); const backdrop = document.getElementById('sidebar-backdrop'); if (sidebar) sidebar.classList.add('-translate-x-full'); if (backdrop) backdrop.classList.add('hidden'); }

// ... [Project Management Architecture kept identical] ...
function getActiveRootProjects() { return (appState.projects || []).filter(p => !p.parentId && !p.isParked); }
function getParkedRootProjects() { return (appState.projects || []).filter(p => !p.parentId && p.isParked); }

function createNewProject(parentId = null) {
    syncHeaderInputsToState();
    let makeParked = false;
    let tasksToMigrate = [];

    if (!parentId) {
        const activeRoots = getActiveRootProjects();
        if (activeRoots.length >= 4) {
            if (!confirm(`Your Active Sprint already contains 4 projects.\n\nTo preserve focus, this new project will be created directly into the Parking Lot.\n\nContinue?`)) return;
            makeParked = true;
        }
    } else {
        const depth = getProjectDepth(parentId);
        if (depth >= 2) { alert("Maximum 3-tier hierarchy reached (Main Project -> Sub-Project -> Component Project)."); return; }
        const parent = (appState.projects || []).find(p => p.id === parentId);
        if (parent && parent.tasks && parent.tasks.length > 0) {
            if (!confirm(`"${parent.title}" currently has ${parent.tasks.length} task(s).\n\nTasks can only exist at the lowest leaf level.\n\nWould you like to automatically move all ${parent.tasks.length} task(s) into your new sub-project so nothing is lost?`)) return;
            tasksToMigrate = [...parent.tasks];
            parent.tasks = [];
            parent.activeTaskId = null;
        }
    }

    const id = 'proj-' + generateId();
    const parentDepth = parentId ? getProjectDepth(parentId) : -1;
    const projectTitle = parentDepth === 0 ? 'New Sub-Project' : (parentDepth === 1 ? 'New Component Project' : 'New Root Project');

    const newProject = {
        id, parentId: parentId, title: projectTitle, goal: '', deadline: '', notes: '',
        isParked: makeParked, totalTimeSpent: 0, activeTaskId: tasksToMigrate.length > 0 ? tasksToMigrate[0].id : null, activeMascotId: null, unlockAllMascotsTest: false,
        createdAt: new Date().toISOString(), completedAt: null, tasks: tasksToMigrate
    };
    appState.projects.push(newProject);
    appState.activeProjectId = id;
    saveStateLocally(); renderApp(); closeMobileSidebar();
}

function toggleParkProject(projectId, e) {
    if (e) e.stopPropagation();
    const p = (appState.projects || []).find(x => x.id === projectId);
    if (!p) return;
    if (p.isParked) {
        if (getActiveRootProjects().length >= 4) { alert(`Active sprint is full (4/4 projects).\n\nPlease park one of your 4 active projects before activating "${p.title}".`); return; }
        p.isParked = false; appState.activeProjectId = p.id;
    } else {
        p.isParked = true;
        const remainingActive = getActiveRootProjects();
        if (appState.activeProjectId === p.id) appState.activeProjectId = remainingActive.length > 0 ? remainingActive[0].id : null;
    }
    saveStateLocally(); renderApp();
}

function toggleProjectCollapse(projectId, e) { if (e) e.stopPropagation(); appState.collapsedProjects = appState.collapsedProjects || {}; appState.collapsedProjects[projectId] = !appState.collapsedProjects[projectId]; saveStateLocally(); renderSidebar(); }

function deleteProject(projectId, e) {
    if (e) e.stopPropagation();
    const proj = (appState.projects || []).find(p => p.id === projectId);
    if (!proj) return;
    if (confirm(`Are you sure you want to delete "${proj.title}" and all its contents?`)) {
        const toDelete = new Set();
        function collectIds(id) { toDelete.add(id); (appState.projects || []).filter(p => p.parentId === id).forEach(sp => collectIds(sp.id)); }
        collectIds(projectId);

        (appState.sessionLogs || []).forEach(l => {
            if (toDelete.has(l.projectId) && !l.projectTitle) {
                const target = (appState.projects || []).find(x => x.id === l.projectId);
                if (target) l.projectTitle = target.title;
            }
        });
        appState.projects = (appState.projects || []).filter(p => !toDelete.has(p.id));
        if (appState.projects.length === 0) loadDefaultData();
        else if (toDelete.has(appState.activeProjectId)) {
            const activeRoots = getActiveRootProjects();
            appState.activeProjectId = activeRoots.length > 0 ? activeRoots[0].id : appState.projects[0].id;
        }
        saveStateLocally(); renderApp();
    }
}

// Operational Clock & Time-Blindness Sweep
function toggleTimer() {
    const task = getActiveTask(); 
    if (!task || task.isCompleted) return;

    if (isPlaying) { openParkModal(); return; }

    isPlaying = true;
    activeSessionStart = new Date();
    if (!task.startedAt) task.startedAt = new Date().toISOString();
    renderTimerVisuals();
    playSound('start');
    timerInterval = setInterval(timerTick, 1000);
    scheduleNextAudioJitter();
}

function timerTick() {
    const p = getActiveProject(), t = getActiveTask();
    if (!t || t.isCompleted) { if (isPlaying) forcePause(); return; }
    t.actualTime += 1; p.totalTimeSpent += 1;
    tickCounter++;
    if (tickCounter >= 5) { saveStateLocally(); tickCounter = 0; }
    updateTimerTexts(p, t);
}

function forcePause() {
    if (!isPlaying) return;
    isPlaying = false;
    clearInterval(timerInterval);
    if (jitterAudioTimer) clearTimeout(jitterAudioTimer);

    if (activeSessionStart) {
        // Enforce 4 hour max hard-cap per session to prevent DB inflation
        const durationSec = Math.round((Date.now() - activeSessionStart.getTime()) / 1000);
        const cappedDuration = Math.min(durationSec, 14400); 
        logSessionTelemetry(getActiveTask()?.id, getActiveProject()?.id, cappedDuration, false);
        activeSessionStart = null;
    }

    renderTimerVisuals(); saveStateLocally();
}

function logSessionTelemetry(taskId, projectId, durationSec, completed = false) {
    if (!durationSec || durationSec < 4) return;
    const taskObj = (appState.projects || []).flatMap(p => p.tasks || []).find(x => x.id === taskId);
    const projObj = (appState.projects || []).find(x => x.id === projectId);
    appState.sessionLogs = appState.sessionLogs || [];
    appState.sessionLogs.push({
        id: 'sess-' + generateId(), taskId: taskId, taskTitle: taskObj ? taskObj.title : 'Focus Session', projectId: projectId, projectTitle: projObj ? projObj.title : 'General Project',
        startedAt: new Date(Date.now() - durationSec * 1000).toISOString(), endedAt: new Date().toISOString(), durationSeconds: durationSec, mode: activeSessionMode || 'focus', completedTask: completed
    });
    saveStateLocally();
}

function completeActiveTask() {
    const t = getActiveTask(), p = getActiveProject();
    if (!t || t.isCompleted) return;
    if (isPlaying) forcePause();
    t.isCompleted = true; t.completionDate = new Date().toISOString();
    playSound('complete'); confetti({ particleCount: 80, spread: 60 });
    logSessionTelemetry(t.id, p.id, t.actualTime, true);
    saveStateLocally();
    setTimeout(() => { p.activeTaskId = (p.tasks.find(x => !x.isCompleted) || {}).id || null; saveStateLocally(); renderApp(); }, 1000);
    renderApp();
}

function updateTimerTexts(p, task) {
    document.getElementById('active-timer-display').textContent = formatTimeCompact(task.actualTime);
    document.getElementById('project-cumulative-timer').textContent = formatTimeCompact(getCumulativeTime(p.id));
    document.getElementById('active-timer-estimate').textContent = task.estimatedTime > 0 ? `Target: ${Math.round(task.estimatedTime/60)}m` : 'Open ended';

    const zenDisplay = document.getElementById('zen-timer-display'); 
    if (zenDisplay) zenDisplay.textContent = formatTimeCompact(task.actualTime);

    const c = 930;
    const target = task.estimatedTime > 0 ? task.estimatedTime : 1800; // Open ended defaults ring to 30m
    const arc = document.getElementById('radial-progress-arc');
    const halo = document.getElementById('radial-overtime-halo');
    const stateText = document.getElementById('timer-state-text');
    const timerBtn = document.getElementById('main-timer-btn');
    const zenBtn = document.getElementById('zen-timer-btn');

    if (arc) {
        const progress = Math.min(task.actualTime / target, 1.0);
        arc.style.strokeDashoffset = (c * (1 - progress)).toString();
        if (task.actualTime <= target || task.estimatedTime === 0) {
            arc.style.stroke = isPlaying ? '#10b981' : '#f43f5e';
            if (halo) halo.classList.add('opacity-0');
            if (stateText) stateText.textContent = isPlaying ? 'Active' : 'Paused';
            if (timerBtn) { timerBtn.classList.remove('timer-amber-container'); timerBtn.classList.toggle('timer-green-container', isPlaying); timerBtn.classList.toggle('timer-red-container', !isPlaying); }
            if (zenBtn) { zenBtn.classList.remove('timer-amber-container'); zenBtn.classList.toggle('timer-green-container', isPlaying); zenBtn.classList.toggle('timer-red-container', !isPlaying); }
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
            if (stateText) stateText.textContent = `Flow Zone (+${formatTimeCompact(overtime)})`;
            if (timerBtn) { timerBtn.classList.remove('timer-green-container', 'timer-red-container'); timerBtn.classList.add('timer-amber-container'); }
            if (zenBtn) { zenBtn.classList.remove('timer-green-container', 'timer-red-container'); zenBtn.classList.add('timer-amber-container'); }
        }
    }
}

// ... [Park/Resume and Micro-steps identical to original, abbreviated for space] ...
function openParkModal() { const modal = document.getElementById('park-resume-modal'); if (!modal) { forcePause(); return; } document.getElementById('park-stopped-input').value = ''; document.getElementById('park-next60s-input').value = ''; modal.classList.remove('hidden'); document.getElementById('park-stopped-input').focus(); }
function dismissParkModal() { document.getElementById('park-resume-modal').classList.add('hidden'); forcePause(); }
function confirmParkAndPause() { const task = getActiveTask(); if (task) { task.lastParkedContext = { whereStopped: document.getElementById('park-stopped-input').value.trim() || 'Mid-flow work', next60sAction: document.getElementById('park-next60s-input').value.trim() || 'Resume central focus', parkedAt: new Date().toISOString() }; task.pausedAt = new Date().toISOString(); } document.getElementById('park-resume-modal').classList.add('hidden'); forcePause(); renderApp(); }
function executeLaunchpadResume() { const task = getActiveTask(); if (task) { task.lastParkedContext = null; saveStateLocally(); } renderApp(); if (!isPlaying) toggleTimer(); }
function dismissLaunchpad() { const task = getActiveTask(); if (task) { task.lastParkedContext = null; saveStateLocally(); } renderApp(); }

// ... [Micro-step controls identical, abbreviated] ...
function renderMicroSteps(task) { const list = document.getElementById('active-task-microsteps-list'); const summary = document.getElementById('microstep-summary'); if (!list || !summary) return; if (!task) { list.innerHTML = `<p class="text-[11px] text-slate-400 italic">Select a task to decompose.</p>`; summary.textContent = '0/0 done'; return; } task.microSteps = task.microSteps || []; const completed = task.microSteps.filter(s => s.isCompleted).length; summary.textContent = `${completed}/${task.microSteps.length} done`; list.innerHTML = task.microSteps.map(s => `<div class="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 text-xs"><label class="flex items-center gap-2 cursor-pointer flex-1 min-w-0"><input type="checkbox" ${s.isCompleted ? 'checked' : ''} onchange="toggleMicroStep('${s.id}')" class="rounded text-brand-600 focus:ring-0"><span class="${s.isCompleted ? 'line-through text-slate-400' : 'text-slate-700 font-medium'} truncate">${s.title}</span></label><button onclick="deleteMicroStep('${s.id}')" class="text-slate-300 hover:text-rose-500 p-1"><i data-lucide="x" class="w-3.5 h-3.5"></i></button></div>`).join(''); safeCreateIcons(); }
function addPresetMicroStep(title, mins) { const task = getActiveTask(); if (!task) return; task.microSteps = task.microSteps || []; task.microSteps.push({ id: 'ms-' + generateId(), title: `${title} (${mins}m)`, isCompleted: false }); saveStateLocally(); renderMicroSteps(task); }
function addCustomMicroStep() { const input = document.getElementById('custom-microstep-input'); const val = input.value.trim(); const task = getActiveTask(); if (!val || !task) return; task.microSteps = task.microSteps || []; task.microSteps.push({ id: 'ms-' + generateId(), title: val, isCompleted: false }); input.value = ''; saveStateLocally(); renderMicroSteps(task); }
function toggleMicroStep(stepId) { const task = getActiveTask(); if (!task) return; const s = (task.microSteps || []).find(x => x.id === stepId); if (s) { s.isCompleted = !s.isCompleted; if (s.isCompleted) { playSound('complete'); confetti({ particleCount: 40, spread: 45 }); } saveStateLocally(); renderMicroSteps(task); } }
function deleteMicroStep(stepId) { const task = getActiveTask(); if (!task) return; task.microSteps = (task.microSteps || []).filter(x => x.id !== stepId); saveStateLocally(); renderMicroSteps(task); }

// ... [Scratchpad identical, abbreviated] ...
function toggleScratchpadModal() { const modal = document.getElementById('scratchpad-modal'); modal.classList.toggle('hidden'); if (!modal.classList.contains('hidden')) { renderScratchpadList(); document.getElementById('scratchpad-input').focus(); } }
function submitScratchpadItem() { const input = document.getElementById('scratchpad-input'); const text = input.value.trim(); if (!text) return; appState.scratchpad = appState.scratchpad || []; appState.scratchpad.unshift({ id: 'sp-' + generateId(), text: text, createdAt: new Date().toISOString(), relatedTaskId: getActiveTask()?.id || null }); input.value = ''; saveStateLocally(); renderScratchpadList(); }
function renderScratchpadList() { const container = document.getElementById('scratchpad-items-list'); if (!container) return; const items = appState.scratchpad || []; if (items.length === 0) { container.innerHTML = `<p class="text-xs text-slate-400 py-3 text-center italic">No thoughts captured yet.</p>`; return; } container.innerHTML = items.map(item => `<div class="flex items-center justify-between py-2 text-xs"><span class="text-slate-700 flex-1 truncate pr-2">${item.text}</span><div class="flex items-center gap-1 shrink-0"><button onclick="convertScratchpadToTask('${item.id}')" class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-brand-600 rounded text-[10px] font-bold">To Task</button><button onclick="deleteScratchpadItem('${item.id}')" class="text-slate-400 hover:text-rose-500 p-1"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button></div></div>`).join(''); safeCreateIcons(); }
function convertScratchpadToTask(itemId) { const item = (appState.scratchpad || []).find(x => x.id === itemId); const p = getActiveProject(); if (!item || !p) return; if (hasSubProjects(p.id)) { alert("Select a leaf sub-project first."); return; } const newTask = { id: 't-' + generateId(), title: item.text, estimatedTime: 15 * 60, actualTime: 0, isCompleted: false, deadline: '', notes: 'Created from scratchpad', createdAt: new Date().toISOString(), microSteps: [], lastParkedContext: null }; p.tasks.push(newTask); if (!p.activeTaskId) p.activeTaskId = newTask.id; deleteScratchpadItem(itemId); renderApp(); }
function deleteScratchpadItem(itemId) { appState.scratchpad = (appState.scratchpad || []).filter(x => x.id !== itemId); saveStateLocally(); renderScratchpadList(); }
window.addEventListener('keydown', (e) => { if (e.altKey && (e.key === 's' || e.key === 'S')) { e.preventDefault(); toggleScratchpadModal(); } });

// ... [Zen Mode & Routing identical to original, rendering loops identical] ...
// Excluded repetitive lines for clarity, insert original zen controls, mascot rig logic, and view routers here.

// ---------------------------------------------
// handleAddTask: Properly supporting 0 values for Open Ended tasks
// ---------------------------------------------
function handleAddTask() {
    const inTitle = document.getElementById('new-task-title-input');
    const inEst = document.getElementById('new-task-est-input');
    const title = inTitle.value.trim();
    
    // Blank values map to 0 (open-ended flow)
    const estMins = inEst.value === '' ? 0 : parseInt(inEst.value);
    const p = getActiveProject();
    
    if (hasSubProjects(p.id)) { alert("Tasks only exist at the lowest project level."); return; }
    if (!title) return;
    if (isNaN(estMins) || estMins < 0) { alert("Invalid Target Time! Leave empty or use 0 for Open Ended."); inEst.focus(); return; }

    p.tasks.push({
        id: 't-' + generateId(),
        title: title,
        estimatedTime: estMins * 60, // Maps to 0 if left blank
        actualTime: 0,
        isCompleted: false,
        deadline: '',
        notes: '',
        createdAt: new Date().toISOString(),
        microSteps: [],
        lastParkedContext: null
    });
    if (!p.activeTaskId) p.activeTaskId = p.tasks[p.tasks.length - 1].id;
    inTitle.value = ''; inEst.value = '';
    saveStateLocally();
    renderApp();
}

// ... [Init listeners] ...
// Boilerplate DOM bindings (Settings setup and input event bindings remain identical)
// ...
