// --- Momentum Blueprint Ingestion Engine ---

const BlueprintEngine = {
    // Copies the prompt template with mobile clipboard fallback
    copyAiPrompt() {
        const promptText = `Please format the schedule/plan above into a FocusFlow Markdown Blueprint using the following format:

# Project Name [Optional Deadline YYYY-MM-DD]
Goal: Optional goal description
## Sub-Project Name [Optional Deadline YYYY-MM-DD]
### Component Project Name [Optional Deadline YYYY-MM-DD]
- Task title (estimated_minutes) [Optional Deadline YYYY-MM-DD]
- Another task title (30m) [2026-05-15]

Ensure tasks are placed at the lowest project level and include duration in minutes like (25m) or (45m).`;

        const notifySuccess = () => {
            const btn = document.getElementById('btn-copy-blueprint-prompt');
            if (btn) {
                const original = btn.innerHTML;
                btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i> Copied AI Prompt!`;
                safeCreateIcons();
                setTimeout(() => { btn.innerHTML = original; safeCreateIcons(); }, 2500);
            }
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(promptText)
                .then(notifySuccess)
                .catch(() => this.fallbackCopy(promptText, notifySuccess));
        } else {
            this.fallbackCopy(promptText, notifySuccess);
        }
    },

    fallbackCopy(text, callback) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            if (callback) callback();
        } catch (err) {
            alert("Copy failed. Please manually copy the template from the instructions guide.");
        }
        document.body.removeChild(textArea);
    },

    openModal() {
        const modal = document.getElementById('blueprint-modal');
        if (!modal) return;
        if (typeof closeMobileSidebar === 'function') closeMobileSidebar();

        const activeProj = getActiveProject();
        const activeDepth = activeProj ? getProjectDepth(activeProj.id) : 0;
        const targetSelect = document.getElementById('blueprint-target-select');
        
        if (targetSelect) {
            targetSelect.innerHTML = `
                <option value="root">New Root Project</option>
                ${activeProj && activeDepth < 2 ? `<option value="nest">Nest inside active: "${activeProj.title}" (Tier ${activeDepth + 1})</option>` : ''}
            `;
        }

        const input = document.getElementById('blueprint-input');
        if (input) input.value = '';
        modal.classList.remove('hidden');
        safeCreateIcons();
    },

    closeModal() {
        const modal = document.getElementById('blueprint-modal');
        if (modal) modal.classList.add('hidden');
    },

    // Ingests either Markdown outline or JSON format
    executeImport() {
        const input = document.getElementById('blueprint-input');
        const rawText = input ? input.value.trim() : '';
        const targetMode = document.getElementById('blueprint-target-select')?.value || 'root';

        if (!rawText) {
            alert("Please paste a Markdown outline or JSON blueprint.");
            return;
        }

        try {
            let createdProjects = [];
            if (rawText.startsWith('{') || rawText.startsWith('[')) {
                createdProjects = this.parseJSON(rawText, targetMode);
            } else {
                createdProjects = this.parseMarkdown(rawText, targetMode);
            }

            // Automatically select the first project that has tasks
            const projectWithTasks = createdProjects.find(p => p.tasks && p.tasks.length > 0);
            if (projectWithTasks) {
                appState.activeProjectId = projectWithTasks.id;
            } else if (createdProjects.length > 0) {
                appState.activeProjectId = createdProjects[0].id;
            }

            saveStateLocally();
            
            // Push immediately to Firestore
            if (typeof docRef !== 'undefined' && docRef) {
                const cleanData = JSON.parse(JSON.stringify(appState));
                docRef.set(cleanData, { merge: true }).catch(err => console.warn("Blueprint sync note:", err));
            }

            renderApp();
            this.closeModal();
            alert("Blueprint successfully ingested into FocusFlow!");
        } catch (err) {
            console.error("Blueprint Ingest Error:", err);
            alert("Error importing blueprint: " + err.message);
        }
    },

    // Markdown Parser
    parseMarkdown(text, targetMode) {
        const lines = text.split('\n');
        const activeProj = getActiveProject();
        const baseParentId = (targetMode === 'nest' && activeProj) ? activeProj.id : null;
        const baseDepth = baseParentId ? getProjectDepth(baseParentId) + 1 : 0;

        let currentTier1 = null;
        let currentTier2 = null;
        let currentTier3 = null;
        let currentActiveContainer = null;
        const created = [];

        lines.forEach(rawLine => {
            const line = rawLine.trim();
            if (!line) return;

            // Tier 1 Header (# Project)
            if (line.startsWith('# ')) {
                const { title, deadline } = this.extractTitleAndMeta(line.replace(/^#\s+/, ''));
                if (baseDepth === 0) {
                    currentTier1 = this.createProject(title, null, deadline);
                    created.push(currentTier1);
                    currentTier2 = null;
                    currentTier3 = null;
                    currentActiveContainer = currentTier1;
                } else if (baseDepth === 1) {
                    currentTier2 = this.createProject(title, baseParentId, deadline);
                    created.push(currentTier2);
                    currentTier3 = null;
                    currentActiveContainer = currentTier2;
                } else {
                    currentTier3 = this.createProject(title, baseParentId, deadline);
                    created.push(currentTier3);
                    currentActiveContainer = currentTier3;
                }
            }
            // Tier 2 Header (## Sub-Project)
            else if (line.startsWith('## ')) {
                const { title, deadline } = this.extractTitleAndMeta(line.replace(/^##\s+/, ''));
                const parentId = currentTier1 ? currentTier1.id : baseParentId;
                if (parentId && getProjectDepth(parentId) >= 2) throw new Error("Hierarchy depth exceeded at: " + title);
                currentTier2 = this.createProject(title, parentId, deadline);
                created.push(currentTier2);
                currentTier3 = null;
                currentActiveContainer = currentTier2;
            }
            // Tier 3 Header (### Component Project)
            else if (line.startsWith('### ')) {
                const { title, deadline } = this.extractTitleAndMeta(line.replace(/^###\s+/, ''));
                const parentId = currentTier2 ? currentTier2.id : (currentTier1 ? currentTier1.id : baseParentId);
                if (parentId && getProjectDepth(parentId) >= 2) throw new Error("Hierarchy depth exceeded at: " + title);
                currentTier3 = this.createProject(title, parentId, deadline);
                created.push(currentTier3);
                currentActiveContainer = currentTier3;
            }
            // Goal Definition (Goal: ...)
            else if (line.toLowerCase().startsWith('goal:')) {
                if (currentActiveContainer) {
                    currentActiveContainer.goal = line.replace(/^goal:\s*/i, '').trim();
                }
            }
            // Task Items (- Task Name (30m) [2026-05-15])
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                const taskContent = line.replace(/^[-*]\s+/, '');
                const { title, minutes, deadline } = this.extractTaskMeta(taskContent);
                
                if (!currentActiveContainer) {
                    currentTier1 = this.createProject("Imported Blueprint", baseParentId);
                    created.push(currentTier1);
                    currentActiveContainer = currentTier1;
                }

                currentActiveContainer.tasks = currentActiveContainer.tasks || [];
                currentActiveContainer.tasks.push({
                    id: 't-' + generateId(),
                    title: title,
                    estimatedTime: minutes * 60,
                    actualTime: 0,
                    isCompleted: false,
                    deadline: deadline || '',
                    notes: '',
                    createdAt: new Date().toISOString(),
                    microSteps: [],
                    lastParkedContext: null
                });

                if (!currentActiveContainer.activeTaskId) {
                    currentActiveContainer.activeTaskId = currentActiveContainer.tasks[0].id;
                }
            }
        });

        return created;
    },

    // JSON Parser
    parseJSON(jsonText, targetMode) {
        const data = JSON.parse(jsonText);
        const activeProj = getActiveProject();
        const baseParentId = (targetMode === 'nest' && activeProj) ? activeProj.id : null;
        const items = Array.isArray(data) ? data : [data];
        const created = [];

        items.forEach(item => {
            const root = this.createProject(item.title || "Imported Plan", baseParentId, item.deadline, item.goal);
            created.push(root);

            if (Array.isArray(item.tasks)) {
                item.tasks.forEach(t => {
                    root.tasks.push({
                        id: 't-' + generateId(),
                        title: t.title || "Untitled Task",
                        estimatedTime: (t.estimatedMinutes || t.minutes || 15) * 60,
                        actualTime: 0,
                        isCompleted: false,
                        deadline: t.deadline || '',
                        notes: t.notes || '',
                        createdAt: new Date().toISOString(),
                        microSteps: [],
                        lastParkedContext: null
                    });
                });
                root.activeTaskId = root.tasks[0]?.id || null;
            }

            if (Array.isArray(item.children)) {
                item.children.forEach(sub => {
                    const subProj = this.createProject(sub.title || "Sub-Project", root.id, sub.deadline, sub.goal);
                    created.push(subProj);

                    if (Array.isArray(sub.tasks)) {
                        sub.tasks.forEach(st => {
                            subProj.tasks.push({
                                id: 't-' + generateId(),
                                title: st.title || "Untitled Sub-Task",
                                estimatedTime: (st.estimatedMinutes || st.minutes || 15) * 60,
                                actualTime: 0,
                                isCompleted: false,
                                deadline: st.deadline || '',
                                notes: st.notes || '',
                                createdAt: new Date().toISOString(),
                                microSteps: [],
                                lastParkedContext: null
                            });
                        });
                        subProj.activeTaskId = subProj.tasks[0]?.id || null;
                    }
                });
            }
        });

        return created;
    },

    createProject(title, parentId = null, deadline = '', goal = '') {
        const id = 'proj-' + generateId();
        const project = {
            id,
            parentId,
            title: title || "New Ingested Project",
            goal: goal || '',
            deadline: deadline || '',
            notes: 'Imported via Momentum Blueprint',
            totalTimeSpent: 0,
            activeTaskId: null,
            activeMascotId: null,
            unlockAllMascotsTest: false,
            createdAt: new Date().toISOString(),
            completedAt: null,
            tasks: []
        };
        appState.projects = appState.projects || [];
        appState.projects.push(project);
        return project;
    },

    extractTitleAndMeta(str) {
        let title = str;
        let deadline = '';
        const deadMatch = str.match(/\[(\d{4}-\d{2}-\d{2})\]/);
        if (deadMatch) {
            deadline = deadMatch[1];
            title = title.replace(deadMatch[0], '');
        }
        return { title: title.trim(), deadline };
    },

    // Fixed Regex: removes \vert{} and uses standard pipe |
    extractTaskMeta(str) {
        let title = str;
        let minutes = 15;
        let deadline = '';

        const deadMatch = str.match(/\[(\d{4}-\d{2}-\d{2})\]/);
        if (deadMatch) {
            deadline = deadMatch[1];
            title = title.replace(deadMatch[0], '');
        }

        const minMatch = title.match(/\((\d+)\s*(?:m\vert{}min\vert{}mins)?\)/i) || 
                         title.match(/\[(\d+)\s*(?:m\vert{}min\vert{}mins)?\]/i);
        if (minMatch) {
            minutes = parseInt(minMatch[1], 10);
            title = title.replace(minMatch[0], '');
        }

        title = title.trim().replace(/^[-–—:]\s*/, '').replace(/\s*[-–—:]$/, '');

        return { 
            title: title.trim() || "Untitled Task", 
            minutes: (!isNaN(minutes) && minutes > 0) ? minutes : 15, 
            deadline 
        };
    }
};
