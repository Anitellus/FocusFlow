// --- Core Shared Utilities ---
function generateId() { 
    return Math.random().toString(36).substr(2, 9); 
}

function getLocalFormattedDate(d) {
    const target = d || new Date();
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatTimeCompact(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds === null) totalSeconds = 0;
    const h = Math.floor(totalSeconds / 3600), m = Math.floor((totalSeconds % 3600) / 60), s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatTimeHuman(totalSeconds) {
    if (!totalSeconds || totalSeconds === 0) return '0m';
    const h = Math.floor(totalSeconds / 3600), m = Math.floor((totalSeconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatTimeFull(totalSeconds) {
    if (!totalSeconds || totalSeconds === 0) return '0m';
    const d = Math.floor(totalSeconds / 86400);
    const h = Math.floor((totalSeconds % 86400) / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    let parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0 || parts.length === 0) parts.push(`${m}m`);
    return parts.join(' ');
}

function safeCreateIcons() { 
    try { lucide.createIcons(); } catch(e) {} 
}

// --- Firebase & State Storage Engine ---
const STORAGE_KEY_V10 = 'focus_flow_master_v10';
const STORAGE_KEY_V11 = 'focus_flow_master_v11';

const firebaseConfig = {
    apiKey: "AIzaSyCzpHlAhANEmgZd3tMsfTnHGlbaK9L9sIM",
    authDomain: "focus-flow-app-87591.firebaseapp.com",
    projectId: "focus-flow-app-87591",
    storageBucket: "focus-flow-app-87591.firebasestorage.app",
    messagingSenderId: "233299198976",
    appId: "1:233299198976:web:721adeec2947aa06d384e5"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
const docRef = db.collection('focus_flow').doc('user_workspace');

let currentUser = null;
let firestoreUnsubscribe = null;

let appState = {
    version: 11,
    activeProjectId: null,
    sprintStartDate: new Date().toISOString(),
    sprintCycleDays: 30,
    saveStateDrawerOpen: false,
    parkingLotOpen: false,
    completedTasksDrawerOpen: false,
    audioFamily: 'woodblock',
    audioVolume: 80,
    audioMuted: false,
    bloomOpacity: 60,
    pickerPrimary: '#090d16',
    pickerSecondary: '#1e1b4b',
    pickerTertiary: '#4338ca',
    selectPattern: 'radial-center',
    mascotBehavior: 'roam',
    mascotScale: 1.0,
    hideUnlockBtn: false,
    jitterAudioBase: 300,
    jitterAudioWindow: 30,
    collapsedProjects: {},
    scratchpad: [],
    sessionLogs: [],
    projects: []
};

// --- Migration & Local Storage ---
function initializeAndMigrateStorage() {
    const rawV11 = localStorage.getItem(STORAGE_KEY_V11);
    if (rawV11) {
        try { return JSON.parse(rawV11); } catch(e) {}
    }
    const rawV10 = localStorage.getItem(STORAGE_KEY_V10);
    if (rawV10) {
        try {
            const v10 = JSON.parse(rawV10);
            const nowISO = new Date().toISOString();
            const state = Object.assign(appState, v10);
            state.version = 11;
            state.sprintStartDate = v10.sprintStartDate || nowISO;
            state.sprintCycleDays = v10.sprintCycleDays || 30;
            state.saveStateDrawerOpen = !!v10.saveStateDrawerOpen;
            state.parkingLotOpen = !!v10.parkingLotOpen;
            state.completedTasksDrawerOpen = !!v10.completedTasksDrawerOpen;
            state.scratchpad = Array.isArray(v10.scratchpad) ? v10.scratchpad : [];
            state.sessionLogs = Array.isArray(v10.sessionLogs) ? v10.sessionLogs : [];
            
            // Mark root projects beyond 4 as parked by default during migration
            let rootCount = 0;
            state.projects = (v10.projects || []).map(p => {
                const isRoot = !p.parentId;
                let isParked = p.isParked || false;
                if (isRoot) {
                    rootCount++;
                    if (rootCount > 4 && typeof p.isParked === 'undefined') isParked = true;
                }
                return {
                    ...p,
                    isParked: isParked,
                    createdAt: p.createdAt || nowISO,
                    completedAt: p.completedAt || null,
                    tasks: (p.tasks || []).map(t => ({
                        ...t,
                        createdAt: t.createdAt || nowISO,
                        microSteps: Array.isArray(t.microSteps) ? t.microSteps : [],
                        lastParkedContext: t.lastParkedContext || null
                    }))
                };
            });

            localStorage.setItem(STORAGE_KEY_V11, JSON.stringify(state));
            return state;
        } catch(e) {}
    }
    return null;
}

const loadedData = initializeAndMigrateStorage();
if (loadedData) {
    appState = loadedData;
} else {
    loadDefaultData();
}

function loadDefaultData() {
    const initialId = 'proj-' + generateId();
    appState.activeProjectId = initialId;
    appState.sprintStartDate = new Date().toISOString();
    appState.projects = [{
        id: initialId,
        parentId: null,
        title: 'Core Production Module',
        goal: 'Ship production ready client build with single-task workflows',
        deadline: getLocalFormattedDate(new Date(Date.now() + 7 * 86400000)),
        notes: 'Comprehensive project management metrics inside.',
        isParked: false,
        totalTimeSpent: 0,
        activeTaskId: 't-1',
        activeMascotId: 'm-shiba',
        createdAt: new Date().toISOString(),
        completedAt: null,
        tasks: [
            { 
                id: 't-1', 
                title: 'Verify custom matrix SVGs and animations', 
                estimatedTime: 1800, 
                actualTime: 0, 
                isCompleted: false, 
                deadline: '', 
                notes: 'Check all complexity steps.', 
                completionDate: null,
                createdAt: new Date().toISOString(),
                microSteps: [],
                lastParkedContext: null
            }
        ]
    }];
    saveStateLocally();
}

function saveStateLocally() {
    localStorage.setItem(STORAGE_KEY_V11, JSON.stringify(appState));
}

function syncHeaderInputsToState() {
    const p = (appState.projects || []).find(x => x.id === appState.activeProjectId) || (appState.projects || [])[0];
    if (!p) return;
    const tEl = document.getElementById('project-title-input');
    const gEl = document.getElementById('project-goal-input');
    const dEl = document.getElementById('project-deadline-input');
    const nEl = document.getElementById('project-notes-summary-input');
    if (tEl && tEl.value !== undefined) p.title = tEl.value;
    if (gEl && gEl.value !== undefined) p.goal = gEl.value;
    if (dEl && dEl.value !== undefined) p.deadline = dEl.value;
    if (nEl && nEl.value !== undefined) p.notes = nEl.value;
}

function saveState() {
    syncHeaderInputsToState();
    saveStateLocally();
}

// --- Data Export & Import Handlers ---
function exportDataJSON() {
    syncHeaderInputsToState();
    const cleanData = JSON.stringify(appState, null, 2);
    const blob = new Blob([cleanData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusflow-backup-${getLocalFormattedDate()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importDataJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported && Array.isArray(imported.projects)) {
                appState = Object.assign(appState, imported);
                saveStateLocally();
                renderApp();
                alert("Backup restored successfully into FocusFlow!");
            } else {
                alert("Invalid backup file format. Expected a FocusFlow JSON document.");
            }
        } catch(err) {
            alert("Failed to parse JSON file: " + err.message);
        }
    };
    reader.readAsText(file);
}

// --- Google Authentication & Cloud Sync ---
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => {
        console.error("Sign-in error:", err);
        alert("Google Sign-in failed: " + err.message);
    });
}

function signOutUser() {
    auth.signOut().then(() => {
        if (firestoreUnsubscribe) {
            firestoreUnsubscribe();
            firestoreUnsubscribe = null;
        }
    });
}

function renderAuthUI(user) {
    const container = document.getElementById('auth-status-container');
    if (!container) return;

    if (user) {
        container.innerHTML = `
            <div class="flex items-center justify-between bg-slate-200/60 rounded-xl px-2.5 py-1.5 text-xs">
                <span class="truncate font-semibold text-slate-700 text-[11px]" title="${user.email}">${user.email}</span>
                <button onclick="signOutUser()" class="text-rose-600 hover:text-rose-700 text-[10px] font-bold shrink-0 ml-1">Sign out</button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <button onclick="signInWithGoogle()" class="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 shadow-xs flex items-center justify-center gap-2 transition-colors">
                <i data-lucide="log-in" class="w-3.5 h-3.5 text-brand-600"></i> Sign in with Google
            </button>
        `;
    }
    safeCreateIcons();
}

function manualCloudSave() {
    if (!currentUser) {
        alert("Please sign in with Google before saving to the cloud.");
        return;
    }
    syncHeaderInputsToState();
    saveStateLocally();
    const btn = document.getElementById('btn-manual-save');
    if (btn) btn.innerHTML = `<i data-lucide="loader" class="w-3.5 h-3.5 animate-spin"></i> Saving...`;
    safeCreateIcons();

    const cleanData = JSON.parse(JSON.stringify(appState));
    docRef.set(cleanData, { merge: true }).then(() => {
        if (btn) btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i> Saved to Cloud!`;
        safeCreateIcons();
        setTimeout(() => {
            if (btn) btn.innerHTML = `<i data-lucide="cloud-upload" class="w-3.5 h-3.5"></i> Save State to Cloud`;
            safeCreateIcons();
        }, 2500);
    }).catch(err => {
        console.error("Cloud Save Error:", err);
        alert("Cloud Save Failed: " + err.message);
        if (btn) btn.innerHTML = `Save Failed`;
        safeCreateIcons();
    });
}

// Throttled background sync (active only when logged in)
setInterval(() => {
    if (!currentUser) return;
    syncHeaderInputsToState();
    const cleanData = JSON.parse(JSON.stringify(appState));
    docRef.set(cleanData, { merge: true }).catch(err => console.warn("Background auto-sync notice:", err));
}, 5 * 60 * 1000);

// Auth state listener: attaches Firestore listener only when signed in
auth.onAuthStateChanged(user => {
    currentUser = user;
    renderAuthUI(user);

    if (user) {
        if (firestoreUnsubscribe) firestoreUnsubscribe();
        firestoreUnsubscribe = docRef.onSnapshot((doc) => {
            if (doc.metadata && doc.metadata.hasPendingWrites) return;
            if (doc.exists) {
                const cloudData = doc.data();
                if (cloudData && Array.isArray(cloudData.projects) && cloudData.projects.length > 0) {
                    appState = Object.assign(appState, cloudData);
                    saveStateLocally();
                    if (typeof renderApp === 'function') renderApp();
                }
            }
        }, err => {
            console.error("Firestore Listener Error:", err);
            if (err.code === 'permission-denied') {
                alert("Permission denied. Check that the email in your Firestore rules matches: " + user.email);
            }
        });
    } else {
        if (firestoreUnsubscribe) {
            firestoreUnsubscribe();
            firestoreUnsubscribe = null;
        }
    }
});
