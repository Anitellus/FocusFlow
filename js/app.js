// --- Focus Flow Core Coordinator (js/app.js) ---

let isPlaying = false, timerInterval = null, tickCounter = 0, currentView = 'focus';
let jitterAudioTimer = null;
let activeSessionStart = null, activeSessionMode = 'focus';
let visibilityTimeout = null;

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
    return (appState.projects || []).filter(p => !p.parentId && !p.isParked); 
}

function getParkedRootProjects() { 
    return (appState.projects || []).filter(p => !p.parentId && p.isParked); 
}

// --- View Router ---
function switchView(viewName) {
    currentView = viewName;
    const focusContainer = document.getElementById('view-focus-container');
    const calContainer = document.getElementById('view-calendar-container');
    const analyticsContainer = document.getElementById('view-analytics-container');

    const navFocus = document.getElementById('nav-focus');
    const navCal = document.getElementById('nav-calendar');
    const navAnalytics = document.getElementById('nav-analytics');

    if (focusContainer) focusContainer.classList.toggle('hidden', viewName !== 'focus');
    if (calContainer) calContainer.classList.toggle('hidden', viewName !== 'calendar');
    if (analyticsContainer) analyticsContainer.classList.toggle('hidden', viewName !== 'analytics');

    const activeNavClass = "flex-1 py-1.5 rounded-xl text-xs font-bold bg-white text-brand-600 shadow-sm ring-1 ring-slate-200 transition-all flex justify-center items-center gap-1";
    const inactiveNavClass = "flex-1 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all flex justify-center items-center gap-1";

    if (navFocus) navFocus.className = viewName === 'focus' ? activeNavClass : inactiveNavClass;
    if (navCal) navCal.className = viewName === 'calendar' ? activeNavClass : inactiveNavClass;
    if (navAnalytics) navAnalytics.className = viewName === 'analytics' ? activeNavClass : inactiveNavClass;

    if (viewName === 'calendar' && typeof renderCalendarView === 'function') {
        renderCalendarView();
    } else if (viewName === 'analytics' && typeof renderAnalytics === 'function') {
        renderAnalytics(30);
    } else if (viewName === 'focus') {
        renderApp();
    }
    safeCreateIcons();
}

// --- Sprint / Novelty Cycle Engine ---
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

// --- Drawer & Modal Toggles ---
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
        id, parentId: parentId, title: projectTitle, goal: '', deadline: '', notes: '',
        isParked: makeParked, totalTimeSpent: 0, 
        activeTaskId: tasksToMigrate.length > 0 ? tasksToMigrate[0].id : null, 
        activeMascotId: null, unlockAllMascotsTest: false,
        createdAt: new Date().toISOString(), completedAt: null, tasks: tasksToMigrate
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
        if (appState.projects.length === 0) loadDefaultData();
        else if (toDelete.has(appState.activeProjectId)) {
            const activeRoots = getActiveRootProjects();
            appState.activeProjectId = activeRoots.length > 0 ? activeRoots[0].id : appState.projects[0].id;
        }
        saveStateLocally(); 
        renderApp();
    }
}

