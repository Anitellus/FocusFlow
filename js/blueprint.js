// ============================================================================
// Focus Flow | Full-Stack Momentum Blueprint Engine (js/blueprint.js)
// ============================================================================

const BlueprintEngine = {
    // --- LLM Conversational Prompt System ---
    
    // Stage 1: Diagnostic Interviewer (Socratic Planning)
    copyArchitectPrompt() {
        const text = `Act as an ADHD Executive Function Project Strategist and Systems Architect.

I have an ambitious, complex project vision:
[Insert your raw idea, brain dump, or North Star here]

My Constraints & Reality Check:
- Weekly focus runway: [e.g., 90m weekdays, 3h weekends]
- Target timeframe: [e.g., 30 days]
- ADHD friction points: [e.g., Task paralysis, perfectionism, getting lost in implementation details]

Your Instructions:
DO NOT generate the full task breakdown yet.
First, ask me 3 to 4 diagnostic questions to clarify:
1. What the bare minimum viable deliverable (Definition of Done) looks like.
2. What technical stack or tools I'm committed to vs. exploring.
3. The single biggest blocker or unknown that could cause task paralysis.
4. How deep our 3-tier hierarchy needs to be (Main Project -> Sub-Projects -> Component Tracks).

Keep your response punchy and conversational. Let's build the roadmap together.`;
        this.copyToClipboard(text, 'btn-copy-architect', 'Copied Stage 1 Interview Prompt!');
    },

    // Stage 2: Final Blueprint Formatter
    copyFormatterPrompt() {
        const text = `Format our agreed-upon plan into a FocusFlow Markdown Blueprint using the strict format below:

# Main Project Name [YYYY-MM-DD]
Goal: One-sentence North Star outcome
Context: Strategic background, boundaries, and scope constraints

## Sub-Project Name [YYYY-MM-DD]
Context: Scope of this track

### Component Track [YYYY-MM-DD]
Context: Execution domain
- Task title (duration) [YYYY-MM-DD]
  Task description, links, caveats, or acceptance criteria.
  * Atomic micro-step 1 (<= 5m)
  * Atomic micro-step 2 (<= 5m)

Formatting Rules:
1. Durations in parentheses can be explicit: (25m), (1h 15m), (90s), (05:30), or unfilled placeholders: ( ___m ).
2. Tasks must live under leaf headers (## or ###).
3. Plain indented lines under a task become Task Notes.
4. Indented bullets (  * or   -) under a task become atomic Micro-Steps (<= 5 min actions).
5. Dates in [YYYY-MM-DD] brackets are optional.`;
        this.copyToClipboard(text, 'btn-copy-formatter', 'Copied Stage 2 Formatter Prompt!');
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
            alert("Copy failed."); 
        }
        document.body.removeChild(textArea);
    },

    // --- Modal Management & Mounting ---
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

    // --- Master Ingestion Coordinator ---
    executeImport() {
        const input = document.getElementById('blueprint-input');
        const rawText = input ? input.value.trim() : '';
        const targetMode = document.getElementById('blueprint-target-select')?.value || 'root';

        if (!rawText) { 
            alert("Please paste a Markdown blueprint or JSON outline."); 
            return; 
        }

        try {
            let createdProjects = [];
            if (rawText.startsWith('{') || rawText.startsWith('[')) {
                createdProjects = this.parseJSON(rawText, targetMode);
            } else {
                createdProjects = this.parseMarkdown(rawText, targetMode);
            }

            if (createdProjects.length === 0) {
                alert("No projects or tasks could be parsed. Check markdown formatting.");
                return;
            }

            // Route focus to the first project that contains tasks
            const projectWithTasks = createdProjects.find(p => p.tasks && p.tasks.length > 0);
            if (projectWithTasks) {
                appState.activeProjectId = projectWithTasks.id;
            } else {
                appState.activeProjectId = createdProjects[0].id;
            }

            saveStateLocally();
            if (typeof docRef !== 'undefined' && docRef && typeof currentUser !== 'undefined' && currentUser) {
                const cleanData = JSON.parse(JSON.stringify(appState));
                docRef.set(cleanData, { merge: true }).catch(err => console.warn("Blueprint sync notice:", err));
            }
            renderApp();
            this.closeModal();
            confetti({ particleCount: 70, spread: 60 });
            alert("Blueprint successfully ingested into FocusFlow!");
        } catch (err) { 
            console.error("Blueprint Ingest Error:", err); 
            alert("Error importing blueprint: " + err.message); 
        }
    },

    // --- State-Machine Line-by-Line Markdown Parser ---
    parseMarkdown(text, targetMode) {
        const lines = text.split(/\r?\n/);
        const activeProj = getActiveProject();
        const baseParentId = (targetMode === 'nest' && activeProj) ? activeProj.id : null;
        const baseDepth = baseParentId ? getProjectDepth(baseParentId) + 1 : 0;

        let currentTier1 = null;
        let currentTier2 = null;
        let currentTier3 = null;
        let currentContainer = null;
        let currentTask = null;
        const created = [];

        lines.forEach(rawLine => {
            // Check raw line indentation for micro-steps and sub-descriptions
            const isIndented = /^(\s{2,}|\t+)/.test(rawLine);
            const line = rawLine.trim();
            if (!line) return;

            // 1. Tier 1 Root Project (# )
            if (line.startsWith('# ')) {
                const { title, deadline } = this.extractTitleAndMeta(line.replace(/^#\s+/, ''));
                if (baseDepth === 0) {
                    currentTier1 = this.createProject(title, null, deadline);
                    created.push(currentTier1);
                    currentTier2 = null;
                    currentTier3 = null;
                    currentContainer = currentTier1;
                } else if (baseDepth === 1) {
                    currentTier2 = this.createProject(title, baseParentId, deadline);
                    created.push(currentTier2);
                    currentTier3 = null;
                    currentContainer = currentTier2;
                } else {
                    currentTier3 = this.createProject(title, baseParentId, deadline);
                    created.push(currentTier3);
                    currentContainer = currentTier3;
                }
                currentTask = null;
            } 
            // 2. Tier 2 Sub-Project (## )
            else if (line.startsWith('## ')) {
                const { title, deadline } = this.extractTitleAndMeta(line.replace(/^##\s+/, ''));
                const parentId = currentTier1 ? currentTier1.id : baseParentId;
                if (parentId && getProjectDepth(parentId) >= 2) {
                    throw new Error("Hierarchy limit exceeded at: " + title);
                }
                currentTier2 = this.createProject(title, parentId, deadline);
                created.push(currentTier2);
                currentTier3 = null;
                currentContainer = currentTier2;
                currentTask = null;
            } 
            // 3. Tier 3 Component Track (### )
            else if (line.startsWith('### ')) {
                const { title, deadline } = this.extractTitleAndMeta(line.replace(/^###\s+/, ''));
                const parentId = currentTier2 ? currentTier2.id : (currentTier1 ? currentTier1.id : baseParentId);
                if (parentId && getProjectDepth(parentId) >= 2) {
                    throw new Error("Hierarchy limit exceeded at: " + title);
                }
                currentTier3 = this.createProject(title, parentId, deadline);
                created.push(currentTier3);
                currentContainer = currentTier3;
                currentTask = null;
            } 
            // 4. North Star Goal
            else if (line.toLowerCase().startsWith('goal:')) {
                const goalText = line.replace(/^goal:\s*/i, '').trim();
                if (currentContainer) currentContainer.goal = goalText;
            } 
            // 5. Container Context (Appends to project notes)
            else if (line.toLowerCase().startsWith('context:')) {
                const contextText = line.replace(/^context:\s*/i, '').trim();
                if (currentContainer) {
                    currentContainer.notes = currentContainer.notes 
                        ? `${currentContainer.notes}\nContext: ${contextText}`
                        : `Context: ${contextText}`;
                }
            } 
            // 6. Indented Micro-Step under Active Task (  * or   -)
            else if (isIndented && currentTask && (line.startsWith('* ') || line.startsWith('- '))) {
                const microTitle = line.replace(/^[-*]\s+/, '').trim();
                currentTask.microSteps = currentTask.microSteps || [];
                currentTask.microSteps.push({
                    id: 'ms-' + generateId(),
                    title: microTitle,
                    isCompleted: false
                });
            }
            // 7. Indented Task Notes, Descriptions, Acceptance Criteria
            else if (isIndented && currentTask) {
                currentTask.notes = currentTask.notes ? `${currentTask.notes}\n${line}` : line;
            }
            // 8. Standard Task Line (- or *)
            else if (line.startsWith('- ') || line.startsWith('* ')) {
                const taskContent = line.replace(/^[-*]\s+/, '');
                const { title, seconds, deadline, notes } = this.extractTaskMeta(taskContent);

                if (!currentContainer) {
                    currentTier1 = this.createProject("Imported Workspace", baseParentId);
                    created.push(currentTier1);
                    currentContainer = currentTier1;
                }

                currentContainer.tasks = currentContainer.tasks || [];
                const newTask = {
                    id: 't-' + generateId(),
                    title: title,
                    estimatedTime: seconds,
                    actualTime: 0,
                    isCompleted: false,
                    deadline: deadline || '',
                    notes: notes || '',
                    createdAt: new Date().toISOString(),
                    microSteps: [],
                    lastParkedContext: null
                };

                currentContainer.tasks.push(newTask);
                if (!currentContainer.activeTaskId) {
                    currentContainer.activeTaskId = newTask.id;
                }
                currentTask = newTask;
            }
            // 9. Root/Track multiline context notes
            else if (!isIndented && currentContainer && !currentTask) {
                currentContainer.notes = currentContainer.notes ? `${currentContainer.notes}\n${line}` : line;
            }
        });

        return created;
    },

    // --- JSON Blueprint Parser ---
    parseJSON(jsonText, targetMode) {
        const data = JSON.parse(jsonText);
        const activeProj = getActiveProject();
        const baseParentId = (targetMode === 'nest' && activeProj) ? activeProj.id : null;
        const items = Array.isArray(data) ? data : [data];
        const created = [];

        items.forEach(item => {
            const root = this.createProject(item.title || "Imported Plan", baseParentId, item.deadline, item.goal);
            if (item.notes || item.context) root.notes = item.notes || item.context;
            created.push(root);

            if (Array.isArray(item.tasks)) {
                item.tasks.forEach(t => {
                    root.tasks.push({
                        id: 't-' + generateId(),
                        title: t.title || "Untitled Task",
                        estimatedTime: this.parseDurationToSeconds(t.estimatedTime || t.duration || t.minutes || 0),
                        actualTime: 0,
                        isCompleted: false,
                        deadline: t.deadline || '',
                        notes: t.notes || '',
                        createdAt: new Date().toISOString(),
                        microSteps: Array.isArray(t.microSteps) ? t.microSteps.map(m => ({ id: 'ms-' + generateId(), title: m.title || m, isCompleted: false })) : [],
                        lastParkedContext: null
                    });
                });
                root.activeTaskId = root.tasks[0]?.id || null;
            }

            if (Array.isArray(item.children)) {
                item.children.forEach(sub => {
                    const subProj = this.createProject(sub.title || "Sub-Project", root.id, sub.deadline, sub.goal);
                    if (sub.notes || sub.context) subProj.notes = sub.notes || sub.context;
                    created.push(subProj);

                    if (Array.isArray(sub.tasks)) {
                        sub.tasks.forEach(st => {
                            subProj.tasks.push({
                                id: 't-' + generateId(),
                                title: st.title || "Untitled Sub-Task",
                                estimatedTime: this.parseDurationToSeconds(st.estimatedTime || st.duration || st.minutes || 0),
                                actualTime: 0,
                                isCompleted: false,
                                deadline: st.deadline || '',
                                notes: st.notes || '',
                                createdAt: new Date().toISOString(),
                                microSteps: Array.isArray(st.microSteps) ? st.microSteps.map(m => ({ id: 'ms-' + generateId(), title: m.title || m, isCompleted: false })) : [],
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

    // --- Reverse Serializer (Focus Flow -> Markdown Blueprint) ---
    exportCurrentWorkspaceToMarkdown() {
        const rootProjects = (appState.projects || []).filter(p => !p.parentId);
        if (rootProjects.length === 0) {
            alert("No projects to export.");
            return;
        }

        let md = "";
        rootProjects.forEach(root => {
            md += `# ${root.title}${root.deadline ? ` [${root.deadline}]` : ''}\n`;
            if (root.goal) md += `Goal: ${root.goal}\n`;
            if (root.notes) md += `Context: ${root.notes}\n`;

            const subProjects = (appState.projects || []).filter(p => p.parentId === root.id);
            if (subProjects.length === 0) {
                md += this.serializeTasksToMarkdown(root.tasks);
            } else {
                subProjects.forEach(sub => {
                    md += `\n## ${sub.title}${sub.deadline ? ` [${sub.deadline}]` : ''}\n`;
                    if (sub.notes) md += `Context: ${sub.notes}\n`;

                    const components = (appState.projects || []).filter(p => p.parentId === sub.id);
                    if (components.length === 0) {
                        md += this.serializeTasksToMarkdown(sub.tasks);
                    } else {
                        components.forEach(comp => {
                            md += `\n### ${comp.title}${comp.deadline ? ` [${comp.deadline}]` : ''}\n`;
                            if (comp.notes) md += `Context: ${comp.notes}\n`;
                            md += this.serializeTasksToMarkdown(comp.tasks);
                        });
                    }
                });
            }
            md += "\n---\n\n";
        });

        this.copyToClipboard(md, 'btn-export-blueprint', 'Exported Workspace to Markdown!');
    },

    serializeTasksToMarkdown(tasks) {
        if (!tasks || tasks.length === 0) return '';
        let out = '';
        tasks.forEach(t => {
            const dur = t.estimatedTime > 0 ? ` (${Math.round(t.estimatedTime / 60)}m)` : ' ( ___m )';
            const dl = t.deadline ? ` [${t.deadline}]` : '';
            out += `- ${t.title}${dur}${dl}\n`;
            if (t.notes) {
                const noteLines = t.notes.split('\n');
                noteLines.forEach(nl => { out += `  ${nl}\n`; });
            }
            if (t.microSteps && t.microSteps.length > 0) {
                t.microSteps.forEach(ms => {
                    out += `  * ${ms.title}\n`;
                });
            }
        });
        return out;
    },

    // --- Helpers ---
    createProject(title, parentId = null, deadline = '', goal = '') {
        const id = 'proj-' + generateId();
        let makeParked = false;
        if (!parentId) {
            const activeRoots = (appState.projects || []).filter(p => !p.parentId && !p.isParked && !p.completedAt);
            if (activeRoots.length >= 4) makeParked = true;
        }

        const project = {
            id,
            parentId,
            title: title || "New Ingested Track",
            goal: goal || '',
            deadline: deadline || '',
            notes: '',
            retrospectiveNotes: '',
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
        const deadMatch = str.match(/\[(\d{4}[-/]\d{2}[-/]\d{2})\]/);
        if (deadMatch) {
            deadline = deadMatch[1].replace(/\//g, '-');
            title = title.replace(deadMatch[0], '');
        }
        return { title: title.trim(), deadline };
    },

    extractTaskMeta(rawStr) {
        let content = rawStr.trim();
        let notes = '';
        let deadline = '';
        let seconds = 0;

        // Separate inline notes if delimited by em-dash (—), en-dash (–), or '--'
        const splitNote = content.split(/\s+[—–]\s+|\s+--\s+/);
        if (splitNote.length > 1) {
            content = splitNote[0].trim();
            notes = splitNote.slice(1).join(' — ').trim();
        }

        const deadMatch = content.match(/\[(\d{4}[-/]\d{2}[-/]\d{2})\]/);
        if (deadMatch) {
            deadline = deadMatch[1].replace(/\//g, '-');
            content = content.replace(deadMatch[0], '').trim();
        }

        const durationMatch = content.match(/\(([^)]+)\)/);
        if (durationMatch) {
            seconds = this.parseDurationToSeconds(durationMatch[1]);
            content = content.replace(durationMatch[0], '').trim();
        }

        const title = content.replace(/^[-–—:]\s*/, '').replace(/\s*[-–—:]$/, '').trim();
        return { title: title || "Untitled Task", seconds, deadline, notes };
    },

    parseDurationToSeconds(raw) {
        if (!raw) return 0;
        if (typeof raw === 'number') return Math.round(raw * 60);

        const str = String(raw).trim().toLowerCase();

        // ADHD Placeholders (___m, __m, ___) map to 0 (Open ended)
        if (str.includes('_')) return 0;

        if (/^\d{1,3}:\d{2}$/.test(str)) {
            const [m, s] = str.split(':').map(Number);
            return (m * 60) + s;
        }

        let total = 0;
        const hoursMatch = str.match(/(\d+(?:\.\d+)?)\s*h(?:ours?)?/);
        const minsMatch = str.match(/(\d+(?:\.\d+)?)\s*m(?:in|ins|inutes?)?/);
        const secsMatch = str.match(/(\d+)\s*s(?:ec|ecs|econds?)?/);

        if (hoursMatch) total += parseFloat(hoursMatch[1]) * 3600;
        if (minsMatch) total += parseFloat(minsMatch[1]) * 60;
        if (secsMatch) total += parseInt(secsMatch[1], 10);

        if (!hoursMatch && !minsMatch && !secsMatch) {
            const rawNum = parseInt(str.replace(/[^\d]/g, ''), 10);
            if (!isNaN(rawNum) && rawNum > 0) total = rawNum * 60;
        }

        return Math.round(total);
    }
};
