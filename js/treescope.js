// ============================================================================
// Focus Flow | Interactive Architect WBS Board & Slicer (js/treescope.js)
// ============================================================================

const TreeScopeEngine = {
    isFitScreen: true,
    columnLayout: [], // Array of columns: [ [subId1], [subId2, subId3] ]
    combiningSubId: null,
    activeProjectId: null,
    isFullscreen: false,
    currentDepth: '3', // Default: Show Phases, Tracks & Slices immediately

    open() {
        enterArchitectMode('map');
    },

    close() {
        if (this.isFullscreen) {
            this.toggleFullscreen();
        } else {
            enterOperatorMode();
        }
    },

    getActiveProjectObj() {
        const activeProj = getActiveProject();
        const root = activeProj ? getRootProject(activeProj) : (appState.projects || [])[0];
        if (!this.activeProjectId && root) this.activeProjectId = root.id;
        const found = (appState.projects || []).find(p => p.id === this.activeProjectId);
        if (found && !found.parentId) return found;
        this.activeProjectId = root ? root.id : null;
        return root || (appState.projects || [])[0];
    },

    getSubProjects(rootId) {
        return (appState.projects || []).filter(p => p.parentId === rootId);
    },

    getComponentProjects(subId) {
        return (appState.projects || []).filter(p => p.parentId === subId);
    },

    populateProjectSelector() {
        const select = document.getElementById('map-project-select');
        if (!select) return;
        const roots = (appState.projects || []).filter(p => !p.parentId);
        select.innerHTML = roots.map(r => `
            <option value="${r.id}" ${r.id === this.activeProjectId ? 'selected' : ''}>
                ${r.title} ${r.slotRole === 'headliner' ? '★' : (r.slotRole === 'copilot' ? '⚡' : (r.isParked ? '(Parked)' : ''))}
            </option>
        `).join('');
    },

    switchProject(rootId) {
        this.activeProjectId = rootId;
        this.combiningSubId = null;
        this.initLayout();
        this.render();
    },

    promptAddSubProject() {
        const root = this.getActiveProjectObj();
        if (!root) return;
        const name = prompt(`Add a new Phase / Sub-Project inside "${root.title}":`);
        if (!name || !name.trim()) return;

        let tasksToMigrate = [];
        if (root.tasks && root.tasks.length > 0) {
            tasksToMigrate = [...root.tasks];
            root.tasks = [];
            root.activeTaskId = null;
        }

        const newSub = {
            id: 'proj-' + generateId(),
            parentId: root.id,
            title: name.trim(),
            goal: '',
            deadline: '',
            notes: '',
            retrospectiveNotes: '',
            isParked: false,
            totalTimeSpent: 0,
            activeTaskId: tasksToMigrate[0]?.id || null,
            activeMascotId: null,
            createdAt: new Date().toISOString(),
            completedAt: null,
            tasks: tasksToMigrate
        };

        appState.projects.push(newSub);
        if (!root.activePhaseId) root.activePhaseId = newSub.id;
        this.initLayout();
        saveStateLocally();
        this.render();
    },

    promptAddComponentTrack(subId, e) {
        if (e) e.stopPropagation();
        const sub = (appState.projects || []).find(p => p.id === subId);
        if (!sub) return;
        const name = prompt(`Add a Component Track inside "${sub.title}":`);
        if (!name || !name.trim()) return;

        let tasksToMigrate = [];
        if (sub.tasks && sub.tasks.length > 0) {
            tasksToMigrate = [...sub.tasks];
            sub.tasks = [];
            sub.activeTaskId = null;
        }

        const newComp = {
            id: 'proj-' + generateId(),
            parentId: sub.id,
            title: name.trim(),
            goal: '',
            deadline: '',
            notes: '',
            retrospectiveNotes: '',
            isParked: false,
            totalTimeSpent: 0,
            activeTaskId: tasksToMigrate[0]?.id || null,
            activeMascotId: null,
            createdAt: new Date().toISOString(),
            completedAt: null,
            tasks: tasksToMigrate
        };

        appState.projects.push(newComp);
        saveStateLocally();
        this.render();
    },

    addTaskToContainer(containerId) {
        const input = document.getElementById(`ts-add-input-${containerId}`);
        const typeSel = document.getElementById(`ts-add-type-${containerId}`);
        const title = input?.value.trim();
        const readiness = typeSel?.value || 'slice';
        if (!title) return;

        const container = (appState.projects || []).find(p => p.id === containerId);
        if (!container) return;

        const root = getRootProject(container);
        const currentOnDeck = root ? getOnDeckTasksForRoot(root.id).length : 0;

        container.tasks = container.tasks || [];
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

        container.tasks.push(newTask);
        if (!container.activeTaskId) container.activeTaskId = newTask.id;
        saveStateLocally();
        this.render();
    },

    setActivePhase(subId, e) {
        if (e) e.stopPropagation();
        const root = this.getActiveProjectObj();
        if (!root) return;
        root.activePhaseId = subId;

        const leaves = getLeafProjects(subId);
        if (leaves.length > 0) {
            appState.activeProjectId = leaves[0].id;
        } else {
            appState.activeProjectId = subId;
        }
        saveStateLocally();
        this.render();
    },

    initLayout() {
        const subs = this.getSubProjects(this.activeProjectId);
        if (subs.length <= 2) {
            this.columnLayout = subs.map(s => [s.id]);
            return;
        }
        const half = Math.ceil(subs.length / 2);
        const newLayout = [];
        for (let i = 0; i < half; i++) {
            const col = [subs[i].id];
            if (i + half < subs.length) col.push(subs[i + half].id);
            newLayout.push(col);
        }
        this.columnLayout = newLayout;
    },

    render() {
        const root = this.getActiveProjectObj();
        const stage = document.getElementById('map-visualizer-stage');
        if (!stage || !root) return;

        this.populateProjectSelector();

        const onDeckPill = document.getElementById('map-ondeck-pill');
        if (onDeckPill) {
            const count = getOnDeckTasksForRoot(root.id).length;
            onDeckPill.textContent = `⭐ On Deck: ${count}/3`;
        }

        const goalTooltipText = document.getElementById('map-goal-tooltip-text');
        const goalBtn = document.getElementById('map-goal-btn');
        const goalStr = root.goal || 'No North Star Goal defined for this project.';
        if (goalTooltipText) goalTooltipText.textContent = goalStr;
        if (goalBtn) goalBtn.setAttribute('title', goalStr);

        this.updateFitScreenUI();

        stage.innerHTML = '';
        const container = document.createElement('div');
        container.className = `ts-columns-container ${this.isFitScreen ? 'fit-screen' : 'scroll-mode'}`;
        container.id = 'tsBoardContainer';

        const subs = this.getSubProjects(root.id);

        if (subs.length === 0) {
            container.innerHTML = `
                <div class="ts-board-column" style="flex: 1; max-width: 580px; margin: auto;">
                    <div class="ts-subproject-tile active-phase-tile">
                        <div class="ts-tile-header">
                            <span class="ts-tile-title font-bold text-[#38bdf8]">${root.title} — Slices</span>
                            <span class="badge font-mono-code text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">${(root.tasks || []).length} slices</span>
                        </div>
                        <div class="ts-tile-body">
                            ${this.renderTaskListHTML(root.tasks || [], root.id)}
                            ${this.renderInlineTaskAdderHTML(root.id)}
                        </div>
                    </div>
                </div>
            `;
            stage.appendChild(container);
            safeCreateIcons();
            return;
        }

        // Sync columnLayout if sub-projects were added or removed
        const validSubIds = new Set(subs.map(s => s.id));
        this.columnLayout = this.columnLayout
            .map(col => col.filter(id => validSubIds.has(id)))
            .filter(col => col.length > 0);
        const placedIds = new Set(this.columnLayout.flat());
        subs.forEach(s => {
            if (!placedIds.has(s.id)) this.columnLayout.push([s.id]);
        });

        this.columnLayout.forEach((colSubIds, colIndex) => {
            const col = document.createElement('div');
            col.className = 'ts-board-column';
            col.setAttribute('data-col-index', colIndex);

            col.addEventListener('dragover', (e) => {
                e.preventDefault();
                col.classList.add('drop-target');
            });
            col.addEventListener('dragleave', () => col.classList.remove('drop-target'));
            col.addEventListener('drop', (e) => {
                e.preventDefault();
                col.classList.remove('drop-target');
                const draggedId = e.dataTransfer.getData('text/plain');
                if (draggedId) TreeScopeEngine.moveSubProjectToColumn(draggedId, colIndex);
            });

            col.addEventListener('click', () => {
                if (TreeScopeEngine.combiningSubId) {
                    TreeScopeEngine.moveSubProjectToColumn(TreeScopeEngine.combiningSubId, colIndex);
                    TreeScopeEngine.combiningSubId = null;
                    TreeScopeEngine.render();
                }
            });

            colSubIds.forEach(subId => {
                const sub = subs.find(s => s.id === subId);
                if (!sub) return;

                const comps = TreeScopeEngine.getComponentProjects(sub.id);
                let taskCount = (sub.tasks || []).length;
                comps.forEach(c => { taskCount += (c.tasks || []).length; });
                const isStacked = colSubIds.length > 1;
                const isActivePhase = root.activePhaseId === sub.id;

                const tile = document.createElement('div');
                tile.className = `ts-subproject-tile ${isActivePhase ? 'active-phase-tile' : ''} ${TreeScopeEngine.combiningSubId === sub.id ? 'combine-source' : ''}`;
                tile.id = `ts-sub-tile-${sub.id}`;

                const header = document.createElement('div');
                header.className = 'ts-tile-header';
                header.draggable = true;

                header.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', sub.id);
                    tile.style.opacity = '0.5';
                });
                header.addEventListener('dragend', () => { tile.style.opacity = '1'; });

                header.innerHTML = `
                    <div class="flex items-center gap-2 overflow-hidden">
                        <span class="text-[#38bdf8] text-xs cursor-pointer select-none" onclick="TreeScopeEngine.toggleSubTile('${sub.id}', event)">▼</span>
                        <span class="text-xs font-bold ${isActivePhase ? 'text-emerald-300' : 'text-[#38bdf8]'} truncate" title="${sub.title}">${sub.title}</span>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                        <button onclick="TreeScopeEngine.setActivePhase('${sub.id}', event)" title="Set as Active Phase" class="px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${isActivePhase ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/50' : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'}">
                            ${isActivePhase ? '● Active' : 'Focus'}
                        </button>
                        <button onclick="TreeScopeEngine.promptAddComponentTrack('${sub.id}', event)" title="Add Component Track" class="px-1.5 py-0.5 rounded bg-white/5 hover:bg-[#1e2d4a] text-[10px] text-slate-300 border border-white/10 cursor-pointer">+ Track</button>
                        <span class="text-[10px] font-mono-code font-bold px-1.5 py-0.2 rounded bg-white/10 text-slate-400">${taskCount}</span>
                        ${isStacked ? `
                            <button class="px-1.5 py-0.5 rounded bg-white/5 hover:bg-[#1e2d4a] text-[10px] text-slate-300 border border-white/10 cursor-pointer" onclick="TreeScopeEngine.separateSubProject('${sub.id}', event)" title="Separate">⤢</button>
                        ` : `
                            <button class="px-1.5 py-0.5 rounded bg-white/5 hover:bg-[#1e2d4a] text-[10px] text-slate-300 border border-white/10 cursor-pointer" onclick="TreeScopeEngine.startCombine('${sub.id}', event)" title="Stack with another column">⤹</button>
                        `}
                    </div>
                `;
                tile.appendChild(header);

                const body = document.createElement('div');
                body.className = 'ts-tile-body';
                body.id = `ts-sub-body-${sub.id}`;

                if (comps.length === 0) {
                    body.innerHTML = `
                        ${TreeScopeEngine.renderTaskListHTML(sub.tasks || [], sub.id)}
                        ${TreeScopeEngine.renderInlineTaskAdderHTML(sub.id)}
                    `;
                } else {
                    comps.forEach(comp => {
                        const compTasks = comp.tasks || [];
                        const compNode = document.createElement('div');
                        compNode.className = 'ts-tree-node ts-comp-node';
                        compNode.id = `ts-comp-node-${comp.id}`;

                        compNode.innerHTML = `
                            <div class="ts-tree-row" onclick="TreeScopeEngine.toggleCompNode('${comp.id}', event)">
                                <span class="text-[#94a3b8] text-[10px] select-none ts-comp-toggle">▼</span>
                                <span class="text-[#818cf8] font-bold text-xs truncate" title="${comp.title}">📦 ${comp.title}</span>
                                <span class="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-white/5 text-slate-400 ml-auto">${compTasks.length}</span>
                            </div>
                            <div class="ts-tree-children ts-comp-children" id="ts-comp-children-${comp.id}">
                                ${TreeScopeEngine.renderTaskListHTML(compTasks, comp.id)}
                                ${TreeScopeEngine.renderInlineTaskAdderHTML(comp.id)}
                            </div>
                        `;
                        body.appendChild(compNode);
                    });
                }

                tile.appendChild(body);
                col.appendChild(tile);
            });

            container.appendChild(col);
        });

        stage.appendChild(container);
        const depthVal = document.getElementById('map-depth-select')?.value || this.currentDepth || '3';
        this.applyDepthFilter(depthVal);
        safeCreateIcons();
    },

    renderInlineTaskAdderHTML(containerId) {
        return `
            <div class="mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5" onclick="event.stopPropagation()">
                <input type="text" id="ts-add-input-${containerId}" onkeydown="if(event.key==='Enter') TreeScopeEngine.addTaskToContainer('${containerId}')" class="flex-1 bg-[#0b1120] border border-[#263554] rounded-lg px-2.5 py-1.5 text-[11px] text-slate-100 placeholder-slate-500 outline-none focus:border-[#38bdf8]" placeholder="+ Add slice or boulder...">
                <select id="ts-add-type-${containerId}" class="bg-[#0b1120] border border-[#263554] rounded-lg px-1.5 py-1.5 text-[10px] font-bold text-slate-300 outline-none">
                    <option value="slice">⚡</option>
                    <option value="spike">🔍</option>
                    <option value="boulder">🐘</option>
                </select>
                <button onclick="TreeScopeEngine.addTaskToContainer('${containerId}')" class="px-2.5 py-1.5 bg-[#1e2d4a] hover:bg-[#2a3f66] text-[#38bdf8] rounded-lg text-[11px] font-bold cursor-pointer">Add</button>
            </div>
        `;
    },

    renderTaskListHTML(tasks, containerId) {
        if (!tasks || tasks.length === 0) {
            return `<div class="p-2 text-[11px] text-slate-500 italic">No slices yet — add one below.</div>`;
        }

        return tasks.map(t => {
            const microsteps = t.microSteps || [];
            const rType = getTaskReadiness(t);
            const rIcon = rType === 'spike' ? '🔍' : (rType === 'boulder' ? '🐘' : '⚡');

            return `
                <div class="ts-tree-node ts-task-node my-1" id="ts-task-node-${t.id}">
                    <div class="ts-tree-row" onclick="TreeScopeEngine.toggleTaskNode('${t.id}', event)">
                        <span class="text-[#94a3b8] text-[9px] select-none ts-task-toggle">▼</span>
                        <span class="text-xs font-semibold truncate ${t.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}" title="${t.title}">${rIcon} ${t.title}</span>
                        <div class="flex items-center gap-1 ml-auto shrink-0">
                            ${!t.isCompleted ? `
                                <button onclick="toggleTaskOnDeck('${containerId}', '${t.id}', event)" title="${t.isOnDeck ? 'On Deck (Click to unstar)' : 'Put On Deck (Max 3)'}" class="px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${t.isOnDeck ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50' : 'bg-white/5 text-slate-400 hover:text-amber-300'}">★</button>
                                <button onclick="event.stopPropagation(); openTaskSlicerModal('${containerId}', '${t.id}')" title="Slice into smaller tasks" class="px-1.5 py-0.5 rounded bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-[10px] cursor-pointer">🔪</button>
                                <button onclick="TreeScopeEngine.focusTask('${containerId}', '${t.id}', event)" title="Execute in Operator Mode" class="px-1.5 py-0.5 rounded bg-emerald-500/15 hover:bg-emerald-500/35 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 cursor-pointer">🎯</button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="ts-tree-children ts-task-children space-y-1" id="ts-task-children-${t.id}">
                        ${t.notes ? `<div class="text-[10px] text-slate-400 italic mb-1 leading-snug">${t.notes}</div>` : ''}
                        ${microsteps.map((m) => `
                            <label class="ts-microtask-item ${m.isCompleted ? 'checked' : ''}">
                                <input type="checkbox" ${m.isCompleted ? 'checked' : ''} onchange="TreeScopeEngine.toggleMicroStep('${containerId}', '${t.id}', '${m.id}', this.checked)">
                                <span>${m.title}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    },

    toggleFitScreen() {
        this.isFitScreen = !this.isFitScreen;
        this.updateFitScreenUI();
        const container = document.getElementById('tsBoardContainer');
        if (container) {
            container.className = `ts-columns-container ${this.isFitScreen ? 'fit-screen' : 'scroll-mode'}`;
        }
    },

    updateFitScreenUI() {
        const btn = document.getElementById('map-toggle-fit-btn');
        const dot = document.getElementById('map-fit-dot');
        if (dot) {
            dot.className = this.isFitScreen
                ? "w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] transition-all"
                : "w-2 h-2 rounded-full bg-slate-500 shadow-none transition-all";
        }
        if (btn) {
            btn.className = this.isFitScreen
                ? "px-2.5 py-1 bg-[#182236] text-[#38bdf8] border border-[#38bdf8] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                : "px-2.5 py-1 bg-[#131c31] text-slate-400 border border-[#263554] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer";
        }
    },

    toggleFullscreen() {
        const container = document.getElementById('view-map-container');
        if (!container) return;
        this.isFullscreen = !this.isFullscreen;
        container.classList.toggle('map-fullscreen', this.isFullscreen);

        const label = document.getElementById('map-fullscreen-label');
        const icon = document.getElementById('map-fullscreen-icon');
        if (label) label.textContent = this.isFullscreen ? "Exit" : "Fullscreen";
        if (icon) icon.setAttribute('data-lucide', this.isFullscreen ? "minimize-2" : "maximize-2");
        safeCreateIcons();
    },

    autoStackColumns() {
        const subs = this.getSubProjects(this.activeProjectId);
        const half = Math.ceil(subs.length / 2);
        const newLayout = [];
        for (let i = 0; i < half; i++) {
            const col = [subs[i].id];
            if (i + half < subs.length) col.push(subs[i + half].id);
            newLayout.push(col);
        }
        this.columnLayout = newLayout;
        this.render();
    },

    resetLayout() {
        this.combiningSubId = null;
        const subs = this.getSubProjects(this.activeProjectId);
        this.columnLayout = subs.map(s => [s.id]);
        this.render();
    },

    moveSubProjectToColumn(subId, targetColIndex) {
        this.columnLayout = this.columnLayout.map(col => col.filter(id => id !== subId)).filter(col => col.length > 0);
        if (this.columnLayout[targetColIndex]) {
            this.columnLayout[targetColIndex].push(subId);
        } else {
            this.columnLayout.push([subId]);
        }
        this.render();
    },

    separateSubProject(subId, event) {
        if (event) event.stopPropagation();
        this.columnLayout = this.columnLayout.map(col => col.filter(id => id !== subId)).filter(col => col.length > 0);
        this.columnLayout.push([subId]);
        this.render();
    },

    startCombine(subId, event) {
        if (event) event.stopPropagation();
        this.combiningSubId = (this.combiningSubId === subId) ? null : subId;
        this.render();
    },

    applyDepthFilter(depth) {
        this.currentDepth = depth;
        const bodies = document.querySelectorAll('.ts-tile-body');
        const compChildren = document.querySelectorAll('.ts-comp-children');
        const taskChildren = document.querySelectorAll('.ts-task-children');

        if (depth === '1' || depth === 'collapse') {
            bodies.forEach(el => el.style.display = 'none');
            compChildren.forEach(el => el.style.display = 'none');
            taskChildren.forEach(el => el.style.display = 'none');
        } else if (depth === '2') {
            bodies.forEach(el => el.style.display = 'flex');
            compChildren.forEach(el => el.style.display = 'none');
            taskChildren.forEach(el => el.style.display = 'none');
        } else if (depth === '3') {
            bodies.forEach(el => el.style.display = 'flex');
            compChildren.forEach(el => el.style.display = 'block');
            taskChildren.forEach(el => el.style.display = 'none');
        } else if (depth === '4' || depth === 'all') {
            bodies.forEach(el => el.style.display = 'flex');
            compChildren.forEach(el => el.style.display = 'block');
            taskChildren.forEach(el => el.style.display = 'block');
        }
    },

    toggleSubTile(subId, e) {
        if (e) e.stopPropagation();
        const b = document.getElementById(`ts-sub-body-${subId}`);
        if (!b) return;
        b.style.display = b.style.display === 'none' ? 'flex' : 'none';
    },

    toggleCompNode(compId, e) {
        if (e) e.stopPropagation();
        const c = document.getElementById(`ts-comp-children-${compId}`);
        if (!c) return;
        c.style.display = c.style.display === 'none' ? 'block' : 'none';
    },

    toggleTaskNode(taskId, e) {
        if (e) e.stopPropagation();
        const t = document.getElementById(`ts-task-children-${taskId}`);
        if (!t) return;
        t.style.display = t.style.display === 'none' ? 'block' : 'none';
    },

    toggleMicroStep(projectId, taskId, stepId, isChecked) {
        const p = (appState.projects || []).find(x => x.id === projectId);
        if (!p) return;
        const task = (p.tasks || []).find(t => t.id === taskId);
        if (!task) return;
        const step = (task.microSteps || []).find(ms => ms.id === stepId);
        if (step) step.isCompleted = isChecked;
        saveStateLocally();
    },

    focusTask(projectId, taskId, e) {
        if (e) e.stopPropagation();
        if (this.isFullscreen) this.toggleFullscreen();
        appState.activeProjectId = projectId;
        const p = (appState.projects || []).find(x => x.id === projectId);
        if (p) {
            p.activeTaskId = taskId;
            const root = getRootProject(p);
            if (root && p.id !== root.id) root.activePhaseId = p.id;
        }
        saveStateLocally();
        enterOperatorMode();
    }
};

const ProjectMapEngine = TreeScopeEngine;
window.ProjectMapEngine = TreeScopeEngine;
window.TreeScopeEngine = TreeScopeEngine;

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && TreeScopeEngine.isFullscreen) {
        TreeScopeEngine.toggleFullscreen();
    }
});