// --- Sidebar View Component ---
function renderSidebar() {
    const container = document.getElementById('project-list-container');
    if (!container) return;

    const activeRoots = getActiveRootProjects();
    const parkedRoots = getParkedRootProjects();
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
                                <span class="truncate text-xs">${proj.title || 'Untitled Project'}</span>
                                <span class="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${depth === 0 ? 'bg-slate-200/80 text-slate-600' : (depth === 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-brand-100 text-brand-700')}">${tierBadge}</span>
                            </div>
                            <span class="text-[10px] text-slate-400 font-mono font-normal">
                                ${children.length > 0 ? `${children.length} sub-track(s)` : `${completedTasks}/${leafTasks.length} done`} • ${formatTimeCompact(cumulativeSec)}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        ${depth < 2 ? `
                            <button onclick="event.stopPropagation(); createNewProject('${proj.id}')" title="Add Sub-Track" class="p-1 hover:bg-slate-200 text-slate-500 rounded-lg">
                                <i data-lucide="plus" class="w-3 h-3"></i>
                            </button>
                        ` : ''}
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

    // Active Sprint Containers
    html += `<div class="space-y-1">`;
    html += `<div class="flex items-center justify-between px-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider"><span>Active Sprint</span><span>${activeRoots.length}/4 Max</span></div>`;
    if (activeRoots.length === 0) {
        html += `<p class="text-xs text-slate-400 italic py-2 px-1">No active projects. Click "New Project" to start.</p>`;
    } else {
        activeRoots.forEach(root => {
            html += renderProjectNode(root, 0);
        });
    }
    html += `</div>`;

    // Parking Lot Containers
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

    container.innerHTML = html;
    safeCreateIcons();
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
                    <p class="font-bold text-indigo-900 flex items-center gap-1.5"><i data-lucide="info" class="w-4 h-4 text-brand-600"></i> Parent Project Milestone Overview</p>
                    <p class="text-slate-600">This container organizes child tracks. Select a leaf sub-project below to manage atomic tasks:</p>
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
                                    <span>Target: ${estText}</span>
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

// --- Active Project & Header Synchronizer ---
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

    if (task) {
        if (titleEl) titleEl.textContent = task.title;
        if (zenTitleEl) zenTitleEl.textContent = task.title;
        if (zenNotesEl) zenNotesEl.textContent = task.notes || 'No notes attached';
        if (taskNotesEl && document.activeElement !== taskNotesEl) taskNotesEl.value = task.notes || '';
        if (taskDeadEl && document.activeElement !== taskDeadEl) taskDeadEl.value = task.deadline || '';
        updateTimerTexts(p, task);
    } else {
        if (titleEl) titleEl.textContent = 'Select a task to begin';
        if (zenTitleEl) zenTitleEl.textContent = 'Select a task to begin';
        if (zenNotesEl) zenNotesEl.textContent = 'No active task';
        if (taskNotesEl && document.activeElement !== taskNotesEl) taskNotesEl.value = '';
        if (taskDeadEl && document.activeElement !== taskDeadEl) taskDeadEl.value = '';
        document.getElementById('active-timer-display').textContent = '00:00:00';
        const zenDisp = document.getElementById('zen-timer-display');
        if (zenDisp) zenDisp.textContent = '00:00:00';
        document.getElementById('active-timer-estimate').textContent = 'No Target';
    }
}

// --- Resumption Launchpad Banner ---
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

// --- Companion & Mascot System ---
const BUILT_IN_MASCOTS = [
    { id: 'm-shiba', name: 'Shiba Inu', emoji: '🐕', color: '#f59e0b' },
    { id: 'm-cat', name: 'Focus Cat', emoji: '🐱', color: '#6366f1' },
    { id: 'm-capy', name: 'Capybara', emoji: '🦫', color: '#10b981' },
    { id: 'm-owl', name: 'Zen Owl', emoji: '🦉', color: '#8b5cf6' },
    { id: 'm-bot', name: 'Flow Bot', emoji: '🤖', color: '#06b6d4' }
];

function renderMascotGallery() {
    const grid = document.getElementById('mascot-gallery-grid');
    if (!grid) return;
    const p = getActiveProject();
    const activeMascotId = p ? p.activeMascotId : null;

    grid.innerHTML = BUILT_IN_MASCOTS.map(m => {
        const isSelected = activeMascotId === m.id;
        return `
            <button onclick="selectCompanion('${m.id}')" class="p-3 rounded-2xl border transition-all flex flex-col items-center gap-1.5 ${isSelected ? 'bg-indigo-50 border-brand-500 ring-2 ring-brand-400 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-white'}">
                <span class="text-2xl">${m.emoji}</span>
                <span class="text-[10px] font-bold text-slate-700">${m.name}</span>
            </button>
        `;
    }).join('');
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
    const mascot = BUILT_IN_MASCOTS.find(m => m.id === (p ? p.activeMascotId : null));
    const mainWrapper = document.getElementById('main-mascot-mount-wrapper');
    const mainMount = document.getElementById('main-mascot-mount');
    const zenRoam = document.getElementById('mascot-roam-wrapper');
    const zenMount = document.getElementById('zen-mascot-mount');

    if (mascot) {
        if (mainWrapper) mainWrapper.classList.remove('hidden');
        if (mainMount) mainMount.innerHTML = `<span class="text-3xl">${mascot.emoji}</span>`;
        if (zenRoam) zenRoam.classList.remove('hidden');
        if (zenMount) zenMount.innerHTML = `<span class="text-5xl">${mascot.emoji}</span>`;
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

// --- Zen Mode Controller ---
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
    appState.bloomOpacity = parseInt(val);
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
    // Sync state settings into controls
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
            if (t) { t.notes = e.target.value; saveStateLocally(); }
        });
    }

    const taskDeadline = document.getElementById('active-task-deadline');
    if (taskDeadline) {
        taskDeadline.addEventListener('change', (e) => {
            const t = getActiveTask();
            if (t) { t.deadline = e.target.value; saveStateLocally(); }
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
