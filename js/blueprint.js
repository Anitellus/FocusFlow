// --- Momentum Blueprint Ingestion Engine ---

const BlueprintEngine = {
    // Stage 1: Brainstorming & Architecture Prompt
    copyArchitectPrompt() {
        const text = `Act as an ADHD Executive Function Architect and Project Strategist.

I have a project vision I want to break down:
[Insert your goal, footage, or North Star here]

My Constraints & Reality Check:
- Weekly focus budget: [e.g., 90m weekdays, 2-3h weekends]
- Target timeframe: [e.g., 30 days]
- ADHD friction points: [e.g., Task paralysis, perfectionism, getting lost in details]

Rules for your response:
1. Organize into a 3-tier hierarchy: # Main Project -> ## Sub-Project -> ### Component Track.
2. Break work into atomic, low-friction action steps (<= 30-45m max).
3. CRITICAL: DO NOT invent estimated times. Output placeholders like ( ___m ) for me to fill in.
4. Suggest where quick 5-10m warm-ups or recovery sessions should live.`;

        this.copyToClipboard(text, 'btn-copy-architect', 'Copied Architect Prompt!');
    },

    // Stage 2: Direct Markdown Ingestion Prompt
    copyFormatterPrompt() {
        const text = `Format our agreed-upon plan into a FocusFlow Markdown Blueprint using the strict format below:

# Project Name [YYYY-MM-DD]
Goal: One-sentence North Star goal
## Sub-Project Name [YYYY-MM-DD]
### Component Track [YYYY-MM-DD]
- Task title (duration) [YYYY-MM-DD]

Formatting Rules:
- Include duration in parentheses: (25m), (1h 15m), (5m 30s), (90s), or (05:30).
- Tasks must live under leaf headers (## or ###).
- Dates inside [YYYY-MM-DD] brackets are optional.`;

        this.copyToClipboard(text, 'btn-copy-formatter', 'Copied Formatter Prompt!');
    },

    copyToClipboard(text, buttonId, successMessage) {
        const notify = () => {
            const btn = document.getElementById(buttonId);
            if (btn) {
                const original = btn.innerHTML;
                btn.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-emerald-600"></i> ${successMessage}`;
                safeCreateIcons();
                setTimeout(() => { btn.innerHTML = original; safeCreateIcons(); }, 2500);
            }
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(notify).catch(() => this.fallbackCopy(text, notify));
        } else {
            this.fallbackCopy(text, notify);
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
        } catch (e) {
            alert("Copy failed. Please manually select the template.");
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

            const projectWithTasks = createdProjects.find(p => p.tasks && p.tasks.length > 0);
            if (projectWithTasks) {
                appState.activeProjectId = projectWithTasks.id;
            } else if (createdProjects.length > 0) {
                appState.activeProjectId = createdProjects[0].id;
            }

            saveStateLocally();

            if (typeof docRef !== 'undefined' && docRef) {
                const cleanData = JSON.parse(JSON.stringify(appState));
                docRef.set(cleanData, { merge: true }).catch(err => console.warn("Blueprint sync notice:", err));
            }

            renderApp();
            this.closeModal();
            alert("Blueprint successfully ingested into FocusFlow!");
        } catch (err) {
            console.error("Blueprint Ingest Error:", err);
            alert("Error importing blueprint: " + err.message);
        }
    },

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
            } else if (line.startsWith('## ')) {
                const { title, deadline } = this.extractTitleAndMeta(line.replace(/^##\s+/, ''));
                const parentId = currentTier1 ? currentTier1.id : baseParentId;
                if (parentId && getProjectDepth(parentId) >= 2) throw new Error("Hierarchy limit reached at: " + title);
                currentTier2 = this.createProject(title, parentId, deadline);
                created.push(currentTier2);
                currentTier3 = null;
                currentActiveContainer = currentTier2;
            } else if (line.startsWith('### ')) {
                const { title, deadline } = this.extractTitleAndMeta(line.replace(/^###\s+/, ''));
                const parentId = currentTier2 ? currentTier2.id : (currentTier1 ? currentTier1.id : baseParentId);
                if (parentId && getProjectDepth(parentId) >= 2) throw new Error("Hierarchy limit reached at: " + title);
                currentTier3 = this.createProject(title, parentId, deadline);
                created.push(currentTier3);
                currentActiveContainer = currentTier3;
            } else if (line.toLowerCase().startsWith('goal:')) {
                if (currentActiveContainer) {
                    currentActiveContainer.goal = line.replace(/^goal:\s*/i, '').trim();
                }
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                const taskContent = line.replace(/^[-*]\s+/, '');
                const { title, seconds, deadline } = this.extractTaskMeta(taskContent);
                
                if (!currentActiveContainer) {
                    currentTier1 = this.createProject("Imported Blueprint", baseParentId);
                    created.push(currentTier1);
                    currentActiveContainer = currentTier1;
                }

                currentActiveContainer.tasks = currentActiveContainer.tasks || [];
                currentActiveContainer.tasks.push({
                    id: 't-' + generateId(),
                    title: title,
                    estimatedTime: seconds,
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
                        estimatedTime: this.parseDurationToSeconds(t.estimatedTime || t.duration || t.minutes || 15),
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
                                estimatedTime: this.parseDurationToSeconds(st.estimatedTime || st.duration || st.minutes || 15),
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
    
    // Check if new root project exceeds 4 active projects
    let makeParked = false;
    if (!parentId) {
        const activeRoots = (appState.projects || []).filter(p => !p.parentId && !p.isParked);
        if (activeRoots.length >= 4) {
            makeParked = true;
        }
    }

    const project = {
        id,
        parentId,
        title: title || "New Ingested Project",
        goal: goal || '',
        deadline: deadline || '',
        notes: 'Imported via Momentum Blueprint',
        isParked: makeParked,
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

    // Multi-format natural time parser
    extractTaskMeta(str) {
        let title = str;
        let seconds = 900; // 15 min default
        let deadline = '';

        const deadMatch = str.match(/\[(\d{4}-\d{2}-\d{2})\]/);
        if (deadMatch) {
            deadline = deadMatch[1];
            title = title.replace(deadMatch[0], '');
        }

        const durationMatch = title.match(/\(([^)]+)\)/) || title.match(/\[([^\]]+)\]/);
        if (durationMatch) {
            const parsed = this.parseDurationToSeconds(durationMatch[1]);
            if (parsed > 0) {
                seconds = parsed;
                title = title.replace(durationMatch[0], '');
            }
        }

        title = title.trim().replace(/^[-–—:]\s*/, '').replace(/\s*[-–—:]$/, '');

        return { 
            title: title.trim() || "Untitled Task", 
            seconds, 
            deadline 
        };
    },

    // Resolves strings like "5m 30s", "1h 15m", "90s", "5.5m", "05:30", or plain numbers
    parseDurationToSeconds(raw) {
        if (typeof raw === 'number') return Math.round(raw * 60);
        const str = String(raw).trim().toLowerCase();
        let total = 0;

        // Matches digital clock "MM:SS" (e.g. 05:30)
        if (/^\d{1,3}:\d{2}$/.test(str)) {
            const [m, s] = str.split(':').map(Number);
            return (m * 60) + s;
        }

        // Matches fractional hours (e.g. "1.5h")
        const decHourMatch = str.match(/^([\d.]+)\s*h(?:ours?)?$/);
        if (decHourMatch) return Math.round(parseFloat(decHourMatch[1]) * 3600);

        // Matches fractional minutes (e.g. "5.5m")
        const decMinMatch = str.match(/^([\d.]+)\s*m(?:in|ins|inutes?)?$/);
        if (decMinMatch) return Math.round(parseFloat(decMinMatch[1]) * 60);

        // Matches mixed components: "1h 30m 15s"
        const hoursMatch = str.match(/(\d+)\s*h/);
        const minsMatch = str.match(/(\d+)\s*m/);
        const secsMatch = str.match(/(\d+)\s*s/);

        if (hoursMatch) total += parseInt(hoursMatch[1], 10) * 3600;
        if (minsMatch) total += parseInt(minsMatch[1], 10) * 60;
        if (secsMatch) total += parseInt(secsMatch[1], 10);

        // Plain raw integer fallback (assumed to be minutes)
        if (!hoursMatch && !minsMatch && !secsMatch) {
            const rawNum = parseInt(str.replace(/[^\d]/g, ''), 10);
            if (!isNaN(rawNum) && rawNum > 0) total = rawNum * 60;
        }

        return total > 0 ? total : 900;
    }
};
