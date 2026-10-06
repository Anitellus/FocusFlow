// ============================================================================
// Focus Flow | Master Application Coordinator (js/app.js)
// ============================================================================

let isPlaying = false;
let timerInterval = null;
let tickCounter = 0;
let currentView = 'focus';
let jitterAudioTimer = null;
let activeSessionStart = null;
let activeSessionMode = 'focus';
let visibilityTimeout = null;
let activePostDocProjectId = null;

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

// --- State Queries & Hierarchy Helpers ---
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

// --- View Router ---
function switchView(viewName) {
    currentView = viewName;
    const focusContainer = document.getElementById('view-focus-container');
    const calContainer = document.getElementById('view-calendar-container');
    const progContainer = document.getElementById('view-progression-container');
    const analyticsContainer = document.getElementById('view-analytics-container');

    const navFocus = document.getElementById('nav-focus');
    const navCal = document.getElementById('nav-calendar');
    const navProg = document.getElementById('nav-progress');

    if (focusContainer) focusContainer.classList.toggle('hidden', viewName !== 'focus');
    if (calContainer) calContainer.classList.toggle('hidden', viewName !== 'calendar');
    if (progContainer) progContainer.classList.toggle('hidden', viewName !== 'progress');
    if (analyticsContainer) analyticsContainer.classList.toggle('hidden', viewName !== 'analytics');

    const activeNavClass = "flex-1 py-1.5 rounded-xl text-xs font-bold bg-white text-brand-600 shadow-sm ring-1 ring-slate-200 transition-all flex justify-center items-center gap-1";
    const inactiveNavClass = "flex-1 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all flex justify-center items-center gap-1";

    if (navFocus) navFocus.className = viewName === 'focus' ? activeNavClass : inactiveNavClass;
    if (navCal) navCal.className = viewName === 'calendar' ? activeNavClass : inactiveNavClass;
    if (navProg) navProg.className = viewName === 'progress' ? activeNavClass : inactiveNavClass;

    if (viewName === 'calendar' && typeof renderCalendarView === 'function') {
        renderCalendarView();
    } else if (viewName === 'progress' && typeof ProgressionEngine !== 'undefined') {
        ProgressionEngine.render();
    } else if (viewName === 'analytics' && typeof renderAnalytics === 'function') {
        renderAnalytics(30);
    } else if (viewName === 'focus') {
        renderApp();
    }
    safeCreateIcons();
}

// 2. Resilient Timer: Survives page refresh and enforces 90m boundary
let breakInterval = null;

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

    // Store absolute timestamp in localStorage to survive hard refreshes (F5/Cmd+R)
    appState.activeTimerSession = {
        taskId: task.id,
        projectId: getActiveProject().id,
        startedTimestamp: Date.now(),
        taskBaseActualTime: task.actualTime
    };
    saveStateLocally();

    renderTimerVisuals();
    playSound('start');
    timerInterval = setInterval(timerTick, 1000);
    scheduleNextAudioJitter();
}

// --- Project Terrain Map Engine (Panoramic Macro Visualization) ---
let currentMappedRootId = null;

function renderMapView(selectedRootId = null) {
    const selector = document.getElementById('map-project-selector');
    const canvas = document.getElementById('map-canvas-container');
    if (!canvas) return;

    // Get all root projects
    const allRoots = (appState.projects || []).filter(p => !p.parentId);
    if (allRoots.length === 0) {
        canvas.innerHTML = `<div class="p-8 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">No projects exist yet. Create a project to view its terrain map.</div>`;
        return;
    }

    // Determine current root to inspect
    if (selectedRootId) {
        currentMappedRootId = selectedRootId;
    } else if (!currentMappedRootId || !allRoots.some(r => r.id === currentMappedRootId)) {
        const activeProj = getActiveProject();
        const rootOfActive = activeProj ? getRootProject(activeProj) : allRoots[0];
        currentMappedRootId = rootOfActive ? rootOfActive.id : allRoots[0].id;
    }

    const currentRoot = allRoots.find(r => r.id === currentMappedRootId) || allRoots[0];

    // Populate Selector Dropdown
    if (selector) {
        selector.innerHTML = allRoots.map(r => `
            <option value="${r.id}" ${r.id === currentRoot.id ? 'selected' : ''}>
                ${r.title} ${r.isParked ? '(Parked)' : ''} ${r.completedAt ? '✓' : ''}
            </option>
        `).join('');
    }

    // Header Details
    document.getElementById('map-project-title').textContent = currentRoot.title;
    document.getElementById('map-project-goal').textContent = currentRoot.goal || 'No North Star goal attached.';
    const totalRootSec = getCumulativeTime(currentRoot.id);
    document.getElementById('map-project-total-time').textContent = formatTimeHuman(totalRootSec);

    // Effort Allocation Calculation
    const subTracks = (appState.projects || []).filter(p => p.parentId === currentRoot.id);
    const effortBar = document.getElementById('map-effort-bar');
    const effortLegend = document.getElementById('map-effort-legend');

    const palette = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6', '#14b8a6'];

    if (subTracks.length === 0 || totalRootSec === 0) {
        effortBar.innerHTML = `<div class="w-full h-full bg-slate-200 flex items-center justify-center text-[9px] text-slate-400 font-mono font-semibold">No track telemetry logged yet</div>`;
        effortLegend.innerHTML = `<span class="text-slate-400 italic">Work across sub-tracks to see momentum distribution.</span>`;
    } else {
        let barHtml = '';
        let legendHtml = '';
        subTracks.forEach((sub, idx) => {
            const subSec = getCumulativeTime(sub.id);
            const pct = Math.round((subSec / totalRootSec) * 100);
            const color = palette[idx % palette.length];
            if (pct > 0) {
                barHtml += `<div style="width: ${pct}%; background-color: ${color};" title="${sub.title}: ${pct}% (${formatTimeHuman(subSec)})"></div>`;
            }
            legendHtml += `
                <div class="flex items-center gap-1.5 font-medium">
                    <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${color};"></span>
                    <span class="text-slate-700">${sub.title}</span>
                    <span class="text-slate-400 font-mono font-semibold">(${pct}%)</span>
                </div>
            `;
        });
        effortBar.innerHTML = barHtml || `<div class="w-full h-full bg-slate-200"></div>`;
        effortLegend.innerHTML = legendHtml;
    }

    // Render Terrain Board
    // Case A: Root has direct tasks (Leaf Project)
    if (subTracks.length === 0) {
        canvas.innerHTML = `
            <div class="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                        <h3 class="font-extrabold text-sm text-slate-900">Direct Action Tasks</h3>
                        <p class="text-xs text-slate-400">This project executes at root tier without sub-projects.</p>
                    </div>
                    <span class="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        ${(currentRoot.tasks || []).filter(t => t.isCompleted).length}/${(currentRoot.tasks || []).length} done
                    </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    ${renderMapTaskList(currentRoot.tasks || [], currentRoot.id)}
                </div>
            </div>
        `;
        safeCreateIcons();
        return;
    }

    // Case B: Full Hierarchy (Sub-Projects & Component Tracks)
    let boardHtml = '';
    subTracks.forEach((sub, idx) => {
        const components = (appState.projects || []).filter(p => p.parentId === sub.id);
        const subSec = getCumulativeTime(sub.id);
        const subColor = palette[idx % palette.length];

        boardHtml += `
            <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <span class="w-3 h-3 rounded-full shrink-0" style="background-color: ${subColor};"></span>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="font-black text-base text-slate-900 truncate">${sub.title}</h3>
                                <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700">Tier 2 Track</span>
                            </div>
                            ${sub.notes ? `<p class="text-xs text-slate-500 mt-0.5 whitespace-pre-line leading-relaxed">${sub.notes}</p>` : ''}
                        </div>
                    </div>
                    <span class="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto shrink-0">
                        ${formatTimeHuman(subSec)} invested
                    </span>
                </div>
        `;

        if (components.length === 0) {
            // Sub-project directly holds tasks
            boardHtml += `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    ${renderMapTaskList(sub.tasks || [], sub.id)}
                </div>
            `;
        } else {
            // Components inside Sub-project
            boardHtml += `<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">`;
            components.forEach(comp => {
                const compTasks = comp.tasks || [];
                const doneCount = compTasks.filter(t => t.isCompleted).length;
                boardHtml += `
                    <div class="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 space-y-3">
                        <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
                            <div class="min-w-0">
                                <div class="flex items-center gap-1.5">
                                    <span class="font-extrabold text-xs text-slate-800 truncate">${comp.title}</span>
                                    <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-brand-100 text-brand-700">Tier 3</span>
                                </div>
                                ${comp.notes ? `<p class="text-[11px] text-slate-400 truncate mt-0.5">${comp.notes}</p>` : ''}
                            </div>
                            <span class="text-[10px] font-mono font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full shrink-0">
                                ${doneCount}/${compTasks.length} done
                            </span>
                        </div>
                        <div class="space-y-2">
                            ${renderMapTaskList(compTasks, comp.id)}
                        </div>
                    </div>
                `;
            });
            boardHtml += `</div>`;
        }

        boardHtml += `</div>`;
    });

    canvas.innerHTML = boardHtml;
    safeCreateIcons();
}

