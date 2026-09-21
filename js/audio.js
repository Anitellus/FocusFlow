// --- Web Audio Synthesis Engine ---
let audioCtx = null;
function getAudioContext() { 
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
    return audioCtx; 
}

// Ensure Audio Context is safely resumed upon first user interaction to bypass autoplay restrictions.
document.addEventListener('click', () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
}, { once: true });

function playSound(type) {
    if (appState.audioMuted) return;
    try {
        const ctx = getAudioContext(); 
        if (ctx.state === 'suspended') ctx.resume();
        const now = ctx.currentTime;
        const family = appState.audioFamily || 'woodblock';
        const vol = (appState.audioVolume / 100);

        if (type === 'start') {
            if (family === 'pip') {
                const osc = ctx.createOscillator(), g = ctx.createGain();
                osc.type = 'square'; osc.frequency.setValueAtTime(659.25, now);
                g.gain.setValueAtTime(0.12 * vol, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
                osc.connect(g); g.connect(ctx.destination); osc.start(now); osc.stop(now + 0.07);
            } else if (family === 'woodblock') {
                const osc = ctx.createOscillator(), g = ctx.createGain();
                osc.type = 'triangle'; osc.frequency.setValueAtTime(750, now);
                g.gain.setValueAtTime(0.35 * vol, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(g); g.connect(ctx.destination); osc.start(now); osc.stop(now + 0.09);
            } else {
                const osc = ctx.createOscillator(), g = ctx.createGain();
                osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, now);
                g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(0.3 * vol, now + 0.04);
                g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
                osc.connect(g); g.connect(ctx.destination); osc.start(now); osc.stop(now + 1.25);
            }
        } else if (type === 'complete') {
            if (family === 'pip') {
                [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
                    const osc = ctx.createOscillator(), g = ctx.createGain();
                    osc.type = 'square'; osc.frequency.setValueAtTime(f, now + i*0.1);
                    g.gain.setValueAtTime(0.08 * vol, now + i*0.1); g.gain.exponentialRampToValueAtTime(0.001, now + i*0.1 + 0.25);
                    osc.connect(g); g.connect(ctx.destination); osc.start(now + i*0.1); osc.stop(now + i*0.1 + 0.26);
                });
            } else if (family === 'woodblock') {
                [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
                    const osc = ctx.createOscillator(), g = ctx.createGain();
                    osc.type = 'triangle'; osc.frequency.setValueAtTime(f, now + i*0.18);
                    g.gain.setValueAtTime(0.3 * vol, now + i*0.18); g.gain.exponentialRampToValueAtTime(0.001, now + i*0.18 + 0.4);
                    osc.connect(g); g.connect(ctx.destination); osc.start(now + i*0.18); osc.stop(now + i*0.18 + 0.41);
                });
            } else {
                [440.00, 554.37, 659.25, 880.00].forEach((f, i) => {
                    const osc = ctx.createOscillator(), g = ctx.createGain();
                    osc.type = 'sine'; osc.frequency.setValueAtTime(f, now + i*0.25);
                    g.gain.setValueAtTime(0, now + i*0.25); g.gain.linearRampToValueAtTime(0.2 * vol, now + i*0.25 + 0.05);
                    g.gain.exponentialRampToValueAtTime(0.001, now + i*0.25 + 1.8);
                    osc.connect(g); g.connect(ctx.destination); osc.start(now + i*0.25); osc.stop(now + i*0.25 + 1.85);
                });
            }
        }
    } catch(e) {}
}

function toggleMuteAudio() {
    appState.audioMuted = !appState.audioMuted;
    const btn = document.getElementById('btn-mute-toggle');
    const icon = document.getElementById('audio-icon-display');
    if (btn) {
        btn.classList.toggle('bg-rose-100', appState.audioMuted);
        btn.textContent = appState.audioMuted ? "Unmute" : "Mute";
    }
    if (icon) icon.setAttribute('data-lucide', appState.audioMuted ? "volume-x" : "volume-2");
    safeCreateIcons();
    saveStateLocally();
}

function updateVolume(val) {
    appState.audioVolume = parseInt(val);
    document.getElementById('volume-label').textContent = val + '%';
    saveStateLocally();
}

function changeAudioFamily(val) {
    appState.audioFamily = val;
    playSound('start');
    saveStateLocally();
}

function updateJitterAudioSettings() {
    appState.jitterAudioBase = parseInt(document.getElementById('jitter-audio-base').value);
    appState.jitterAudioWindow = parseInt(document.getElementById('jitter-audio-window').value);
    saveStateLocally();
    if (isPlaying) scheduleNextAudioJitter();
}

function scheduleNextAudioJitter() {
    if (jitterAudioTimer) clearTimeout(jitterAudioTimer);
    if (!isPlaying) return;
    const base = appState.jitterAudioBase || 300;
    const windowSec = appState.jitterAudioWindow || 30;
    const offset = Math.floor(Math.random() * (windowSec * 2 + 1)) - windowSec;
    const intervalMs = Math.max(10, (base + offset)) * 1000;
    jitterAudioTimer = setTimeout(() => {
        if (isPlaying) {
            playSound('start');
            scheduleNextAudioJitter();
        }
    }, intervalMs);
}
