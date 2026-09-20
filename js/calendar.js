// --- Neurodivergent Calendar & Temporal Horizons Engine ---
let calendarViewDate = new Date();

function renderCalendarView() {
    renderTemporalHorizons();
    renderMonthlyGrid();
    safeCreateIcons();
}

function navigateCalendarMonth(direction) {
    calendarViewDate.setMonth(calendarViewDate.getMonth() + direction);
    renderCalendarView();
}

function resetCalendarToToday() {
    calendarViewDate = new Date();
    renderCalendarView();
}

// 1. Temporal Horizon Deck (Today, Next 7 Days, Gentle Recalibration)
function renderTemporalHorizons() {
    const todayStr = getLocalFormattedDate(new Date());
    const sevenDaysLater = new Date(Date.now() + 7 * 86400000);
    const allItems = [];

    function isProjectParked(proj) {
        let curr = proj;
        while (curr) {
            if (curr.isParked) return true;
            if (!curr.parentId) break;
            curr = (appState.projects || []).find(p => p.id === curr.parentId);
        }
        return false;
    }

    // Collect all tasks and projects with deadlines
   (appState.projects || []).forEach(p => {
        if (isProjectParked(p)) return; // Suppress parked deadlines from horizons
        if (p.deadline) {
            allItems.push({ id: p.id, type: 'project', title: p.title, deadline: p.deadline, projectId: p.id, isCompleted: !!p.completedAt });
        }
        (p.tasks || []).forEach(t => {
            if (t.deadline) {
                allItems.push({ id: t.id, type: 'task', title: t.title, deadline: t.deadline, projectId: p.id, projectTitle: p.title, isCompleted: t.isCompleted });
            }
        });
    });

    const todayItems = allItems.filter(i => !i.isCompleted && i.deadline === todayStr);
    const weekItems = allItems.filter(i => !i.isCompleted && i.deadline > todayStr && new Date(i.deadline) <= sevenDaysLater);
    const recalibrateItems = allItems.filter(i => !i.isCompleted && i.deadline < todayStr);

    document.getElementById('horizon-count-today').textContent = `${todayItems.length} items`;
    document.getElementById('horizon-count-week').textContent = `${weekItems.length} items`;
    document.getElementById('horizon-count-recalibrate').textContent = `${recalibrateItems.length} items`;

    // Render Today
    const todayList = document.getElementById('horizon-list-today');
    todayList.innerHTML = todayItems.length === 0 
        ? `<p class="text-xs text-slate-400 italic py-2">No deadlines today. Sustainable pace.</p>`
        : todayItems.map(item => `
            <div onclick="jumpToItem('${item.type}', '${item.id}', '${item.projectId}')" class="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 cursor-pointer transition-colors text-xs">
                <span class="font-semibold text-slate-700 truncate">${item.type === 'project' ? '📁 ' : '🎯 '}${item.title}</span>
                <span class="text-[10px] font-mono font-bold text-emerald-600 shrink-0 ml-2">Today</span>
            </div>
        `).join('');

    // Render Next 7 Days
    const weekList = document.getElementById('horizon-list-week');
    weekList.innerHTML = weekItems.length === 0 
        ? `<p class="text-xs text-slate-400 italic py-2">Nothing scheduled in the next 7 days.</p>`
        : weekItems.map(item => `
            <div onclick="jumpToItem('${item.type}', '${item.id}', '${item.projectId}')" class="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 cursor-pointer transition-colors text-xs">
                <span class="font-semibold text-slate-700 truncate">${item.type === 'project' ? '📁 ' : '🎯 '}${item.title}</span>
                <span class="text-[10px] font-mono text-slate-500 shrink-0 ml-2">${item.deadline.slice(5)}</span>
            </div>
        `).join('');

    // Render Gentle Recalibration (No Red Shame Alarms)
    const recalibrateList = document.getElementById('horizon-list-recalibrate');
    recalibrateList.innerHTML = recalibrateItems.length === 0 
        ? `<p class="text-xs text-slate-400 italic py-2">Zero passed dates. Calendar is aligned.</p>`
        : recalibrateItems.map(item => `
            <div class="p-2.5 rounded-xl bg-white border border-amber-200/80 space-y-1.5 text-xs shadow-sm">
                <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-800 truncate">${item.type === 'project' ? '📁 ' : '🎯 '}${item.title}</span>
                    <span class="text-[9px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">${item.deadline}</span>
                </div>
                <div class="flex items-center gap-1.5 pt-1">
                    <span class="text-[9px] text-slate-400">Reschedule:</span>
                    <button onclick="rescheduleItem('${item.type}', '${item.id}', '${item.projectId}', 1)" class="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-700">+1 Day</button>
                    <button onclick="rescheduleItem('${item.type}', '${item.id}', '${item.projectId}', 3)" class="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-700">+3 Days</button>
                    <button onclick="rescheduleItem('${item.type}', '${item.id}', '${item.projectId}', 7)" class="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-700">+1 Week</button>
                </div>
            </div>
        `).join('');
}

