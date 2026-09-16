// --- Storage & Sync Engine (v9 -> v10 Migration) ---
const STORAGE_KEY_V9 = 'focus_flow_master_v9';
const STORAGE_KEY_V10 = 'focus_flow_master_v10';

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
const db = firebase.firestore();
const docRef = db.collection('focus_flow').doc('user_workspace');

let appState = {
    version: 10,
    activeProjectId: null,
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

function initializeAndMigrateStorage() {
    const rawV10 = localStorage.getItem(STORAGE_KEY_V10);
    if (rawV10) {
        try { return JSON.parse(rawV10); } catch(e) {}
    }
    const rawV9 = localStorage.getItem(STORAGE_KEY_V9);
    if (rawV9) {
        try {
            const v9 = JSON.parse(rawV9);
            const nowISO = new Date().toISOString();
            const state = Object.assign(appState, v9);
            state.version = 10;
            state.scratchpad = Array.isArray(v9.scratchpad) ? v9.scratchpad : [];
            state.sessionLogs = Array.isArray(v9.sessionLogs) ? v9.sessionLogs : [];
            state.projects = (v9.projects || []).map(p => ({
                ...p,
                createdAt: p.createdAt || nowISO,
                completedAt: p.completedAt || null,
                tasks: (p.tasks || []).map(t => ({
                    ...t,
                    createdAt: t.createdAt || nowISO,
                    microSteps: Array.isArray(t.microSteps) ? t.microSteps : [],
                    lastParkedContext: t.lastParkedContext || null
                }))
            }));
            localStorage.setItem(STORAGE_KEY_V10, JSON.stringify(state));
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
    appState.projects = [{
        id: initialId,
        parentId: null,
        title: 'Core Production Module',
        goal: 'Ship production ready client build with single-task workflows',
        deadline: getLocalFormattedDate(new Date(Date.now() + 7 * 86400000)),
        notes: 'Comprehensive project management metrics inside.',
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
                microSteps: [
                    { id: 'ms-1', title: 'Open SVG files', isCompleted: false },
                    { id: 'ms-2', title: 'Check bounds clipping', isCompleted: false }
                ],
                lastParkedContext: null
            }
        ]
    }];
    saveStateLocally();
}

function saveStateLocally() {
    localStorage.setItem(STORAGE_KEY_V10, JSON.stringify(appState));
}

function saveState() {
    syncHeaderInputsToState();
    saveStateLocally();
}

function manualCloudSave() {
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
        if (btn) btn.innerHTML = `Save Failed`;
    });
}

// Background auto-sync throttled to every 5 minutes
setInterval(() => {
    syncHeaderInputsToState();
    const cleanData = JSON.parse(JSON.stringify(appState));
    docRef.set(cleanData, { merge: true }).catch(err => console.warn("Auto-sync info:", err));
}, 5 * 60 * 1000);

// Real-time Firestore sync (ignores local pending writes)
docRef.onSnapshot((doc) => {
    if (doc.metadata && doc.metadata.hasPendingWrites) return;
    if (doc.exists) {
        const cloudData = doc.data();
        if (cloudData && Array.isArray(cloudData.projects) && cloudData.projects.length > 0) {
            appState = Object.assign(appState, cloudData);
            saveStateLocally();
            renderApp();
        }
    }
});