function renderMapTaskList(tasks, projectId) {
    if (!tasks || tasks.length === 0) {
        return `<p class="text-xs text-slate-400 italic py-2">No tasks created yet.</p>`;
    }

    return tasks.map(t => {
        const microCount = (t.microSteps || []).length;
        const microDone = (t.microSteps || []).filter(ms => ms.isCompleted).length;

        return `
            <div class="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-2xs hover:border-brand-400 transition-all flex flex-col justify-between">
                <div class="space-y-1.5">
                    <div class="flex items-start justify-between gap-2">
                        <span class="text-xs font-bold leading-snug ${t.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}">
                            ${t.title}
                        </span>
                        <span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${t.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">
                            ${t.isCompleted ? 'Done' : 'Open'}
                        </span>
                    </div>

                    ${t.notes ? `
                        <p class="text-[11px] text-slate-500 leading-relaxed whitespace-pre-line line-clamp-3 bg-slate-50 p-2 rounded-xl border border-slate-100 font-normal">
                            ${t.notes}
                        </p>
                    ` : ''}

                    ${microCount > 0 ? `
                        <div class="space-y-1 pt-1">
                            <span class="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Atomic Micro-Steps (${microDone}/${microCount})</span>
                            <div class="space-y-1">
                                ${t.microSteps.map(ms => `
                                    <div class="flex items-center gap-1.5 text-[10px] text-slate-600 truncate">
                                        <i data-lucide="${ms.isCompleted ? 'check-circle' : 'circle'}" class="w-3 h-3 ${ms.isCompleted ? 'text-emerald-500' : 'text-slate-300'} shrink-0"></i>
                                        <span class="truncate ${ms.isCompleted ? 'line-through text-slate-400' : ''}">${ms.title}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-[10px] font-mono text-slate-400 font-semibold">
                        ${t.actualTime > 0 ? `${formatTimeCompact(t.actualTime)} spent` : 'Ready to start'}
                    </span>
                    <button onclick="focusTaskFromMap('${projectId}', '${t.id}')" class="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1">
                        <i data-lucide="target" class="w-3 h-3"></i> Focus
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function focusTaskFromMap(projectId, taskId) {
    appState.activeProjectId = projectId;
    const p = (appState.projects || []).find(x => x.id === projectId);
    if (p) p.activeTaskId = taskId;
    saveStateLocally();
    switchView('focus');
}

// --- Sprint Novelty Engine ---
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

function updateSprintCycleUI() {
    const info = getSprintCycleInfo();
    const lbl = document.getElementById('sprint-cycle-label');
    const rem = document.getElementById('sprint-days-remaining');
    const bar = document.getElementById('sprint-cycle-bar');
    if (lbl) lbl.textContent = `Sprint: Day ${info.elapsedDays} of ${info.totalDays}`;
    if (rem) rem.textContent = `${info.remainingDays}d left`;
    if (bar) bar.style.width = `${info.progressPct}%`;
}

function openSprintReviewModal() {
    const info = getSprintCycleInfo();
    const badge = document.getElementById('sprint-modal-status-badge');
    if (badge) {
        badge.textContent = `Day ${info.elapsedDays} / ${info.totalDays} • ${info.remainingDays}d runway left`;
        badge.className = info.isCompleted
            ? "px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold"
            : "px-2 py-0.5 rounded-full text-[10px] bg-brand-100 text-brand-700 font-bold";
    }
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
    renderApp();
    confetti({ particleCount: 60, spread: 55 });
}

// --- Drawer & Mobile Navigation Toggles ---
function toggleSaveStateDrawer() {
    appState.saveStateDrawerOpen = !appState.saveStateDrawerOpen;
    const drawer = document.getElementById('save-state-drawer');
    const chevron = document.getElementById('save-state-chevron');
    if (drawer) drawer.classList.toggle('hidden', !appState.saveStateDrawerOpen);
    if (chevron) chevron.style.transform = appState.saveStateDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    saveStateLocally();
}

function toggleParkingLotDrawer() {
    appState.parkingLotOpen = !appState.parkingLotOpen;
    saveStateLocally();
    renderSidebar();
}

function toggleCompletedProjectsDrawer() {
    appState.completedProjectsDrawerOpen = !appState.completedProjectsDrawerOpen;
    saveStateLocally();
    renderSidebar();
}

function toggleCompletedTasksDrawer() {
    appState.completedTasksDrawerOpen = !appState.completedTasksDrawerOpen;
    const container = document.getElementById('completed-tasks-container');
    const chevron = document.getElementById('completed-tasks-chevron');
    if (container) container.classList.toggle('hidden', !appState.completedTasksDrawerOpen);
    if (chevron) chevron.style.transform = appState.completedTasksDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    saveStateLocally();
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('sidebar-drawer');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!sidebar || !backdrop) return;
    const isClosed = sidebar.classList.contains('-translate-x-full');
    if (isClosed) {
        sidebar.classList.remove('-translate-x-full');
        backdrop.classList.remove('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
    }
}

function closeMobileSidebar() {
    const sidebar = document.getElementById('sidebar-drawer');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
}

// --- Project Tree Architecture & Management ---
function createNewProject(parentId = null) {
    syncHeaderInputsToState();
    let makeParked = false;
    let tasksToMigrate = [];

    if (!parentId) {
        const activeRoots = getActiveRootProjects();
        if (activeRoots.length >= 4) {
            if (!confirm(`Your Active Sprint already contains 4 projects.\n\nTo preserve focus, this new project will be created directly in the Parking Lot.\n\nContinue?`)) return;
            makeParked = true;
        }
    } else {
        const depth = getProjectDepth(parentId);
        if (depth >= 2) {
            alert("Maximum 3-tier hierarchy reached (Main Project -> Sub-Project -> Component Project).");
            return;
        }
        const parent = (appState.projects || []).find(p => p.id === parentId);
        if (parent && parent.tasks && parent.tasks.length > 0) {
            if (!confirm(`"${parent.title}" currently has ${parent.tasks.length} task(s).\n\nTasks only live at the lowest leaf level.\n\nWould you like to move all tasks into the new sub-project?`)) return;
            tasksToMigrate = [...parent.tasks];
            parent.tasks = [];
            parent.activeTaskId = null;
        }
    }

    const id = 'proj-' + generateId();
    const parentDepth = parentId ? getProjectDepth(parentId) : -1;
    const projectTitle = parentDepth === 0 ? 'New Sub-Project' : (parentDepth === 1 ? 'New Component Project' : 'New Root Project');

    const newProject = {
        id,
        parentId: parentId,
        title: projectTitle,
        goal: '',
        deadline: '',
        notes: '',
        retrospectiveNotes: '',
        isParked: makeParked,
        totalTimeSpent: 0,
        activeTaskId: tasksToMigrate.length > 0 ? tasksToMigrate[0].id : null,
        activeMascotId: null,
        unlockAllMascotsTest: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
        tasks: tasksToMigrate
    };

    appState.projects = appState.projects || [];
    appState.projects.push(newProject);
    appState.activeProjectId = id;
    saveStateLocally();
    renderApp();
    closeMobileSidebar();
}

function selectProject(projectId) {
    syncHeaderInputsToState();
    appState.activeProjectId = projectId;
    saveStateLocally();
    renderApp();
}

function toggleParkProject(projectId, e) {
    if (e) e.stopPropagation();
    const p = (appState.projects || []).find(x => x.id === projectId);
    if (!p) return;
    if (p.isParked) {
        if (getActiveRootProjects().length >= 4) {
            alert(`Active sprint is full (4/4 projects).\n\nPlease park one active project before activating "${p.title}".`);
            return;
        }
        p.isParked = false;
        appState.activeProjectId = p.id;
    } else {
        p.isParked = true;
        const remainingActive = getActiveRootProjects();
        if (appState.activeProjectId === p.id) {
            appState.activeProjectId = remainingActive.length > 0 ? remainingActive[0].id : (appState.projects[0]?.id || null);
        }
    }
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
    const proj = (appState.projects || []).find(p => p.id === projectId);
    if (!proj) return;
    if (confirm(`Are you sure you want to delete "${proj.title}" and all its sub-projects and tasks?`)) {
        const toDelete = new Set();
        function collectIds(id) {
            toDelete.add(id);
            (appState.projects || []).filter(p => p.parentId === id).forEach(sp => collectIds(sp.id));
        }
        collectIds(projectId);

        (appState.sessionLogs || []).forEach(l => {
            if (toDelete.has(l.projectId) && !l.projectTitle) {
                const target = (appState.projects || []).find(x => x.id === l.projectId);
                if (target) l.projectTitle = target.title;
            }
        });
        appState.projects = (appState.projects || []).filter(p => !toDelete.has(p.id));
        if (appState.projects.length === 0) {
            loadDefaultData();
        } else if (toDelete.has(appState.activeProjectId)) {
            const activeRoots = getActiveRootProjects();
            appState.activeProjectId = activeRoots.length > 0 ? activeRoots[0].id : appState.projects[0].id;
        }
        saveStateLocally();
        renderApp();
    }
}

// --- Project & Subproject Completion Architecture ---
function toggleCompleteCurrentProject() {
    const p = getActiveProject();
    if (!p) return;
    toggleCompleteProject(p.id);
}

function toggleCompleteProject(projectId, e) {
    if (e) e.stopPropagation();
    const p = (appState.projects || []).find(x => x.id === projectId);
    if (!p) return;

    if (!p.completedAt) {
        const uncompletedTasks = (p.tasks || []).filter(t => !t.isCompleted);
        if (uncompletedTasks.length > 0) {
            const confirmComplete = confirm(`"${p.title}" still has ${uncompletedTasks.length} uncompleted task(s).\n\nMark project as completed and view Post-Doc summary?`);
            if (!confirmComplete) return;
        }

        if (isPlaying && p.id === appState.activeProjectId) forcePause();
        p.completedAt = new Date().toISOString();
        saveStateLocally();
        playSound('complete');
        confetti({ particleCount: 100, spread: 70 });
        renderApp();
        openProjectRetrospective(p.id);
    } else {
        p.completedAt = null;
        saveStateLocally();
        renderApp();
    }
}

// --- Project Post-Doc Retrospective Engine ---
function openProjectRetrospective(projectId) {
    const p = (appState.projects || []).find(x => x.id === projectId);
    if (!p) return;
    activePostDocProjectId = p.id;

    const modal = document.getElementById('project-retrospective-modal');
    if (!modal) return;

    // Gather tree tasks
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
    document.getElementById('postdoc-headline').textContent = `${p.title} Conquered!`;
    document.getElementById('postdoc-dates-label').textContent = `Completed on ${getLocalFormattedDate(completed)} • ${daysActive} day(s) active runway`;

    document.getElementById('postdoc-total-time').textContent = formatTimeHuman(totalActual);
    document.getElementById('postdoc-target-time').textContent = totalEst > 0 ? formatTimeHuman(totalEst) : 'Open';
    document.getElementById('postdoc-accuracy').textContent = `${accuracy}%`;
    document.getElementById('postdoc-tasks-count').textContent = `${completedCount}/${allProjTasks.length}`;

    const taskLogContainer = document.getElementById('postdoc-tasks-breakdown');
    if (taskLogContainer) {
        if (allProjTasks.length === 0) {
            taskLogContainer.innerHTML = `<div class="p-3 text-xs text-slate-400 italic text-center">No atomic tasks recorded.</div>`;
        } else {
            taskLogContainer.innerHTML = allProjTasks.map(t => `
                <div class="px-3.5 py-2 flex items-center justify-between text-xs">
                    <span class="flex items-center gap-2 font-medium text-slate-700 truncate pr-2">
                        <i data-lucide="${t.isCompleted ? 'check-circle' : 'circle'}" class="w-3.5 h-3.5 ${t.isCompleted ? 'text-emerald-500' : 'text-slate-300'}"></i>
                        <span class="truncate ${t.isCompleted ? 'line-through text-slate-500' : ''}">${t.title}</span>
                    </span>
                    <span class="font-mono text-[11px] text-slate-500 shrink-0">
                        ${formatTimeCompact(t.actualTime)} / ${t.estimatedTime > 0 ? formatTimeCompact(t.estimatedTime) : 'Open'}
                    </span>
                </div>
            `).join('');
        }
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
        saveStateLocally();
        renderApp();
    }
    closeProjectRetrospectiveModal();
}

// --- Left Sidebar Component ---
function renderSidebar() {
    const container = document.getElementById('project-list-container');
    if (!container) return;

    const activeRoots = getActiveRootProjects();
    const parkedRoots = getParkedRootProjects();
    const completedRoots = getCompletedRootProjects();
    let html = '';

    function renderProjectNode(proj, depth) {
        const isActive = proj.id === appState.activeProjectId;
        const children = (appState.projects || []).filter(p => p.parentId === proj.id);
        const isCollapsed = !!(appState.collapsedProjects && appState.collapsedProjects[proj.id]);
        const cumulativeSec = getCumulativeTime(proj.id);
        const leafTasks = proj.tasks || [];
        const completedTasks = leafTasks.filter(t => t.isCompleted).length;

        const indentPadding = depth === 0 ? '' : (depth === 1 ? 'ml-3 pl-2 border-l-2 border-slate-200' : 'ml-6 pl-2 border-l-2 border-indigo-200');
        const tierBadge = depth === 0 ? 'Tier 1' : (depth === 1 ? 'Tier 2' : 'Tier 3');

        let nodeHtml = `
            <div class="${indentPadding} my-1">
                <div onclick="selectProject('${proj.id}')" class="group relative flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-white shadow-sm ring-1 ring-brand-500/80 text-brand-950 font-bold' : 'hover:bg-slate-200/60 text-slate-700 font-medium'}">
                    <div class="flex items-center gap-1.5 min-w-0 flex-1 pr-1">
                        ${children.length > 0 ? `
                            <button onclick="toggleProjectCollapse('${proj.id}', event)" class="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-transform">
                                <i data-lucide="${isCollapsed ? 'chevron-right' : 'chevron-down'}" class="w-3.5 h-3.5"></i>
                            </button>
                        ` : `<span class="w-3.5"></span>`}
                        <div class="flex flex-col min-w-0 flex-1">
                            <div class="flex items-center gap-1.5">
                                <span class="truncate text-xs ${proj.completedAt ? 'line-through text-slate-400' : ''}">${proj.title || 'Untitled Project'}</span>
                                <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${depth === 0 ? 'bg-slate-200/80 text-slate-600' : (depth === 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-brand-100 text-brand-700')}">${tierBadge}</span>
                            </div>
                            <span class="text-[10px] text-slate-400 font-mono font-normal">
                                ${children.length > 0 ? `${children.length} sub-track(s)` : `${completedTasks}/${leafTasks.length} done`} • ${formatTimeCompact(cumulativeSec)}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        ${depth < 2 && !proj.completedAt ? `
                            <button onclick="event.stopPropagation(); createNewProject('${proj.id}')" title="Add Sub-Track" class="p-1 hover:bg-slate-200 text-slate-500 rounded-lg">
                                <i data-lucide="plus" class="w-3 h-3"></i>
                            </button>
                        ` : ''}
                        <button onclick="toggleCompleteProject('${proj.id}', event)" title="${proj.completedAt ? 'Reopen Project' : 'Complete Project'}" class="p-1 hover:bg-emerald-100 text-slate-400 hover:text-emerald-600 rounded-lg">
                            <i data-lucide="${proj.completedAt ? 'rotate-ccw' : 'check-circle'}" class="w-3 h-3"></i>
                        </button>
                        <button onclick="toggleParkProject('${proj.id}', event)" title="${proj.isParked ? 'Activate' : 'Park'}" class="p-1 hover:bg-slate-200 text-slate-500 rounded-lg">
                            <i data-lucide="${proj.isParked ? 'play' : 'pause'}" class="w-3 h-3"></i>
                        </button>
                        <button onclick="deleteProject('${proj.id}', event)" title="Delete" class="p-1 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg">
                            <i data-lucide="trash-2" class="w-3 h-3"></i>
                        </button>
                    </div>
                </div>
        `;

        if (children.length > 0 && !isCollapsed) {
            nodeHtml += `<div class="space-y-0.5 mt-0.5">`;
            children.forEach(child => {
                nodeHtml += renderProjectNode(child, depth + 1);
            });
            nodeHtml += `</div>`;
        }

        nodeHtml += `</div>`;
        return nodeHtml;
    }

    // 1. Active Sprint Containers
    html += `<div class="space-y-1">`;
    html += `<div class="flex items-center justify-between px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider"><span>Active Sprint</span><span>${activeRoots.length}/4 Max</span></div>`;
    if (activeRoots.length === 0) {
        html += `<p class="text-xs text-slate-400 italic py-2 px-1">No active sprint projects.</p>`;
    } else {
        activeRoots.forEach(root => {
            html += renderProjectNode(root, 0);
        });
    }
    html += `</div>`;

    // 2. Parking Lot Containers
    if (parkedRoots.length > 0 || appState.parkingLotOpen) {
        html += `
            <div class="mt-4 pt-3 border-t border-slate-200/80">
                <button onclick="toggleParkingLotDrawer()" class="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-slate-800 py-1 px-1 transition-colors">
                    <span class="flex items-center gap-1.5"><i data-lucide="archive" class="w-3.5 h-3.5"></i> Parking Lot (${parkedRoots.length})</span>
                    <i data-lucide="${appState.parkingLotOpen ? 'chevron-down' : 'chevron-right'}" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
        `;
        if (appState.parkingLotOpen) {
            html += `<div class="mt-2 space-y-1">`;
            if (parkedRoots.length === 0) {
                html += `<p class="text-xs text-slate-400 italic py-1 px-1">Parking Lot is empty.</p>`;
            } else {
                parkedRoots.forEach(root => {
                    html += renderProjectNode(root, 0);
                });
            }
            html += `</div>`;
        }
        html += `</div>`;
    }

    // 3. Completed Projects Bucket (Archived / Greyed Out)
    if (completedRoots.length > 0 || appState.completedProjectsDrawerOpen) {
        html += `
            <div class="mt-4 pt-3 border-t border-slate-200/80">
                <button onclick="toggleCompletedProjectsDrawer()" class="w-full flex items-center justify-between text-xs font-bold text-slate-500 hover:text-slate-800 py-1 px-1 transition-colors">
                    <span class="flex items-center gap-1.5"><i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-600"></i> Completed Projects (${completedRoots.length})</span>
                    <i data-lucide="${appState.completedProjectsDrawerOpen ? 'chevron-down' : 'chevron-right'}" class="w-3.5 h-3.5 text-slate-400"></i>
                </button>
        `;
        if (appState.completedProjectsDrawerOpen) {
            html += `<div class="mt-2 space-y-1 opacity-80">`;
            if (completedRoots.length === 0) {
                html += `<p class="text-xs text-slate-400 italic py-1 px-1">No completed projects yet.</p>`;
            } else {
                completedRoots.forEach(root => {
                    html += `
                        <div class="flex items-center justify-between p-2 rounded-xl bg-slate-200/50 text-xs hover:bg-slate-200/80 transition-colors">
                            <span onclick="selectProject('${root.id}')" class="line-through text-slate-600 font-semibold truncate pr-2 cursor-pointer flex-1">${root.title}</span>
                            <div class="flex items-center gap-1 shrink-0">
                                <button onclick="openProjectRetrospective('${root.id}')" title="Post-Doc Summary" class="p-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 rounded-lg shadow-2xs"><i data-lucide="award" class="w-3.5 h-3.5"></i></button>
                                <button onclick="toggleCompleteProject('${root.id}', event)" title="Reopen" class="p-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg shadow-2xs"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i></button>
                            </div>
                        </div>
                    `;
                });
            }
            html += `</div>`;
        }
        html += `</div>`;
    }

    container.innerHTML = html;
    safeCreateIcons();
}

// --- Active Project Header Synchronizer ---
function renderActiveProjectHeader() {
    const p = getActiveProject();
    if (!p) return;

    // Breadcrumbs
    const crumbs = document.getElementById('project-breadcrumbs');
    if (crumbs) {
        let chain = [];
        let curr = p;
        while (curr) {
            chain.unshift(curr);
            curr = curr.parentId ? (appState.projects || []).find(x => x.id === curr.parentId) : null;
        }
        crumbs.innerHTML = chain.map((item, idx) => `
            <span onclick="selectProject('${item.id}')" class="cursor-pointer hover:text-brand-600 transition-colors ${idx === chain.length - 1 ? 'text-slate-700 font-extrabold' : ''}">${item.title}</span>
            ${idx < chain.length - 1 ? `<i data-lucide="chevron-right" class="w-3 h-3 text-slate-300"></i>` : ''}
        `).join('');
    }

    const tEl = document.getElementById('project-title-input');
    const gEl = document.getElementById('project-goal-input');
    const dEl = document.getElementById('project-deadline-input');
    const nEl = document.getElementById('project-notes-summary-input');
    const cumEl = document.getElementById('project-cumulative-timer');

    if (tEl && document.activeElement !== tEl) tEl.value = p.title || '';
    if (gEl && document.activeElement !== gEl) gEl.value = p.goal || '';
    if (dEl && document.activeElement !== dEl) dEl.value = p.deadline || '';
    if (nEl && document.activeElement !== nEl) nEl.value = p.notes || '';
    if (cumEl) cumEl.textContent = formatTimeCompact(getCumulativeTime(p.id));

    // Dynamic Complete / Post-Doc Header Button
    const completeBtn = document.getElementById('btn-toggle-project-complete');
    const completeLbl = document.getElementById('label-toggle-project-complete');
    if (completeBtn && completeLbl) {
        if (p.completedAt) {
            completeBtn.className = "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300";
            completeLbl.textContent = "View Post-Doc";
            completeBtn.onclick = () => openProjectRetrospective(p.id);
        } else {
            completeBtn.className = "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs bg-emerald-600 hover:bg-emerald-500 text-white";
            completeLbl.textContent = "Complete";
            completeBtn.onclick = toggleCompleteCurrentProject;
        }
    }
}

// --- Task Manager Component ---
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

    if (!p) {
        if (taskContainer) taskContainer.innerHTML = `<p class="text-xs text-slate-400 italic">No project active.</p>`;
        return;
    }

    if (titleSection) {
        titleSection.innerHTML = `<i data-lucide="list-todo" class="w-4 h-4 text-brand-500"></i> ${p.title} Tasks`;
    }

    const isParentNode = hasSubProjects(p.id);

    // Rule: Tasks live only at the lowest tier
    if (isParentNode) {
        if (milestoneHub) {
            milestoneHub.classList.remove('hidden');
            const subTracks = (appState.projects || []).filter(sp => sp.parentId === p.id);
            milestoneHub.innerHTML = `
                <div class="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 text-xs space-y-2">
                    <p class="font-bold text-indigo-900 flex items-center gap-1.5"><i data-lucide="info" class="w-4 h-4 text-brand-600"></i> Parent Milestone Hub</p>
                    <p class="text-slate-600">Tasks exist at leaf level. Select a sub-project below to direct focus:</p>
                    <div class="flex flex-wrap gap-2 pt-1">
                        ${subTracks.map(st => `
                            <button onclick="selectProject('${st.id}')" class="px-3 py-1.5 bg-white hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded-xl font-bold flex items-center gap-1 transition-colors">
                                <i data-lucide="arrow-right" class="w-3 h-3 text-brand-600"></i> ${st.title}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        if (taskContainer) taskContainer.innerHTML = '';
        if (addTaskContainer) addTaskContainer.classList.add('hidden');
        if (completedWrapper) completedWrapper.classList.add('hidden');
        if (taskProgressText) taskProgressText.textContent = `Parent Container`;
        safeCreateIcons();
        return;
    }

    if (milestoneHub) milestoneHub.classList.add('hidden');
    if (addTaskContainer) addTaskContainer.classList.remove('hidden');

    const tasks = p.tasks || [];
    const pendingTasks = tasks.filter(t => !t.isCompleted);
    const completedTasks = tasks.filter(t => t.isCompleted);

    if (taskProgressText) {
        taskProgressText.textContent = `${completedTasks.length}/${tasks.length} Completed`;
    }

    // Pending tasks
    if (taskContainer) {
        if (pendingTasks.length === 0) {
            taskContainer.innerHTML = `<div class="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400 italic">No active tasks. Add one below to kickstart momentum!</div>`;
        } else {
            taskContainer.innerHTML = pendingTasks.map(t => {
                const isCurrent = t.id === p.activeTaskId;
                const estText = t.estimatedTime > 0 ? `${Math.round(t.estimatedTime / 60)}m` : 'Open';
                const actualText = formatTimeCompact(t.actualTime);
                return `
                    <div onclick="selectTask('${t.id}')" class="group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${isCurrent ? 'bg-indigo-50/50 border-brand-400 ring-2 ring-brand-400/20 shadow-xs' : 'bg-white border-slate-200/80 hover:border-slate-300'}">
                        <div class="flex items-center gap-3 min-w-0 flex-1">
                            <input type="checkbox" onchange="toggleTaskComplete('${t.id}', event)" class="w-4 h-4 rounded text-brand-600 focus:ring-0 cursor-pointer">
                            <div class="flex flex-col min-w-0 flex-1">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-bold text-slate-800 truncate ${isCurrent ? 'text-brand-900' : ''}">${t.title}</span>
                                    ${isCurrent ? `<span class="px-2 py-0.2 bg-brand-500 text-white text-[9px] font-extrabold rounded-full uppercase tracking-wider">Active</span>` : ''}
                                </div>
                                <div class="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                                    <span>Spent: ${actualText}</span>
                                    <span>•</span>
                                    <span onclick="promptEditTaskEstimate('${t.id}', event)" class="hover:text-brand-600 cursor-pointer underline decoration-dotted" title="Click to adjust target">Target: ${estText}</span>
                                    ${t.deadline ? `<span>• Due: ${t.deadline}</span>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 shrink-0 ml-2">
                            <button onclick="deleteTask('${t.id}', event)" class="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // Completed tasks drawer
    if (completedWrapper && completedContainer) {
        if (completedTasks.length > 0) {
            completedWrapper.classList.remove('hidden');
            if (completedLabel) completedLabel.textContent = `Completed Tasks (${completedTasks.length})`;
            completedContainer.classList.toggle('hidden', !appState.completedTasksDrawerOpen);
            completedContainer.innerHTML = completedTasks.map(t => `
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/80 text-xs border border-slate-200/60 opacity-75">
                    <label class="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                        <input type="checkbox" checked onchange="toggleTaskComplete('${t.id}', event)" class="w-4 h-4 rounded text-emerald-600 focus:ring-0">
                        <span class="line-through text-slate-500 font-medium truncate">${t.title}</span>
                    </label>
                    <span class="text-[10px] font-mono text-slate-400 shrink-0 ml-2">${formatTimeCompact(t.actualTime)}</span>
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
    const inEst = document.getElementById('new-task-est-input');
    const title = inTitle.value.trim();
    const estMins = inEst.value === '' ? 0 : parseInt(inEst.value, 10);
    const p = getActiveProject();

    if (hasSubProjects(p.id)) {
        alert("Tasks only exist at the lowest project level.");
        return;
    }
    if (!title) return;
    if (isNaN(estMins) || estMins < 0) {
        alert("Invalid Target Time! Leave empty or use 0 for Open Ended.");
        inEst.focus();
        return;
    }

    p.tasks = p.tasks || [];
    const newTask = {
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
    };

    p.tasks.push(newTask);
    if (!p.activeTaskId) p.activeTaskId = newTask.id;
    inTitle.value = '';
    inEst.value = '';
    saveStateLocally();
    renderApp();
}

function selectTask(taskId) {
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
    if (confirm("Delete this task?")) {
        p.tasks = (p.tasks || []).filter(t => t.id !== taskId);
        if (p.activeTaskId === taskId) {
            const next = (p.tasks || []).find(t => !t.isCompleted);
            p.activeTaskId = next ? next.id : (p.tasks[0]?.id || null);
        }
        saveStateLocally();
        renderApp();
    }
}

// --- Target Estimate Update Handlers ---
function handleActiveTaskEstimateChange(newVal) {
    const task = getActiveTask();
    if (!task) return;

    if (task.isCompleted) {
        alert("Completed tasks cannot have their target estimate modified.");
        renderTimerVisuals();
        return;
    }

    const cleanMins = newVal === '' ? 0 : parseInt(newVal, 10);
    if (isNaN(cleanMins) || cleanMins < 0) {
        alert("Invalid Target Time! Enter 0 or leave blank for Open Ended.");
        renderTimerVisuals();
        return;
    }

    const targetSec = cleanMins * 60;
    if (targetSec === task.estimatedTime) return;

    // Prompt user confirmation if time has already accumulated
    if (task.actualTime > 0) {
        const proceed = confirm(`Are you sure you want to revise the estimated time?\n\nThis task already has ${formatTimeCompact(task.actualTime)} logged. Revising will adjust your time-accuracy calibration.`);
        if (!proceed) {
            renderTimerVisuals();
            return;
        }
    }

    task.estimatedTime = targetSec;
    saveStateLocally();
    renderApp();
}

function promptEditTaskEstimate(taskId, e) {
    if (e) e.stopPropagation();
    const p = getActiveProject();
    if (!p) return;
    const task = (p.tasks || []).find(t => t.id === taskId);
    if (!task) return;

    if (task.isCompleted) {
        alert("Completed tasks cannot have their target estimate modified.");
        return;
    }

    const currentMins = Math.round((task.estimatedTime || 0) / 60);
    const input = prompt(`Update target time (minutes) for "${task.title}":\n(Enter 0 for Open Ended)`, currentMins);
    if (input === null) return;

    const cleanMins = input.trim() === '' ? 0 : parseInt(input, 10);
    if (isNaN(cleanMins) || cleanMins < 0) {
        alert("Invalid target minutes.");
        return;
    }

    if (task.actualTime > 0 && cleanMins * 60 !== task.estimatedTime) {
        const proceed = confirm(`Are you sure you want to revise the estimated time?\n\nThis task already has ${formatTimeCompact(task.actualTime)} logged.`);
        if (!proceed) return;
    }

    task.estimatedTime = cleanMins * 60;
    saveStateLocally();
    renderApp();
}

// --- Active Task Stage & Visuals ---
function renderTimerVisuals() {
    const p = getActiveProject();
    const task = getActiveTask();

    const titleEl = document.getElementById('active-task-title');
    const zenTitleEl = document.getElementById('zen-active-task-title');
    const zenNotesEl = document.getElementById('zen-task-notes');
    const taskNotesEl = document.getElementById('active-task-notes');
    const taskDeadEl = document.getElementById('active-task-deadline');
    const estInput = document.getElementById('active-task-est-mins');

    if (task) {
        if (titleEl) titleEl.textContent = task.title;
        if (zenTitleEl) zenTitleEl.textContent = task.title;
        if (zenNotesEl) zenNotesEl.textContent = task.notes || 'No notes attached';
        if (taskNotesEl && document.activeElement !== taskNotesEl) taskNotesEl.value = task.notes || '';
        if (taskDeadEl && document.activeElement !== taskDeadEl) taskDeadEl.value = task.deadline || '';

        if (estInput && document.activeElement !== estInput) {
            estInput.value = task.estimatedTime > 0 ? Math.round(task.estimatedTime / 60) : '';
            estInput.disabled = !!task.isCompleted;
            estInput.classList.toggle('opacity-50', !!task.isCompleted);
        }

        updateTimerTexts(p, task);
    } else {
        if (titleEl) titleEl.textContent = 'Select a task to begin';
        if (zenTitleEl) zenTitleEl.textContent = 'Select a task to begin';
        if (zenNotesEl) zenNotesEl.textContent = 'No active task';
        if (taskNotesEl && document.activeElement !== taskNotesEl) taskNotesEl.value = '';
        if (taskDeadEl && document.activeElement !== taskDeadEl) taskDeadEl.value = '';
        if (estInput && document.activeElement !== estInput) {
            estInput.value = '';
            estInput.disabled = true;
        }
        document.getElementById('active-timer-display').textContent = '00:00:00';
        const zenDisp = document.getElementById('zen-timer-display');
        if (zenDisp) zenDisp.textContent = '00:00:00';
        document.getElementById('active-timer-estimate').textContent = 'No Target';
    }
}

// --- Timer Engine & Overtime Calculations ---
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
    const p = getActiveProject();
    const t = getActiveTask();
    if (!t || t.isCompleted) {
        if (isPlaying) forcePause();
        return;
    }

    t.actualTime += 1;
    p.totalTimeSpent += 1;
    appState.continuousFocusSeconds = (appState.continuousFocusSeconds || 0) + 1;

    // Hard boundary: Trigger compulsory 3-minute physical reset after 90 continuous minutes
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

    appState.activeTimerSession = null; // Clear live reload session

    if (activeSessionStart) {
        const durationSec = Math.round((Date.now() - activeSessionStart.getTime()) / 1000);
        const cappedDuration = Math.min(durationSec, 14400);
        logSessionTelemetry(getActiveTask()?.id, getActiveProject()?.id, cappedDuration, false);
        activeSessionStart = null;
    }

    renderTimerVisuals();
    saveStateLocally();
}

// Compulsory Break Runner (Unskippable 180s Lockdown)
function triggerCompulsoryBreak() {
    const overlay = document.getElementById('compulsory-break-overlay');
    const display = document.getElementById('break-countdown-display');
    const dismissBtn = document.getElementById('btn-dismiss-break');
    if (!overlay) return;

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');

    let remainingSeconds = 180;
    dismissBtn.disabled = true;
    dismissBtn.className = "w-full py-3 bg-slate-800 text-slate-500 font-bold text-xs rounded-xl cursor-not-allowed";
    dismissBtn.textContent = "Lockdown in Progress...";

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
            dismissBtn.textContent = "Break Complete — Resume FocusFlow";
        }
    }, 1000);
}

function dismissCompulsoryBreak() {
    const overlay = document.getElementById('compulsory-break-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
    }
    appState.continuousFocusSeconds = 0; // Reset hyperfocus counter
    saveStateLocally();
    renderApp();
}

// 3. Restore session across hard reload
window.addEventListener('DOMContentLoaded', () => {
    // If browser crashed or refreshed mid-timer, restore the exact delta
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
                console.info(`Recovered ${deltaSec}s of active focus from hard reload.`);
            }
        }
        appState.activeTimerSession = null; // Clean up until user manually clicks to restart
        saveStateLocally();
    }
});

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
        projectTitle: projObj ? projObj.title : 'General Project',
        startedAt: new Date(Date.now() - durationSec * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        durationSeconds: durationSec,
        mode: activeSessionMode || 'focus',
        completedTask: completed
    });
    saveStateLocally();
}