// 2. Month Grid Renderer
function renderMonthlyGrid() {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('calendar-month-label').textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const todayStr = getLocalFormattedDate(new Date());

    // Map deadline items by date string
    const dateMap = {};
    (appState.projects || []).forEach(p => {
        if (p.deadline) {
            dateMap[p.deadline] = dateMap[p.deadline] || [];
            dateMap[p.deadline].push({ id: p.id, type: 'project', title: p.title, projectId: p.id, isCompleted: !!p.completedAt });
        }
        (p.tasks || []).forEach(t => {
            if (t.deadline) {
                dateMap[t.deadline] = dateMap[t.deadline] || [];
                dateMap[t.deadline].push({ id: t.id, type: 'task', title: t.title, projectId: p.id, isCompleted: t.isCompleted });
            }
        });
    });

    let gridHTML = '';
    // Leading blanks
    for (let i = 0; i < firstDay; i++) {
        gridHTML += `<div class="h-24 bg-slate-50/50 rounded-2xl border border-slate-100 opacity-40"></div>`;
    }

    // Days of month
    for (let day = 1; day <= totalDays; day++) {
        const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dStr === todayStr;
        const items = dateMap[dStr] || [];

        gridHTML += `
        <div class="h-24 p-1.5 rounded-2xl border ${isToday ? 'border-brand-500 bg-indigo-50/30' : 'border-slate-200/70 bg-white'} flex flex-col justify-between overflow-hidden shadow-sm">
            <div class="flex justify-between items-center px-1">
                <span class="text-xs font-mono font-bold ${isToday ? 'text-brand-600 bg-brand-100 px-1.5 py-0.2 rounded-full' : 'text-slate-500'}">${day}</span>
                ${items.length > 0 ? `<span class="text-[9px] font-mono text-slate-400 font-semibold">${items.length}</span>` : ''}
            </div>
            <div class="flex-1 overflow-y-auto space-y-1 mt-1">
                ${items.map(item => `
                    <div onclick="jumpToItem('${item.type}', '${item.id}', '${item.projectId}')" 
                         class="px-1.5 py-0.5 rounded text-[10px] font-medium truncate cursor-pointer transition-transform hover:scale-[1.02] ${item.isCompleted ? 'line-through bg-slate-100 text-slate-400' : (item.type === 'project' ? 'bg-indigo-100 text-indigo-800' : 'bg-brand-500 text-white shadow-xs')}" 
                         title="${item.title}">
                        ${item.title}
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    document.getElementById('calendar-days-grid').innerHTML = gridHTML;
}

// 1-Click Launchpad: Switch directly to Focus workspace on chosen task/project
function jumpToItem(type, id, projectId) {
    appState.activeProjectId = projectId;
    if (type === 'task') {
        const p = getActiveProject();
        if (p) p.activeTaskId = id;
    }
    saveStateLocally();
    switchView('focus');
}

// Compassionate 1-Click Rescheduling
function rescheduleItem(type, id, projectId, addDays) {
    const targetDate = new Date(Date.now() + addDays * 86400000);
    const newDateStr = getLocalFormattedDate(targetDate);
    
    if (type === 'project') {
        const proj = (appState.projects || []).find(p => p.id === id);
        if (proj) proj.deadline = newDateStr;
    } else {
        const proj = (appState.projects || []).find(p => p.id === projectId);
        if (proj) {
            const task = (proj.tasks || []).find(t => t.id === id);
            if (task) task.deadline = newDateStr;
        }
    }
    saveStateLocally();
    renderCalendarView();
}
