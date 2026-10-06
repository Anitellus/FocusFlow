// ============================================================================
// Focus Flow | Progression Engine (js/progression.js)
// ============================================================================

const ProgressionEngine = {
    activeProjectId: null,

    getActiveProjectObj() {
        const id = this.activeProjectId || appState.activeProjectId;
        const p = (appState.projects || []).find(x => x.id === id) || (appState.projects || [])[0];
        if (p && !p.progression) {
            p.progression = { type: 'metrics', metrics: [], entries: [], gallery: [] };
        }
        return p;
    },

    switchProject(projectId) {
        this.activeProjectId = projectId;
        this.render();
    },

    setType(type) {
        const p = this.getActiveProjectObj();
        if (!p) return;
        p.progression.type = type;
        saveStateLocally();
        this.render();
    },

    render() {
        const p = this.getActiveProjectObj();
        const container = document.getElementById('prog-page-body-container');
        const selector = document.getElementById('prog-project-selector');
        if (!container || !p) return;

        // Sync Project Selector
        const roots = (appState.projects || []).filter(x => !x.parentId);
        if (selector) {
            selector.innerHTML = roots.map(r => `
                <option value="${r.id}" ${r.id === p.id ? 'selected' : ''}>${r.title} ${r.completedAt ? '✓' : ''}</option>
            `).join('');
        }

        const type = p.progression.type || 'metrics';

        // Update Tab Active Styling
        ['metrics', 'gallery', 'binary'].forEach(t => {
            const tab = document.getElementById(`prog-tab-${t}`);
            if (tab) {
                tab.className = t === type 
                    ? "flex-1 py-2 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 shadow-2xs text-center"
                    : "flex-1 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 text-center";
            }
        });

        if (type === 'binary') {
            container.innerHTML = `
                <div class="p-10 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
                    <div class="text-4xl text-emerald-500">✓</div>
                    <h3 class="font-bold text-base text-slate-800">Milestone Complete State</h3>
                    <p class="text-xs text-slate-500 max-w-md mx-auto">This project relies on atomic task checklists and sprint completion. No continuous external variables are configured.</p>
                </div>
            `;
        } else if (type === 'metrics') {
            this.renderMetrics(p, container);
        } else if (type === 'gallery') {
            this.renderGallery(p, container);
        }

        safeCreateIcons();
    },

    renderMetrics(p, container) {
        const metrics = p.progression.metrics || [];
        const entries = p.progression.entries || [];

        container.innerHTML = `
            <div class="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span class="text-xs font-bold text-slate-800">Tracked Variables (Elo, MMR, Counts):</span>
                    <button onclick="ProgressionEngine.addMetricPrompt()" class="px-3 py-1 bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs">
                        <i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Variable
                    </button>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${metrics.length === 0 
                        ? `<p class="text-xs text-slate-400 italic py-1">No output variables set (e.g. '2v2 MMR', 'Subscribers', 'Video Count').</p>`
                        : metrics.map(m => `
                            <span class="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-bold flex items-center gap-2">
                                ${m}
                                <button onclick="ProgressionEngine.removeMetric('${m}')" class="text-slate-400 hover:text-rose-500">×</button>
                            </span>
                        `).join('')}
                </div>
            </div>

            ${metrics.length > 0 ? `
                <div class="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                    <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5"><i data-lucide="edit-3" class="w-3.5 h-3.5 text-brand-600"></i> Record Output Snapshot</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                        <select id="prog-input-metric" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none">
                            ${metrics.map(m => `<option value="${m}">${m}</option>`).join('')}
                        </select>
                        <input type="number" id="prog-input-value" placeholder="Value (e.g. 1150)" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-700 outline-none">
                        <input type="text" id="prog-input-notes" placeholder="Notes (e.g. Peaked Champ 1)" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none">
                        <button onclick="ProgressionEngine.saveMetricEntry()" class="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-2xs">Save Snapshot</button>
                    </div>
                </div>
            ` : ''}

            <div class="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
                <div class="px-5 py-3 border-b border-slate-100"><span class="text-xs font-bold text-slate-800">Historical Snapshot Log</span></div>
                <div class="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    ${entries.length === 0 ? `<p class="p-6 text-xs text-slate-400 italic text-center">No snapshots recorded yet.</p>` : entries.slice().reverse().map(e => `
                        <div class="px-5 py-3 flex items-center justify-between text-xs hover:bg-slate-50">
                            <div class="flex items-center gap-3">
                                <span class="font-mono text-[11px] text-slate-400">${e.date}</span>
                                <span class="font-bold text-slate-800">${e.metric}</span>${e.notes ? `<span class="text-slate-500 italic">— ${e.notes}</span>` : ''}
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

    renderGallery(p, container) {
        const gallery = p.progression.gallery || [];
        container.innerHTML = `
            <div class="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                <h4 class="text-xs font-bold text-slate-800 flex items-center gap-1.5"><i data-lucide="camera" class="w-3.5 h-3.5 text-brand-600"></i> Add Visual Drawing / Study</h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input type="text" id="prog-art-title" placeholder="Drawing Title / Topic" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none">
                    <input type="file" id="prog-art-file" accept="image/*" class="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-600 outline-none">
                    <button onclick="ProgressionEngine.uploadGalleryItem()" class="bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-2xs">Compress & Add</button>
                </div>
                <textarea id="prog-art-notes" rows="2" placeholder="Critique notes, anatomical checks, lessons..." class="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 outline-none resize-none"></textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${gallery.length === 0 ? `<div class="col-span-2 p-8 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">No drawing photos added yet.</div>` : gallery.slice().reverse().map(item => `
                    <div class="p-3.5 bg-white border border-slate-200/80 rounded-2xl flex gap-3 shadow-2xs">
                        <img src="${item.imageUrl}" class="w-24 h-24 object-cover rounded-xl border border-slate-100 shrink-0 bg-slate-100">
                        <div class="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between">
                                    <h5 class="font-bold text-xs text-slate-800 truncate">${item.title}</h5>
                                    <button onclick="ProgressionEngine.deleteGalleryItem('${item.id}')" class="text-slate-300 hover:text-rose-500 p-0.5">×</button>
                                </div>
                                <span class="text-[10px] font-mono text-slate-400">${item.date}</span>
                                <p class="text-[11px] text-slate-600 mt-1 line-clamp-3 leading-snug">${item.notes || 'No reflections.'}</p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Actions
    addMetricPrompt() {
        const val = prompt("Enter variable name (e.g. '2v2 MMR', 'Subscribers', 'Dropshot'):");
        if (!val || !val.trim()) return;
        const p = this.getActiveProjectObj();
        p.progression.metrics = p.progression.metrics || [];
        if (!p.progression.metrics.includes(val.trim())) {
            p.progression.metrics.push(val.trim());
            saveStateLocally();
            this.render();
        }
    },

    removeMetric(name) {
        const p = this.getActiveProjectObj();
        p.progression.metrics = (p.progression.metrics || []).filter(m => m !== name);
        saveStateLocally();
        this.render();
    },

    saveMetricEntry() {
        const metric = document.getElementById('prog-input-metric')?.value;
        const value = parseFloat(document.getElementById('prog-input-value')?.value);
        const notes = document.getElementById('prog-input-notes')?.value.trim();
        if (isNaN(value)) return alert("Please enter a numeric value.");

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
        this.render();
    },

    deleteMetricEntry(id) {
        const p = this.getActiveProjectObj();
        p.progression.entries = (p.progression.entries || []).filter(e => e.id !== id);
        saveStateLocally();
        this.render();
    },

    // Canvas Compression (Max 400x400 JPEG @ 0.7 quality to preserve local storage quota)
    uploadGalleryItem() {
        const title = document.getElementById('prog-art-title')?.value.trim() || 'Visual Study';
        const notes = document.getElementById('prog-art-notes')?.value.trim() || '';
        const fileInput = document.getElementById('prog-art-file');
        const file = fileInput?.files?.[0];
        if (!file) return alert("Select an image to upload.");

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxDim = 400;

                if (width > height && width > maxDim) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else if (height > maxDim) {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Export lightweight JPEG (~25KB)
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

                const p = ProgressionEngine.getActiveProjectObj();
                p.progression.gallery = p.progression.gallery || [];
                p.progression.gallery.push({
                    id: 'pg-' + generateId(),
                    date: getLocalFormattedDate(new Date()),
                    title: title,
                    imageUrl: compressedDataUrl,
                    notes: notes
                });

                saveStateLocally();
                ProgressionEngine.render();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    deleteGalleryItem(id) {
        const p = this.getActiveProjectObj();
        p.progression.gallery = (p.progression.gallery || []).filter(g => g.id !== id);
        saveStateLocally();
        this.render();
    }
};
