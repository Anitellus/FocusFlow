// --- 20-Metric ADHD Telemetry Calculation Engine ---
function renderAnalytics(days) {
    document.querySelectorAll('.analytics-tab').forEach(t => {
        const tabDays = parseInt(t.dataset.days);
        t.className = tabDays === days 
            ? "analytics-tab px-4 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-white transition-colors shadow-sm"
            : "analytics-tab px-4 py-1.5 text-xs font-bold rounded-lg text-slate-500 hover:text-slate-800 transition-colors";
    });

    const now = new Date();
    const cutoff = days === 9999 ? new Date(0) : new Date(now.getTime() - days * 86400000);
    const logs = (appState.sessionLogs || []).filter(l => new Date(l.endedAt) >= cutoff);
    const allProjects = appState.projects || [];
    const allTasks = allProjects.flatMap(p => (p.tasks || []).map(t => ({ ...t, projectId: p.id, projectTitle: p.title })));

    // 1. Total Focused Time & Tasks Done (Preserves Archived Projects)
    let totalTimeSec = 0, completedTasks = 0, estTimeSec = 0;
    let logsHTML = '', dateBuckets = {};

    allTasks.forEach(t => {
        if (t.isCompleted && t.completionDate) {
            const cDate = new Date(t.completionDate);
            if (days === 9999 || cDate >= cutoff) {
                totalTimeSec += t.actualTime;
                completedTasks++;
                estTimeSec += t.estimatedTime;
                logsHTML += `<div class="px-6 py-3 flex justify-between items-center text-xs">
                    <span class="font-semibold text-slate-700 flex items-center gap-2">
                        <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-500"></i> ${t.title}
                        <span class="text-[10px] text-slate-400 font-normal">(${t.projectTitle})</span>
                    </span>
                    <span class="text-slate-500 font-mono">${formatTimeCompact(t.actualTime)}</span>
                </div>`;
            }
            const dStr = getLocalFormattedDate(cDate);
            dateBuckets[dStr] = (dateBuckets[dStr] || 0) + t.actualTime;
        }
    });

    // Fallback: If projects were deleted, tally time directly from verified session logs
    if (totalTimeSec === 0 && logs.length > 0) {
        totalTimeSec = logs.reduce((acc, l) => acc + (l.durationSeconds || 0), 0);
    }

    document.getElementById('stat-total-time').textContent = formatTimeHuman(totalTimeSec);
    document.getElementById('stat-tasks-done').textContent = completedTasks;
    const accuracy = estTimeSec === 0 ? 0 : Math.round((totalTimeSec / estTimeSec) * 100);
    document.getElementById('stat-accuracy').textContent = Math.min(accuracy, 200) + '%';
    document.getElementById('analytics-log-container').innerHTML = logsHTML || `<div class="p-6 text-xs text-slate-400 text-center">No completed tasks recorded in this time range.</div>`;

    // 2. Rolling Momentum Battery
    const DAILY_TARGET = 1500; // 25 min baseline
    const rollingBuckets = new Map();
    for (let i = 0; i < 7; i++) {
        const d = new Date(now.getTime() - i * 86400000);
        rollingBuckets.set(d.toISOString().split('T')[0], 0);
    }
    (appState.sessionLogs || []).forEach(l => {
        const ds = l.endedAt.split('T')[0];
        if (rollingBuckets.has(ds)) rollingBuckets.set(ds, rollingBuckets.get(ds) + l.durationSeconds);
    });
    let weightedEffort = 0;
    rollingBuckets.forEach(sec => { weightedEffort += Math.min(sec, DAILY_TARGET); });
    const batteryPct = Math.min(100, Math.round((weightedEffort / (5 * DAILY_TARGET)) * 100));
    document.getElementById('stat-battery-pct').textContent = batteryPct + '%';
    document.getElementById('stat-battery-bar').style.width = batteryPct + '%';

    // 3. Task Complexity Index (TCI)
    const validTasks = allTasks.filter(t => t.actualTime > 0);
    const sprints = validTasks.filter(t => t.actualTime < 900).length;
    const deepWork = validTasks.filter(t => t.actualTime >= 2700).length;
    const tci = (sprints + deepWork) > 0 ? (deepWork / (sprints + deepWork)).toFixed(2) : '0.0';
    document.getElementById('stat-tci').textContent = tci;

    // 4. Time-Blindness Underestimated Count
    const underest = allTasks.filter(t => t.isCompleted && t.estimatedTime > 0 && ((t.actualTime - t.estimatedTime) / t.estimatedTime) > 0.25).length;
    document.getElementById('stat-underestimated-count').textContent = underest;

    // 5. Context Switching Density
    let switches = 0;
    const totalHours = logs.reduce((acc, l) => acc + l.durationSeconds, 0) / 3600;
    for (let i = 1; i < logs.length; i++) {
        if (logs[i].taskId !== logs[i - 1].taskId) switches++;
    }
    const density = totalHours > 0 ? (switches / totalHours).toFixed(1) : '0';
    document.getElementById('stat-switching-density').textContent = `${density}/hr`;

    // 6. Zen Mode Ratio
    const zenSec = logs.filter(l => l.mode === 'zen').reduce((acc, l) => acc + l.durationSeconds, 0);
    const zenRatio = totalTimeSec > 0 ? Math.round((zenSec / totalTimeSec) * 100) : 0;
    document.getElementById('stat-zen-ratio').textContent = `${zenRatio}% Zen`;

    // 7. Weekend vs Weekday Split
    let weekdaySec = 0, weekendSec = 0;
    logs.forEach(l => {
        const day = new Date(l.endedAt).getDay();
        if (day === 0 || day === 6) weekendSec += l.durationSeconds; else weekdaySec += l.durationSeconds;
    });
    const splitTotal = weekdaySec + weekendSec;
    const wkEndPct = splitTotal > 0 ? Math.round((weekendSec / splitTotal) * 100) : 0;
    const wkDayPct = splitTotal > 0 ? Math.round((weekdaySec / splitTotal) * 100) : 0;
    document.getElementById('stat-weekend-split').textContent = `${wkDayPct}% Wk / ${wkEndPct}% End`;

    // 8. Circadian Chronotype Alignment (24h Distribution)
    const hours = new Array(24).fill(0);
    logs.forEach(l => {
        const h = new Date(l.startedAt || l.endedAt).getHours();
        hours[h] += Math.round(l.durationSeconds / 60);
    });
    const maxH = Math.max(...hours, 1);
    const peakH = hours.indexOf(Math.max(...hours));
    document.getElementById('stat-circadian-peak').textContent = hours[peakH] > 0 ? `${peakH}:00 - ${peakH+1}:00` : 'Logging sessions...';
    document.getElementById('circadian-bars-grid').innerHTML = hours.map(m => {
        const heightPct = Math.round((m / maxH) * 100);
        return `<div class="h-10 bg-slate-100 rounded-sm flex items-end overflow-hidden"><div class="w-full bg-amber-500 rounded-sm" style="height: ${heightPct}%" title="${m} mins"></div></div>`;
    }).join('');

    // 9. Dormant Projects Monitor (Object Permanence Guardian - Parked Excluded)
    const dormantList = document.getElementById('dormant-projects-list');
    
    function isProjectParked(proj) {
        let curr = proj;
        while (curr) {
            if (curr.isParked) return true;
            if (!curr.parentId) break;
            curr = allProjects.find(p => p.id === curr.parentId);
        }
        return false;
    }

    const dormantProjects = allProjects
        .filter(p => !p.completedAt && !isProjectParked(p))
        .map(p => {
            const times = (p.tasks || []).map(t => new Date(t.completionDate || t.createdAt || 0).getTime());
            const last = times.length > 0 ? Math.max(...times) : new Date(p.createdAt || 0).getTime();
            const daysDormant = Math.floor((now.getTime() - last) / 86400000);
            return { ...p, daysDormant };
        })
        .filter(p => p.daysDormant >= 14);

    if (dormantProjects.length === 0) {
        dormantList.innerHTML = `<p class="text-xs text-slate-400 italic">All active sprint projects have had recent momentum. Zero dormant containers.</p>`;
    } else {
        dormantList.innerHTML = dormantProjects.map(p => `
            <div class="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <span class="font-bold text-slate-700">${p.title} (${p.daysDormant} days untouched)</span>
                <button onclick="selectProject('${p.id}'); switchView('focus')" class="px-2.5 py-1 bg-brand-600 text-white font-bold rounded-lg text-[10px]">Reactivate</button>
            </div>
        `).join('');
    }

    // 10. 30-Day Heatmap
    let heatmapHTML = '';
    for (let i = 29; i >= 0; i--) {
        let d = new Date(now.getTime() - i * 86400000);
        let ds = getLocalFormattedDate(d);
        let time = dateBuckets[ds] || 0;
        let color = 'bg-slate-100';
        if (time > 0 && time <= 600) color = 'bg-emerald-200';
        else if (time > 600 && time <= 1800) color = 'bg-emerald-300';
        else if (time > 1800 && time <= 3600) color = 'bg-emerald-400';
        else if (time > 3600 && time <= 7200) color = 'bg-emerald-500';
        else if (time > 7200) color = 'bg-emerald-600';
        heatmapHTML += `<div class="w-full h-8 ${color} rounded-lg" title="${ds}: ${formatTimeHuman(time)}"></div>`;
    }
    document.getElementById('heatmap-grid').innerHTML = heatmapHTML;
    safeCreateIcons();
}
