// ============================================================================
// Focus Flow | Project Progression & Dependent Variable Engine (js/progression.js)
// ============================================================================

const ProgressionEngine = {
    activeProjectId: null,

    getActiveProjectObj() {
        const id = this.activeProjectId || appState.activeProjectId;
        const p = (appState.projects || []).find(x => x.id === id) || (appState.projects || [])[0];
        if (p && !p.progression) {
            p.progression = { type: 'binary', metrics: [], entries: [], gallery: [] };
        }
        return p;
    },

    openModal(projectId = null) {
        this.activeProjectId = projectId || appState.activeProjectId;
        const modal = document.getElementById('progression-modal');
        if (!modal) return;
        modal.classList.remove('hidden');

        const p = this.getActiveProjectObj();
        document.getElementById('prog-modal-title').textContent = `${p.title} — Progression Tracker`;
        this.renderBody();
        safeCreateIcons();
    },

    closeModal() {
        const modal = document.getElementById('progression-modal');
        if (modal) modal.classList.add('hidden');
    },

    setType(type) {
        const p = this.getActiveProjectObj();
        if (!p) return;
        p.progression.type = type;
        saveStateLocally();
        this.renderBody();
    },

    renderBody() {
        const p = this.getActiveProjectObj();
        const container = document.getElementById('prog-body-container');
        if (!container || !p) return;

        const type = p.progression.type || 'binary';

        // Update Tab Active Classes
        ['metrics', 'gallery', 'binary'].forEach(t => {
            const tab = document.getElementById(`prog-tab-${t}`);
            if (tab) {
                tab.className = t === type 
                    ? "flex-1 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-800 shadow-sm"
                    : "flex-1 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800";
            }
        });

        if (type === 'binary') {
            container.innerHTML = `
                <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div class="text-3xl">✓</div>
                    <h4 class="font-bold text-sm text-slate-800">Standard Milestone Tracking</h4>
                    <p class="text-xs text-slate-500 max-w-md mx-auto">This project relies on binary task and sprint completion. No external output variables are currently being graphed.</p>
                </div>
            `;
        } else if (type === 'metrics') {
            this.renderMetricsView(p, container);
        } else if (type === 'gallery') {
            this.renderGalleryView(p, container);
        }

        safeCreateIcons();
    },

    // --- 1. Quantitative Metric Tracking View ---
    renderMetricsView(p, container) {
        const metrics = p.progression.metrics || [];
        const entries = p.progression.entries || [];

        container.innerHTML = `
            <!-- Setup & Definitions -->
            <div class="bg-indigo-50/60 p-3.5 rounded-2xl border border-indigo-100 space-y-2">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-indigo-950">Tracked Variables (Playlists, Stats, Outputs):</span>
                    <button onclick="ProgressionEngine.addMetricPrompt()" class="px-2.5 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                        <i data-lucide="plus" class="w-3 h-3"></i> Add Variable
                    </button>
                </div>
                <div class="flex flex-wrap gap-1.5">
                    ${metrics.length === 0 
                        ? `<span class="text-[11px] text-slate-400 italic">No variables added (e.g., '2v2 MMR', 'Subscribers', 'Video Count'). Click Add Variable.</span>`
                        : metrics.map(m => `
                            <span class="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-900 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                                ${m}
                                <button onclick="ProgressionEngine.removeMetric('${m}')" class="text-slate-400 hover:text-rose-500 ml-1">×</button>
                            </span>
                        `).join('')
                    }
                </div>
            </div>

            <!-- New Log Entry Form -->
            ${metrics.length > 0 ? `
                <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                    <h5 class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <i data-lucide="edit-3" class="w-3.5 h-3.5 text-brand-500"></i> Record Daily Progress Snapshot
                    </h5>
                    <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <select id="prog-input-metric" class="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none">
                            ${metrics.map(m => `<option value="${m}">${m}</option>`).join('')}
                        </select>
                        <input type="number" id="prog-input-value" placeholder="Value (e.g. 1150)" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-slate-700 outline-none">
                        <input type="text" id="prog-input-notes" placeholder="Notes (e.g. Peaked Champ 1)" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none">
                        <button onclick="ProgressionEngine.saveMetricEntry()" class="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-2xs">Save Snapshot</button>
                    </div>
                </div>
            ` : ''}

            <!-- Log History Table -->
            <div class="space-y-1.5">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Historical Snapshot Log</span>
                <div class="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto bg-white">
                    ${entries.length === 0 ? `<div class="p-4 text-xs text-slate-400 italic text-center">No snapshot data logged yet.</div>` : entries.slice().reverse().map(e => `
                        <div class="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                            <div class="flex items-center gap-3">
                                <span class="font-mono text-[10px] text-slate-400">${e.date}</span>
                                <span class="font-bold text-slate-700">${e.metric}</span>${e.notes ? `<span class="text-slate-500 italic text-[11px]">— ${e.notes}</span>` : ''}
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="font-mono font-bold text-base text-slate-800">${e.value}</span>
                                <button onclick="ProgressionEngine.deleteMetricEntry('${e.id}')" class="text-slate-300 hover:text-rose-500 p-1">×</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // --- 2. Visual / Image Journal View (Drawings, Photos & Reflections) ---
    renderGalleryView(p, container) {
        const gallery = p.progression.gallery || [];

        container.innerHTML = `
            <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <h5 class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <i data-lucide="camera" class="w-3.5 h-3.5 text-brand-500"></i> Upload Drawing / Visual Artifact
                </h5>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input type="text" id="prog-art-title" placeholder="Drawing Title / Subject" class="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none">
                    <input type="file" id="prog-art-file" accept="image/*" class="bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs text-slate-600 outline-none">
                    <button onclick="ProgressionEngine.uploadGalleryItem()" class="bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-2xs">Add to Journal</button>
                </div>
                <textarea id="prog-art-notes" rows="2" placeholder="Reflective thoughts, lessons learned, or anatomical self-critique..." class="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 outline-none resize-none"></textarea>
            </div>

            <!-- Gallery Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                ${gallery.length === 0 ? `<div class="col-span-2 p-6 text-center text-xs text-slate-400 italic">No drawing photos added yet. Upload your first study above!</div>` : gallery.slice().reverse().map(item => `
                    <div class="p-3 bg-white border border-slate-200 rounded-2xl flex gap-3 shadow-2xs">
                        <img src="${item.imageUrl}" class="w-24 h-24 object-cover rounded-xl border border-slate-100 shrink-0 bg-slate-50">
                        <div class="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between">
                                    <h6 class="font-bold text-xs text-slate-800 truncate">${item.title}</h6>
                                    <button onclick="ProgressionEngine.deleteGalleryItem('${item.id}')" class="text-slate-300 hover:text-rose-500 p-0.5">×</button>
                                </div>
                                <span class="text-[10px] font-mono text-slate-400">${item.date}</span>
                                <p class="text-[11px] text-slate-600 mt-1 line-clamp-3 leading-snug">${item.notes || 'No reflections noted.'}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Actions
    addMetricPrompt() {
        const val = prompt("Enter new tracking variable name (e.g., '2v2 MMR', 'Subscribers', 'Dropshot'):");
        if (!val || !val.trim()) return;
        const p = this.getActiveProjectObj();
        p.progression.metrics = p.progression.metrics || [];
        if (!p.progression.metrics.includes(val.trim())) {
            p.progression.metrics.push(val.trim());
            saveStateLocally();
            this.renderBody();
        }
    },

    removeMetric(name) {
        const p = this.getActiveProjectObj();
        p.progression.metrics = (p.progression.metrics || []).filter(m => m !== name);
        saveStateLocally();
        this.renderBody();
    },

    saveMetricEntry() {
        const metric = document.getElementById('prog-input-metric')?.value;
        const value = parseFloat(document.getElementById('prog-input-value')?.value);
        const notes = document.getElementById('prog-input-notes')?.value.trim();
        if (isNaN(value)) return alert("Please enter a valid numeric value.");

        const p = this.getActiveProjectObj();
        p.progression.entries = p.progression.entries || [];
        p.progression.entries.push({
            id: 'pe-' + generateId(),
            date: getLocalFormattedDate(new Date()),
            metric: metric,
            value: value,
            notes: notes
        });
        saveStateLocally();
        this.renderBody();
    },

    deleteMetricEntry(id) {
        const p = this.getActiveProjectObj();
        p.progression.entries = (p.progression.entries || []).filter(e => e.id !== id);
        saveStateLocally();
        this.renderBody();
    },

    uploadGalleryItem() {
        const title = document.getElementById('prog-art-title')?.value.trim() || 'Untitled Study';
        const notes = document.getElementById('prog-art-notes')?.value.trim() || '';
        const fileInput = document.getElementById('prog-art-file');
        const file = fileInput?.files?.[0];
        if (!file) return alert("Please select an image file to upload.");

        const reader = new FileReader();
        reader.onload = (e) => {
            const p = ProgressionEngine.getActiveProjectObj();
            p.progression.gallery = p.progression.gallery || [];
            p.progression.gallery.push({
                id: 'pg-' + generateId(),
                date: getLocalFormattedDate(new Date()),
                title: title,
                imageUrl: e.target.result,
                notes: notes
            });
            saveStateLocally();
            ProgressionEngine.renderBody();
        };
        reader.readAsDataURL(file);
    },

    deleteGalleryItem(id) {
        const p = this.getActiveProjectObj();
        p.progression.gallery = (p.progression.gallery || []).filter(g => g.id !== id);
        saveStateLocally();
        this.renderBody();
    }
};
