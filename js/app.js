// --- Core Application Logic & Workspace Coordination ---
let isPlaying = false, timerInterval = null, tickCounter = 0, currentView = 'focus';
let jitterAudioTimer = null, jitterMascotTimer = null;
let activeSessionStart = null, activeSessionMode = 'focus';

function getActiveProject() { return appState.projects.find(p => p.id === appState.activeProjectId) || appState.projects[0]; }

function getRootProject(proj) {
    let curr = proj;
    while (curr && curr.parentId) {
        const parent = appState.projects.find(p => p.id === curr.parentId);
        if (!parent) break;
        curr = parent;
    }
    return curr;
}

function getActiveTask() { 
    const p = getActiveProject(); 
    return p ? p.tasks.find(t => t.id === p.activeTaskId) : null; 
}

function generateId() { return Math.random().toString(36).substr(2, 9); }
function hasSubProjects(projectId) { return appState.projects.some(p => p.parentId === projectId); }

function getProjectDepth(projectId) {
    let depth = 0;
    let curr = appState.projects.find(p => p.id === projectId);
    while (curr && curr.parentId) {
        depth++;
        curr = appState.projects.find(p => p.id === curr.parentId);
    }
    return depth;
}

function getCumulativeTime(projectId) {
    const p = appState.projects.find(x => x.id === projectId);
    if (!p) return 0;
    let total = p.totalTimeSpent || 0;
    appState.projects.filter(sp => sp.parentId === projectId).forEach(sp => { total += getCumulativeTime(sp.id); });
    return total;
}

