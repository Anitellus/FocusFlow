// ============================================================================
// Focus Flow | Project Map Board Engine (js/treescope.js)
// ============================================================================

const TreeScopeEngine = {
    isFitScreen: true,
    columnLayout: [], // Array of columns: [ [subId1], [subId2, subId3] ]
    combiningSubId: null,
    activeProjectId: null,
    isFullscreen: false,
    currentDepth: '1', // Default: Level 1 (Sub-Projects only)

    open() {
        switchView('map');
    },

    close() {
        if (this.isFullscreen) {
            this.toggleFullscreen();
        } else {
            switchView('focus');
        }
    },

    getActiveProjectObj() {
        const activeProj = getActiveProject();
        const root = activeProj ? getRootProject(activeProj) : (appState.projects || [])[0];
        if (!this.activeProjectId && root) this.activeProjectId = root.id;
        return (appState.projects || []).find(p => p.id === this.activeProjectId) || root || (appState.projects || [])[0];
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
                ${r.title} ${r.isParked ? '(Parked)' : ''} ${r.completedAt ? '✓' : ''}
            </option>
        `).join('');
    },

    switchProject(rootId) {
        this.activeProjectId = rootId;
        appState.activeProjectId = rootId;
        this.combiningSubId = null;
        this.initLayout();
        this.render();
        saveStateLocally();
    },

    // Default configuration: Auto-stack into 2 rows for immediate field-of-view clarity
    initLayout() {
        const subs = this.getSubProjects(this.activeProjectId);
        if (subs.length <= 1) {
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

        // Update Goal Button Tooltip on hover
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
                <div class="ts-board-column" style="flex: 1; max-width: 520px; margin: auto;">
                    <div class="ts-subproject-tile">
                        <div class="ts-tile-header">
                            <span class="ts-tile-title font-bold text-[#38bdf8]">${root.title} Tasks</span>
                            <span class="badge font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300">${(root.tasks || []).length} tasks</span>
                        </div>
                        <div class="ts-tile-body">
                            ${this.renderTaskListHTML(root.tasks || [], root.id)}
                        </div>
                    </div>
                </div>
            `;
            stage.appendChild(container);
            safeCreateIcons();
            return;
        }

        if (this.columnLayout.length === 0) {
            this.initLayout();
        }

        this.columnLayout.forEach((colSubIds, colIndex) => {
            const col = document.createElement('div');
            col.className = 'ts-board-column';
            col.setAttribute('data-col-index', colIndex);

            col.addEventListener('dragover', (e) => {
                e.preventDefault();
                col.classList.add('drop-target');
            });
            col.addEventListener('dragleave', () => {
                col.classList.remove('drop-target');
            });
            col.addEventListener('drop', (e) => {
                e.preventDefault();
                col.classList.remove('drop-target');
                const draggedId = e.dataTransfer.getData('text/plain');
                if (draggedId) TreeScopeEngine.moveSubProjectToColumn(draggedId, colIndex);
            });

            col.addEventListener('click', (e) => {
                if (TreeScopeEngine.combiningSubId) {
                    e.stopPropagation();
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

                const tile = document.createElement('div');
                tile.className = `ts-subproject-tile ${TreeScopeEngine.combiningSubId === sub.id ? 'combine-source' : ''}`;
                tile.id = `ts-sub-tile-${sub.id}`;

                const header = document.createElement('div');
                header.className = 'ts-tile-header';
                header.draggable = true;

                header.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', sub.id);
                    tile.style.opacity = '0.5';
                });
                header.addEventListener('dragend', () => {
                    tile.style.opacity = '1';
                });

                header.innerHTML = `
                    <div class="flex items-center gap-2 overflow-hidden">
                        <span class="text-[#38bdf8] text-xs cursor-pointer select-none" onclick="TreeScopeEngine.toggleSubTile('${sub.id}', event)">▼</span>
                        <span class="text-xs font-bold text-[#38bdf8] truncate" title="${sub.title}">${sub.title}</span>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <span class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/10 text-slate-400">${taskCount}</span>
                        ${isStacked ? `
                            <button class="px-1.5 py-0.5 rounded bg-white/5 hover:bg-[#22304d] text-[10px] text-slate-300 border border-white/10 cursor-pointer" onclick="TreeScopeEngine.separateSubProject('${sub.id}', event)">⤢ Separate</button>
                        ` : `
                            <button class="px-1.5 py-0.5 rounded bg-white/5 hover:bg-[#22304d] text-[10px] text-slate-300 border border-white/10 cursor-pointer" onclick="TreeScopeEngine.startCombine('${sub.id}', event)">⤹ Combine</button>
                        `}
                    </div>
                `;
                tile.appendChild(header);

                const body = document.createElement('div');
                body.className = 'ts-tile-body';
                body.id = `ts-sub-body-${sub.id}`;

                if (comps.length === 0) {
                    body.innerHTML = TreeScopeEngine.renderTaskListHTML(sub.tasks || [], sub.id);
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
                                <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400 ml-auto">${compTasks.length}</span>
                            </div>
                            <div class="ts-tree-children ts-comp-children" id="ts-comp-children-${comp.id}">
                                ${TreeScopeEngine.renderTaskListHTML(compTasks, comp.id)}
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
        const depthVal = document.getElementById('map-depth-select')?.value || this.currentDepth || '1';
        this.applyDepthFilter(depthVal);
        safeCreateIcons();
    },

    renderTaskListHTML(tasks, containerId) {
        if (!tasks || tasks.length === 0) {
            return `<div class="p-2 text-[11px] text-slate-500 italic">No tasks created.</div>`;
        }

        return tasks.map(t => {
            const microsteps = t.microSteps || [];
            return `
                <div class="ts-tree-node ts-task-node my-1" id="ts-task-node-${t.id}">
                    <div class="ts-tree-row" onclick="TreeScopeEngine.toggleTaskNode('${t.id}', event)">
                        <span class="text-[#94a3b8] text-[9px] select-none ts-task-toggle">▼</span>
                        <span class="text-xs font-semibold ${t.isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}">${t.title}</span>
                        <div class="flex items-center gap-1 ml-auto shrink-0">
                            ${t.estimatedTime > 0 ? `<span class="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#38bdf8]/15 text-[#38bdf8]">${Math.round(t.estimatedTime/60)}m</span>` : ''}
                            <button onclick="TreeScopeEngine.focusTask('${containerId}', '${t.id}', event)" title="Focus Task in FocusFlow" class="px-1.5 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 cursor-pointer">🎯</button>
                        </div>
                    </div>
                    <div class="ts-tree-children ts-task-children space-y-1" id="ts-task-children-${t.id}">
                        ${t.notes ? `<div class="text-[10px] text-slate-400 italic mb-1.5 leading-snug">${t.notes}</div>` : ''}
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
            if (this.isFitScreen) {
                btn.className = "px-2.5 py-1 bg-[#182236] text-[#38bdf8] border border-[#38bdf8] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer";
            } else {
                btn.className = "px-2.5 py-1 bg-[#121826] text-slate-400 border border-[#24324f] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer";
            }
        }
    },

    toggleFullscreen() {
        const container = document.getElementById('view-map-container');
        if (!container) return;
        this.isFullscreen = !this.isFullscreen;
        container.classList.toggle('map-fullscreen', this.isFullscreen);

        const label = document.getElementById('map-fullscreen-label');
        const icon = document.getElementById('map-fullscreen-icon');
        if (label) label.textContent = this.isFullscreen ? "Exit Map" : "Fullscreen";
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
        if (p) p.activeTaskId = taskId;
        saveStateLocally();
        switchView('focus');
    }
};

// Aliases and Escape hotkey listener
const ProjectMapEngine = TreeScopeEngine;
window.ProjectMapEngine = TreeScopeEngine;
window.TreeScopeEngine = TreeScopeEngine;

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && TreeScopeEngine.isFullscreen) {
        TreeScopeEngine.toggleFullscreen();
    }
});