function completeActiveTask() {
    const t = getActiveTask();
    const p = getActiveProject();
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
    document.getElementById('active-timer-estimate').textContent = task.estimatedTime > 0 ? `Target: ${Math.round(task.estimatedTime / 60)}m` : 'Open ended';

    const zenDisplay = document.getElementById('zen-timer-display');
    if (zenDisplay) zenDisplay.textContent = formatTimeCompact(task.actualTime);

    const c = 930;
    const target = task.estimatedTime > 0 ? task.estimatedTime : 1800; // Open-ended defaults ring calibration to 30m
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

// --- Park & Momentum Anchoring Modal ---
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
            whereStopped: document.getElementById('park-stopped-input').value.trim() || 'Mid-flow work',
            next60sAction: document.getElementById('park-next60s-input').value.trim() || 'Resume central focus',
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

function renderResumptionBanner() {
    const mount = document.getElementById('resumption-banner-mount');
    if (!mount) return;
    const task = getActiveTask();
    if (!task || !task.lastParkedContext) {
        mount.innerHTML = '';
        return;
    }
    const ctx = task.lastParkedContext;
    mount.innerHTML = `
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div class="space-y-1">
                <div class="flex items-center gap-2">
                    <span class="p-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold flex items-center gap-1"><i data-lucide="anchor" class="w-3.5 h-3.5"></i> Anchor Resumed</span>
                    <span class="text-[11px] text-slate-500 font-mono">Stopped: ${ctx.whereStopped || 'Mid-work'}</span>
                </div>
                <p class="text-xs font-bold text-amber-950">Immediate 60s launchpad action: <span class="text-brand-600 font-semibold">${ctx.next60sAction || 'Continue flow'}</span></p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <button onclick="dismissLaunchpad()" class="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors">Dismiss</button>
                <button onclick="executeLaunchpadResume()" class="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow transition-colors flex items-center gap-1.5"><i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i> Launch</button>
            </div>
        </div>
    `;
    safeCreateIcons();
}

// --- Micro-Step Decomposer Engine ---
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
            <button onclick="deleteMicroStep('${s.id}')" class="text-slate-300 hover:text-rose-500 p-1">
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

// --- Mental RAM Dump (Scratchpad) ---
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
    if (hasSubProjects(p.id)) {
        alert("Select a leaf sub-project first.");
        return;
    }
    const newTask = {
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

// --- Companion & Mascot System (Reads from mascotDatabase in js/mascots.js) ---
function getAvailableMascots() {
    if (typeof mascotDatabase !== 'undefined' && Array.isArray(mascotDatabase) && mascotDatabase.length > 0) {
        return mascotDatabase;
    }
    if (typeof window !== 'undefined' && window.mascotDatabase && Array.isArray(window.mascotDatabase)) {
        return window.mascotDatabase;
    }
    return [
        { id: 'm-bunny', name: 'Bunny', emoji: '🐰', svg: '<span class="text-3xl">🐰</span>' }
    ];
}

function renderMascotGallery() {
    const grid = document.getElementById('mascot-gallery-grid');
    if (!grid) return;
    const p = getActiveProject();
    const activeMascotId = p ? p.activeMascotId : null;
    const mascots = getAvailableMascots();

    grid.innerHTML = mascots.map(m => {
        const isSelected = activeMascotId === m.id;
        return `
            <button onclick="selectCompanion('${m.id}')" class="p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 text-center ${isSelected ? 'bg-indigo-50 border-brand-500 ring-2 ring-brand-400 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-white'}">
                <div class="w-12 h-12 flex items-center justify-center pointer-events-none mascot-card-svg-wrapper">
                    ${m.svg || `<span class="text-2xl">${m.emoji || '🐾'}</span>`}
                </div>
                <span class="text-[10px] font-bold text-slate-700 truncate w-full px-1">${m.name}</span>
            </button>
        `;
    }).join('');
    safeCreateIcons();
}

function selectCompanion(id) {
    const p = getActiveProject();
    if (!p) return;
    p.activeMascotId = id;
    saveStateLocally();
    renderApp();
}

function removeCompanion() {
    const p = getActiveProject();
    if (!p) return;
    p.activeMascotId = null;
    saveStateLocally();
    renderApp();
}

function unlockAllMascotsTest() {
    alert("All companions unlocked for this session!");
}

function relockAllMascots() {
    alert("Companion progression reset.");
}

function renderActiveMascot() {
    const p = getActiveProject();
    const mascots = getAvailableMascots();
    const mascot = mascots.find(m => m.id === (p ? p.activeMascotId : null));
    const mainWrapper = document.getElementById('main-mascot-mount-wrapper');
    const mainMount = document.getElementById('main-mascot-mount');
    const zenRoam = document.getElementById('mascot-roam-wrapper');
    const zenMount = document.getElementById('zen-mascot-mount');

    if (mascot) {
        if (mainWrapper) mainWrapper.classList.remove('hidden');
        if (mainMount) {
            mainMount.innerHTML = mascot.svg || `<span class="text-3xl">${mascot.emoji || '🐾'}</span>`;
        }
        if (zenRoam) zenRoam.classList.remove('hidden');
        if (zenMount) {
            zenMount.innerHTML = mascot.svg || `<span class="text-5xl">${mascot.emoji || '🐾'}</span>`;
        }
    } else {
        if (mainWrapper) mainWrapper.classList.add('hidden');
        if (zenRoam) zenRoam.classList.add('hidden');
    }
}

function setMascotBehavior(behavior) {
    appState.mascotBehavior = behavior;
    const roam = document.getElementById('mascot-roam-wrapper');
    if (!roam) return;
    roam.classList.remove('mascot-roam', 'mascot-float');
    if (behavior === 'roam') roam.classList.add('mascot-roam');
    if (behavior === 'float') roam.classList.add('mascot-float');

    ['still', 'roam', 'float', 'sleep'].forEach(b => {
        const btn = document.getElementById(`btn-beh-${b}`);
        if (btn) {
            btn.className = b === behavior ? 'px-2.5 py-1 rounded bg-indigo-600 text-white shadow' : 'px-2 py-0.5 rounded text-slate-400';
        }
    });
    saveStateLocally();
}

function setMascotScale(scale) {
    appState.mascotScale = scale;
    const wrapper = document.getElementById('mascot-scale-wrapper');
    if (wrapper) wrapper.style.transform = `scale(${scale})`;
    saveStateLocally();
}

function triggerMascotAnim(anim) {
    const target = document.getElementById('mascot-anim-wrapper');
    if (!target) return;
    target.classList.remove('anim-hop', 'anim-squish', 'anim-frontflip');
    void target.offsetWidth;
    target.classList.add(`anim-${anim}`);
}

function triggerEmote(emote) {
    const pop = document.getElementById('emote-pop-container');
    if (!pop) return;
    pop.classList.remove('anim-emote');
    void pop.offsetWidth;
    pop.classList.add('anim-emote');
}

// --- Zen View Controller ---
function openZenView() {
    syncHeaderInputsToState();
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

// --- Backdrop Designer ---
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

// --- Popovers & Guide Modals ---
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
        const p = getActiveProject();
        const ta = document.getElementById('project-full-notes-textarea');
        if (ta && p) ta.value = p.notes || '';
    }
}

function saveFullProjectNotes() {
    const p = getActiveProject();
    const ta = document.getElementById('project-full-notes-textarea');
    if (p && ta) {
        p.notes = ta.value;
        const summary = document.getElementById('project-notes-summary-input');
        if (summary) summary.value = ta.value;
        saveStateLocally();
    }
    toggleProjectNotesModal();
}

// --- Global Theme Controller ---
const AVAILABLE_THEMES = [
    { id: 'light', name: 'Light', desc: 'Default Slate & Indigo', dot: '#ffffff', border: '#cbd5e1' },
    { id: 'dark', name: 'Dark', desc: 'Midnight Obsidian', dot: '#090d16', border: '#6366f1' },
    { id: 'earth', name: 'Earth Tones', desc: 'Forest Moss & Sage', dot: '#101511', border: '#34d399' },
    { id: 'fire', name: 'Fire Tones', desc: 'Ember & Terracotta', dot: '#140d0a', border: '#f97316' }
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
    const isHidden = popover.classList.contains('hidden');
    if (isHidden) {
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
            <button onclick="setAppTheme('${t.id}')" class="w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${isActive ? 'ring-2 ring-brand-500 border-transparent bg-brand-50/40 font-bold' : 'border-slate-200 hover:bg-slate-100/60'}">
                <div class="flex items-center gap-2.5">
                    <span class="w-5 h-5 rounded-full border shadow-xs shrink-0" style="background-color: ${t.dot}; border-color: ${t.border};"></span>
                    <div>
                        <div class="text-xs font-bold leading-tight">${t.name}</div>
                        <div class="text-[10px] text-slate-400 font-normal">${t.desc}</div>
                    </div>
                </div>
                ${isActive ? '<i data-lucide="check" class="w-4 h-4 text-brand-600 shrink-0"></i>' : ''}
            </button>
        `;
    }).join('');
    safeCreateIcons();
}

// Close theme popover if clicking outside
document.addEventListener('click', (e) => {
    const popover = document.getElementById('theme-popover');
    const trigger = e.target.closest('[onclick*="toggleThemePopover"]');
    if (popover && !popover.classList.contains('hidden') && !popover.contains(e.target) && !trigger) {
        closeThemePopover();
    }
});


// --- Master Application Render Loop ---
function renderApp() {
    renderSidebar();
    renderActiveProjectHeader();
    renderTasks();
    renderMicroSteps(getActiveTask());
    renderResumptionBanner();
    renderTimerVisuals();
    renderMascotGallery();
    renderActiveMascot();
    updateSprintCycleUI();
    safeCreateIcons();
}

// --- Initialization & Event Bindings ---
window.addEventListener('DOMContentLoaded', () => {
    // Apply saved visual theme immediately on startup
    const savedTheme = appState.theme || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateBloomOpacity(appState.bloomOpacity || 60);
    const volSlider = document.getElementById('volume-slider');
    if (volSlider) volSlider.value = appState.audioVolume || 80;
    const volLabel = document.getElementById('volume-label');
    if (volLabel) volLabel.textContent = (appState.audioVolume || 80) + '%';
    const famSelect = document.getElementById('audio-family-select');
    if (famSelect) famSelect.value = appState.audioFamily || 'woodblock';

    // Live sync project header inputs
    ['project-title-input', 'project-goal-input', 'project-deadline-input', 'project-notes-summary-input'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                syncHeaderInputsToState();
                saveStateLocally();
            });
        }
    });

    // Active task details autosave
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

    // Enter key shortcuts for fast task entry
    const newTaskInput = document.getElementById('new-task-title-input');
    const newEstInput = document.getElementById('new-task-est-input');
    [newTaskInput, newEstInput].forEach(inp => {
        if (inp) {
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') handleAddTask();
            });
        }
    });

    renderApp();
});