function formatTimeCompact(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds === null) totalSeconds = 0;
    const h = Math.floor(totalSeconds / 3600), m = Math.floor((totalSeconds % 3600) / 60), s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatTimeHuman(totalSeconds) {
    if(!totalSeconds || totalSeconds === 0) return '0m';
    const h = Math.floor(totalSeconds / 3600), m = Math.floor((totalSeconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatTimeFull(totalSeconds) {
    if(!totalSeconds || totalSeconds === 0) return '0m';
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    let parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || parts.length === 0) parts.push(`${m}m`);
    return parts.join(' ');
}

function getLocalFormattedDate(d) {
    const target = d || new Date();
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function safeCreateIcons() { try { lucide.createIcons(); } catch(e) {} }

function syncHeaderInputsToState() {
    const p = getActiveProject();
    if (!p) return;
    const tEl = document.getElementById('project-title-input');
    const gEl = document.getElementById('project-goal-input');
    const dEl = document.getElementById('project-deadline-input');
    const nEl = document.getElementById('project-notes-summary-input');
    if (tEl && tEl.value !== undefined) p.title = tEl.value;
    if (gEl && gEl.value !== undefined) p.goal = gEl.value;
    if (dEl && dEl.value !== undefined) p.deadline = dEl.value;
    if (nEl && nEl.value !== undefined) p.notes = nEl.value;
}

// 3-Tier Hierarchy Management
function createNewProject(parentId = null) {
    syncHeaderInputsToState();
    if (parentId) {
        const depth = getProjectDepth(parentId);
        if (depth >= 2) {
            alert("Maximum 3-tier depth reached (Main Project -> Sub-Project -> Component Project).");
            return;
        }
        const parent = appState.projects.find(p => p.id === parentId);
        if (parent && parent.tasks && parent.tasks.length > 0) {
            alert("Remove existing tasks before creating a sub-project. Tasks can only exist at the lowest leaf level.");
            return;
        }
    }

    const id = 'proj-' + generateId();
    const parentDepth = parentId ? getProjectDepth(parentId) : -1;
    const projectTitle = parentDepth === 0 ? 'New Sub-Project' : (parentDepth === 1 ? 'New Component Project' : 'New Root Project');

    appState.projects.push({
        id, parentId: parentId, title: projectTitle, goal: '', deadline: '', notes: '',
        totalTimeSpent: 0, activeTaskId: null, activeMascotId: null, unlockAllMascotsTest: false,
        createdAt: new Date().toISOString(), completedAt: null, tasks: []
    });
    appState.activeProjectId = id;
    saveStateLocally();
    renderApp();
}

function toggleProjectCollapse(projectId, e) {
    if (e) e.stopPropagation();
    appState.collapsedProjects = appState.collapsedProjects || {};
    appState.collapsedProjects[projectId] = !appState.collapsedProjects[projectId];
    saveStateLocally();
    renderSidebar();
}

function deleteProject(projectId, e) {
    if (e) e.stopPropagation();
    const proj = appState.projects.find(p => p.id === projectId);
    if (!proj) return;

    if (confirm(`Are you sure you want to delete "${proj.title}" and all its contents?`)) {
        const toDelete = new Set();
        function collectIds(id) {
            toDelete.add(id);
            appState.projects.filter(p => p.parentId === id).forEach(sp => collectIds(sp.id));
        }
        collectIds(projectId);
        appState.projects = appState.projects.filter(p => !toDelete.has(p.id));

        if (appState.projects.length === 0) {
            loadDefaultData();
        } else if (toDelete.has(appState.activeProjectId)) {
            appState.activeProjectId = appState.projects[0].id;
        }
        saveStateLocally();
        renderApp();
    }
}

// Operational Clock & Analog Time Dial
function toggleTimer() {
    const task = getActiveTask(); 
    if (!task || task.isCompleted) return;

    if (isPlaying) {
        openParkModal();
        return;
    }

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
    t.actualTime += 1;
    p.totalTimeSpent += 1;
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

    if (activeSessionStart) {
        const duration = Math.round((Date.now() - activeSessionStart.getTime()) / 1000);
        logSessionTelemetry(getActiveTask()?.id, getActiveProject()?.id, duration, false);
        activeSessionStart = null;
    }

    renderTimerVisuals();
    saveStateLocally();
}

function logSessionTelemetry(taskId, projectId, durationSec, completed = false) {
    if (!durationSec || durationSec < 4) return;
    appState.sessionLogs = appState.sessionLogs || [];
    appState.sessionLogs.push({
        id: 'sess-' + generateId(),
        taskId: taskId,
        projectId: projectId,
        startedAt: new Date(Date.now() - durationSec * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        durationSeconds: durationSec,
        mode: activeSessionMode || 'focus',
        completedTask: completed
    });
    saveStateLocally();
}

function completeActiveTask() {
    const t = getActiveTask(), p = getActiveProject();
    if (!t || t.isCompleted) return;
    if (isPlaying) forcePause();
    t.isCompleted = true;
    t.completionDate = new Date().toISOString();
    playSound('complete');
    confetti({ particleCount: 80, spread: 60 });
    logSessionTelemetry(t.id, p.id, t.actualTime, true);
    saveStateLocally();
    setTimeout(() => {
        p.activeTaskId = (p.tasks.find(x => !x.isCompleted) || {}).id || null;
        saveStateLocally();
        renderApp();
    }, 1000);
    renderApp();
}

function updateTimerTexts(p, task) {
    document.getElementById('active-timer-display').textContent = formatTimeCompact(task.actualTime);
    document.getElementById('project-cumulative-timer').textContent = formatTimeCompact(getCumulativeTime(p.id));
    document.getElementById('active-timer-estimate').textContent = task.estimatedTime > 0 ? `Target: ${Math.round(task.estimatedTime/60)}m` : 'Open ended';

    const zenDisplay = document.getElementById('zen-timer-display'); 
    if (zenDisplay) zenDisplay.textContent = formatTimeCompact(task.actualTime);

    const c = 930;
    const target = task.estimatedTime > 0 ? task.estimatedTime : 1800;
    const arc = document.getElementById('radial-progress-arc');
    const halo = document.getElementById('radial-overtime-halo');
    const stateText = document.getElementById('timer-state-text');
    const timerBtn = document.getElementById('main-timer-btn');
    const zenBtn = document.getElementById('zen-timer-btn');

    if (arc) {
        const progress = Math.min(task.actualTime / target, 1.0);
        arc.style.strokeDashoffset = (c * (1 - progress)).toString();

        if (task.actualTime <= target) {
            arc.style.stroke = isPlaying ? '#10b981' : '#f43f5e';
            if (halo) halo.classList.add('opacity-0');
            if (stateText) stateText.textContent = isPlaying ? 'Active' : 'Paused';
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
            if (stateText) stateText.textContent = `Flow Zone (+${formatTimeCompact(overtime)})`;
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

// Park & Resume Anchors
function openParkModal() {
    const modal = document.getElementById('park-resume-modal');
    if (!modal) { forcePause(); return; }
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
        const stopped = document.getElementById('park-stopped-input').value.trim();
        const next60s = document.getElementById('park-next60s-input').value.trim();
        task.lastParkedContext = {
            whereStopped: stopped || 'Mid-flow work',
            next60sAction: next60s || 'Resume central focus',
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
    if (task) { task.lastParkedContext = null; saveStateLocally(); }
    renderApp();
    if (!isPlaying) toggleTimer();
}

function dismissLaunchpad() {
    const task = getActiveTask();
    if (task) { task.lastParkedContext = null; saveStateLocally(); }
    renderApp();
}

// Micro-Step Decomposer Handlers
function renderMicroSteps(task) {
    const list = document.getElementById('active-task-microsteps-list');
    const summary = document.getElementById('microstep-summary');
    if (!list || !summary) return;
    if (!task) {
        list.innerHTML = `<p class="text-[11px] text-slate-400 italic">Select a task to decompose.</p>`;
        summary.textContent = '0/0 done';
        return;
    }
    task.microSteps = task.microSteps || [];
    const completed = task.microSteps.filter(s => s.isCompleted).length;
    summary.textContent = `${completed}/${task.microSteps.length} done`;

    list.innerHTML = task.microSteps.map(s => `
        <div class="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 text-xs">
            <label class="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                <input type="checkbox" ${s.isCompleted ? 'checked' : ''} onchange="toggleMicroStep('${s.id}')" class="rounded text-brand-600 focus:ring-0">
                <span class="${s.isCompleted ? 'line-through text-slate-400' : 'text-slate-700 font-medium'} truncate">${s.title}</span>
            </label>
            <button onclick="deleteMicroStep('${s.id}')" class="text-slate-300 hover:text-rose-500 p-1"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
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
            confetti({ particleCount: 40, spread: 45 });
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

// Scratchpad Handlers
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
        container.innerHTML = `<p class="text-xs text-slate-400 py-3 text-center italic">No thoughts captured yet.</p>`;
        return;
    }
    container.innerHTML = items.map(item => `
        <div class="flex items-center justify-between py-2 text-xs">
            <span class="text-slate-700 flex-1 truncate pr-2">${item.text}</span>
            <div class="flex items-center gap-1 shrink-0">
                <button onclick="convertScratchpadToTask('${item.id}')" class="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-brand-600 rounded text-[10px] font-bold">To Task</button>
                <button onclick="deleteScratchpadItem('${item.id}')" class="text-slate-400 hover:text-rose-500 p-1"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
            </div>
        </div>
    `).join('');
    safeCreateIcons();
}

function convertScratchpadToTask(itemId) {
    const item = (appState.scratchpad || []).find(x => x.id === itemId);
    const p = getActiveProject();
    if (!item || !p) return;
    if (hasSubProjects(p.id)) { alert("Select a leaf sub-project first."); return; }
    p.tasks.push({
        id: 't-' + generateId(),
        title: item.text,
        estimatedTime: 15 * 60,
        actualTime: 0,
        isCompleted: false,
        deadline: '',
        notes: 'Created from scratchpad',
        createdAt: new Date().toISOString(),
        microSteps: [],
        lastParkedContext: null
    });
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

// View Navigation Router
function switchView(view) {
    syncHeaderInputsToState();
    if (isPlaying) forcePause();
    currentView = view;

    document.getElementById('view-focus-container').classList.toggle('hidden', view !== 'focus');
    document.getElementById('view-calendar-container').classList.toggle('hidden', view !== 'calendar');
    document.getElementById('view-analytics-container').classList.toggle('hidden', view !== 'analytics');

    ['focus', 'calendar', 'analytics'].forEach(v => {
        const btn = document.getElementById(`nav-${v}`);
        if (btn) {
            btn.className = (v === view)
                ? "flex-1 py-2 rounded-xl text-xs font-bold bg-white text-brand-600 shadow-sm ring-1 ring-slate-200 transition-all flex justify-center items-center gap-1"
                : "flex-1 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all flex justify-center items-center gap-1";
        }
    });

    if (view === 'calendar') renderCalendarView();
    else if (view === 'analytics') renderAnalytics(7);
    else renderApp();

    safeCreateIcons();
}

// Render Core Application
function renderApp() {
    const p = getActiveProject(); if (!p) return;
    renderSidebar();
    renderHeader(p);
    renderActiveTask(p);
    renderMascotStage();
    renderTaskList(p);
    safeCreateIcons();
}

function renderSidebar() {
    const container = document.getElementById('project-list-container');
    function buildTreeHTML(parentId = null, depth = 0) {
        const projectsAtLevel = appState.projects.filter(p => p.parentId === parentId);
        if (projectsAtLevel.length === 0) return '';

        return projectsAtLevel.map(p => {
            const isActive = p.id === appState.activeProjectId;
            const isCollapsed = appState.collapsedProjects && appState.collapsedProjects[p.id];
            const subProjects = appState.projects.filter(sp => sp.parentId === p.id);
            const hasSubs = subProjects.length > 0;
            
            const rootProj = getRootProject(p);
            const activeMascot = (rootProj.activeMascotId && typeof mascotDatabase !== 'undefined') ? mascotDatabase.find(m => m.id === rootProj.activeMascotId) : null;
            const cumulativeTime = getCumulativeTime(p.id);
            const indentPx = depth * 14;

            return `
            <div class="space-y-1">
                <div class="group relative rounded-xl p-2.5 cursor-pointer transition-all flex items-center justify-between ${isActive ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-200/50'}"
                     style="margin-left: ${indentPx}px"
                     onclick="selectProject('${p.id}')">
                    
                    <div class="flex items-center gap-2 min-w-0 flex-1 pr-2">
                        ${hasSubs ? `
                            <button onclick="toggleProjectCollapse('${p.id}', event)" class="p-0.5 hover:bg-slate-200 rounded text-slate-500 shrink-0">
                                <i data-lucide="${isCollapsed ? 'chevron-right' : 'chevron-down'}" class="w-3.5 h-3.5"></i>
                            </button>
                        ` : `<span class="w-3.5 shrink-0"></span>`}

                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5">
                                <i data-lucide="${hasSubs ? 'folder-tree' : 'folder'}" class="w-3.5 h-3.5 shrink-0 ${isActive ? 'text-brand-500' : 'text-slate-400'}"></i>
                                <h4 class="font-bold text-xs truncate ${isActive ? 'text-slate-900' : 'text-slate-700'}">${p.title}</h4>
                            </div>
                            <div class="text-[9px] text-slate-400 font-mono tracking-tight mt-0.5 ml-5">
                                ${formatTimeFull(cumulativeTime)}
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-1 shrink-0">
                        ${depth < 2 ? `
                        <button onclick="createNewProject('${p.id}'); event.stopPropagation();" class="opacity-0 group-hover:opacity-100 p-1 hover:bg-brand-50 text-brand-600 rounded transition-opacity" title="${depth === 0 ? 'Add Sub-Project' : 'Add Component Project'}">
                            <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
                        </button>
                        ` : ''}
                        
                        <button onclick="deleteProject('${p.id}', event)" class="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 text-rose-500 rounded transition-opacity" title="Delete Project">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>

                        ${activeMascot ? `
                            <div class="w-6 h-6 ml-1 flex items-center justify-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 shrink-0" title="Companion: ${activeMascot.name}">
                                ${activeMascot.svg}
                            </div>
                        ` : ''}
                    </div>
                </div>

                ${(!isCollapsed && hasSubs) ? buildTreeHTML(p.id, depth + 1) : ''}
            </div>`;
        }).join('');
    }
    container.innerHTML = buildTreeHTML(null, 0);
    safeCreateIcons();
}

function renderHeader(p) {
    document.getElementById('project-title-input').value = p.title || '';
    document.getElementById('project-goal-input').value = p.goal || '';
    document.getElementById('project-deadline-input').value = p.deadline || '';
    document.getElementById('project-notes-summary-input').value = p.notes || '';
    document.getElementById('project-cumulative-timer').textContent = formatTimeCompact(getCumulativeTime(p.id));
}

function renderActiveTask(p) {
    const task = getActiveTask();
    document.getElementById('active-task-title').textContent = task ? task.title : 'Select a task to begin';
    
    const taskNotesElem = document.getElementById('active-task-notes');
    const taskDeadlineElem = document.getElementById('active-task-deadline');
    if (taskNotesElem) taskNotesElem.value = task ? (task.notes || '') : '';
    if (taskDeadlineElem) taskDeadlineElem.value = task ? (task.deadline || '') : '';

    const bannerMount = document.getElementById('resumption-banner-mount');
    if (bannerMount) {
        if (task && task.lastParkedContext) {
            const ctx = task.lastParkedContext;
            bannerMount.innerHTML = `
            <div class="w-full bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-indigo-500/10 border border-amber-500/30 rounded-2xl p-4 mb-4 backdrop-blur-md shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-sans-ui">
                <div class="flex items-start gap-3 min-w-0">
                    <div class="p-2.5 bg-amber-500 text-white rounded-xl shadow shrink-0 mt-0.5"><i data-lucide="play-circle" class="w-5 h-5"></i></div>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">Resumption Launchpad</span>
                            <span class="text-xs text-slate-500">Stopped: <strong>${ctx.whereStopped}</strong></span>
                        </div>
                        <p class="text-xs font-bold text-slate-800 mt-1">Next 60s: <span class="text-brand-600 underline">${ctx.next60sAction}</span></p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="executeLaunchpadResume()" class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5">
                        <i data-lucide="play" class="w-3.5 h-3.5 fill-white"></i> Execute 60s Action
                    </button>
                    <button onclick="dismissLaunchpad()" class="p-2 text-slate-400 hover:text-slate-600 rounded-xl"><i data-lucide="x" class="w-4 h-4"></i></button>
                </div>
            </div>`;
        } else {
            bannerMount.innerHTML = '';
        }
    }

    renderMicroSteps(task);
    updateTimerTexts(p, task || { actualTime: 0, estimatedTime: 0 });
}

function renderMascotStage() {
    if (typeof mascotDatabase === 'undefined') return;
    const activeProject = getActiveProject();
    const rootProj = getRootProject(activeProject);
    const activeMascotId = rootProj.activeMascotId;

    const mainMountWrapper = document.getElementById('main-mascot-mount-wrapper');
    const mainMount = document.getElementById('main-mascot-mount');
    const zenMount = document.getElementById('zen-mascot-mount');
    const zenRoamWrapper = document.getElementById('mascot-roam-wrapper');

    if (!activeMascotId) {
        if (mainMountWrapper) mainMountWrapper.classList.add('hidden');
        if (mainMount) mainMount.innerHTML = "";
        if (zenMount) zenMount.innerHTML = "";
        if (zenRoamWrapper) zenRoamWrapper.classList.add('hidden');
    } else {
        const activeMascot = mascotDatabase.find(m => m.id === activeMascotId) || mascotDatabase[0];
        const mascotHTML = `<div class="w-16 h-16 flex items-center justify-center p-0.5 overflow-visible">${activeMascot.svg}</div>`;
        if (mainMountWrapper) mainMountWrapper.classList.remove('hidden');
        if (mainMount) mainMount.innerHTML = mascotHTML;
        if (zenMount) zenMount.innerHTML = mascotHTML;
        if (zenRoamWrapper) zenRoamWrapper.classList.remove('hidden');
    }

    setMascotBehavior(appState.mascotBehavior || 'roam');
    setMascotScale(appState.mascotScale || 1.0);

    const unlockBtn = document.getElementById('btn-unlock-all-mascots');
    const hideBtn = document.getElementById('btn-hide-unlock');
    if (appState.hideUnlockBtn) {
        if (unlockBtn) unlockBtn.classList.add('hidden');
        if (hideBtn) { hideBtn.innerHTML = `<i data-lucide="eye" class="w-4 h-4"></i>`; hideBtn.title = "Show"; }
    } else {
        if (unlockBtn) unlockBtn.classList.remove('hidden');
        if (hideBtn) { hideBtn.innerHTML = `<i data-lucide="eye-off" class="w-4 h-4"></i>`; hideBtn.title = "Hide"; }
    }

    const grid = document.getElementById('mascot-gallery-grid'); if (!grid) return;
    const projectTime = getCumulativeTime(rootProj.id);

    grid.innerHTML = mascotDatabase.map(m => {
        const isSelected = m.id === activeMascotId;
        const isUnlocked = rootProj.unlockAllMascotsTest || m.unlockSec === 0 || (projectTime >= m.unlockSec);
        const assignedOther = appState.projects.find(p => !p.parentId && p.id !== rootProj.id && p.activeMascotId === m.id);

        let statusText = `${m.shapes}`;
        let cardClick = `selectMascotCompanion('${m.id}')`;
        let cardClasses = "bg-slate-50 border-slate-200 hover:border-slate-300";

        if (isSelected) cardClasses = "bg-indigo-50/80 border-indigo-500 shadow-sm scale-[1.02]";
        else if (assignedOther) {
            cardClasses = "bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed";
            cardClick = `alert('This mascot is assigned to: ${assignedOther.title}')`;
            statusText = "In Use";
        } else if (!isUnlocked) {
            cardClasses = "opacity-40 grayscale cursor-not-allowed bg-slate-50 border-slate-200";
            cardClick = "";
        }

        return `
        <div onclick="${cardClick}" class="p-2.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${cardClasses}">
            <div class="w-12 h-12 mascot-card-svg-wrapper flex items-center justify-center p-0.5 my-0.5 pointer-events-none">${m.svg}</div>
            <div class="text-[11px] font-bold text-slate-800 truncate w-full mt-1">${m.name}</div>
            <div class="text-[9px] font-mono text-slate-400 font-semibold truncate w-full">${statusText}</div>
        </div>`;
    }).join('');
    safeCreateIcons();
}

function renderTaskList(p) {
    const container = document.getElementById('task-list-container');
    const addTaskContainer = document.getElementById('add-task-container');
    const parentNotice = document.getElementById('parent-task-blocked-notice');
    const isParent = hasSubProjects(p.id);

    if (isParent) {
        if (addTaskContainer) addTaskContainer.classList.add('hidden');
        if (parentNotice) parentNotice.classList.remove('hidden');
    } else {
        if (addTaskContainer) addTaskContainer.classList.remove('hidden');
        if (parentNotice) parentNotice.classList.add('hidden');
    }

    const total = p.tasks.length;
    const completed = p.tasks.filter(t => t.isCompleted).length;
    document.getElementById('task-progress-text').textContent = `${completed}/${total} Completed`;

    container.innerHTML = p.tasks.map((t, idx) => {
        const isActive = t.id === p.activeTaskId;
        const estFmt = t.estimatedTime > 0 ? formatTimeCompact(t.estimatedTime) : '--:--:--';
        const actFmt = formatTimeCompact(t.actualTime);

        return `
        <div class="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border ${isActive ? 'border-brand-500' : 'border-slate-200'}">
            <span class="w-6 text-center text-xs font-bold font-mono text-slate-400">${idx + 1}</span>
            <button onclick="toggleTaskStatus('${t.id}')" class="w-5 h-5 rounded-full border flex items-center justify-center ${t.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}"><i data-lucide="check" class="w-3.5 h-3.5"></i></button>
            <div class="flex-1 cursor-pointer min-w-0" onclick="selectTask('${t.id}')">
                <p class="text-xs font-semibold truncate ${t.isCompleted ? 'line-through text-slate-400' : ''}">${t.title}</p>
                <div class="flex items-center gap-2 mt-0.5">
                    ${(t.microSteps && t.microSteps.length > 0) ? `<span class="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-mono">${t.microSteps.filter(s=>s.isCompleted).length}/${t.microSteps.length} steps</span>` : ''}
                    ${t.notes ? `<span class="text-[9px] text-slate-400 flex items-center gap-0.5"><i data-lucide="file-text" class="w-3 h-3"></i> Notes</span>` : ''}
                    ${t.deadline ? `<span class="text-[9px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded font-mono">${t.deadline}</span>` : ''}
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0 font-mono text-xs">
                <span class="text-slate-700 font-semibold">${actFmt}</span>
                <span class="text-slate-300">/</span>
                <span class="text-slate-400">${estFmt}</span>
                <button onclick="deleteTask('${t.id}', event)" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1" title="Delete Task">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        </div>`;
    }).join('');
}

function renderTimerVisuals() {
    const mainBtn = document.getElementById('main-timer-btn'), mainBloom = document.getElementById('inner-bloom-layer');
    const zenBtn = document.getElementById('zen-timer-btn'), zenBloom = document.getElementById('zen-bloom-layer');
    const state = isPlaying ? "Active" : "Paused";
    if (document.getElementById('timer-state-text')) document.getElementById('timer-state-text').textContent = state;
    if (document.getElementById('zen-timer-state')) document.getElementById('zen-timer-state').textContent = state;

    [mainBtn, zenBtn].forEach(b => {
        if (!b) return;
        b.className = `relative flex flex-col items-center justify-center w-72 h-72 sm:w-80 sm:h-80 rounded-full border-[8px] transition-all duration-300 cursor-pointer outline-none overflow-hidden ${isPlaying ? 'timer-green-container' : 'timer-red-container'}`;
    });
    [mainBloom, zenBloom].forEach(bl => {
        if (!bl) return;
        if (isPlaying) bl.classList.add('zen-breathing-bloom'); else bl.classList.remove('zen-breathing-bloom');
    });
}

function toggleTaskStatus(id) {
    const p = getActiveProject(), t = p.tasks.find(x => x.id === id);
    if (t) {
        t.isCompleted = !t.isCompleted;
        if (t.isCompleted) t.completionDate = new Date().toISOString();
        saveStateLocally();
        renderApp();
    }
}

function selectProject(id) {
    syncHeaderInputsToState();
    appState.activeProjectId = id;
    renderApp();
}

function selectTask(id) {
    const p = getActiveProject();
    p.activeTaskId = id;
    renderApp();
    const zt = document.getElementById('zen-active-task-title');
    const zn = document.getElementById('zen-task-notes');
    const t = getActiveTask();
    if (zt) zt.textContent = t ? `${t.title} (${p.title})` : p.title;
    if (zn) zn.textContent = t && t.notes ? t.notes : (p.notes || 'No notes attached.');
}

function handleAddTask() {
    const inTitle = document.getElementById('new-task-title-input');
    const inEst = document.getElementById('new-task-est-input');
    const title = inTitle.value.trim(), estMins = parseInt(inEst.value);
    const p = getActiveProject();
    if (hasSubProjects(p.id)) { alert("Tasks only exist at the lowest project level."); return; }
    if (!title) return;
    if (!estMins || estMins <= 0) { alert("Target Time required!"); inEst.focus(); return; }

    p.tasks.push({
        id: 't-' + generateId(),
        title: title,
        estimatedTime: estMins * 60,
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

function deleteTask(taskId, e) {
    if (e) e.stopPropagation();
    const p = getActiveProject(); if (!p) return;
    p.tasks = p.tasks.filter(t => t.id !== taskId);
    if (p.activeTaskId === taskId) p.activeTaskId = p.tasks.length > 0 ? p.tasks[0].id : null;
    saveStateLocally();
    renderApp();
}

function toggleInstructionsModal() { document.getElementById('instructions-modal').classList.toggle('hidden'); }
function toggleBackdropModal() { document.getElementById('backdrop-modal').classList.toggle('hidden'); }
function toggleProjectNotesModal() {
    const m = document.getElementById('project-notes-modal');
    if (m.classList.contains('hidden')) {
        document.getElementById('project-full-notes-textarea').value = getActiveProject().notes || '';
    }
    m.classList.toggle('hidden');
}
function saveFullProjectNotes() {
    const p = getActiveProject();
    p.notes = document.getElementById('project-full-notes-textarea').value;
    document.getElementById('project-notes-summary-input').value = p.notes;
    saveStateLocally();
    toggleProjectNotesModal();
}

// Global auto-sync on project header fields
['project-title-input', 'project-goal-input', 'project-deadline-input', 'project-notes-summary-input'].forEach(id => {
    const elem = document.getElementById(id);
    if (elem) {
        const handler = () => {
            const p = getActiveProject();
            if (id === 'project-title-input') p.title = elem.value;
            if (id === 'project-goal-input') p.goal = elem.value;
            if (id === 'project-deadline-input') p.deadline = elem.value;
            if (id === 'project-notes-summary-input') p.notes = elem.value;
            saveStateLocally();
        };
        elem.addEventListener('input', handler);
        elem.addEventListener('change', handler);
    }
});

document.getElementById('active-task-notes').addEventListener('input', (e) => {
    const t = getActiveTask(); if (t) { t.notes = e.target.value; saveStateLocally(); }
});
document.getElementById('active-task-deadline').addEventListener('change', (e) => {
    const t = getActiveTask(); if (t) { t.deadline = e.target.value; saveStateLocally(); renderTaskList(getActiveProject()); }
});

['new-task-title-input', 'new-task-est-input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAddTask(); });
});

// App Startup Sequence
initSettings();
renderApp();
