// Add inside the appState object definition in js/storage.js
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

// Ensure JSON Export & Import handlers exist in js/storage.js
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
                alert("Backup restored successfully!");
            } else {
                alert("Invalid backup file format.");
            }
        } catch(err) {
            alert("Failed to parse JSON file.");
        }
    };
    reader.readAsText(file);
}
