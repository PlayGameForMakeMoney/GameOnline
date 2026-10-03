// ======================
// Global AudioContext
// ======================
let audioCtx;

const getAudioCtx = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    return audioCtx;
};

// ======================
// Unlock AudioContext
// ======================
const unlockAudio = () => {
    const ctx = getAudioCtx();

    if (ctx.state === 'suspended') {
        ctx.resume();
    }
};

document.addEventListener('pointerdown', unlockAudio, {
    once: true,
    passive: true
});

// ======================
// Mute / Unmute
// ======================
window.isMuted = false;

const muteBtn = document.getElementById('muteBtn');

if (muteBtn) {
    muteBtn.textContent = window.isMuted ? '🔇' : '🔊';

    muteBtn.addEventListener('click', () => {
        window.isMuted = !window.isMuted;
        muteBtn.textContent = window.isMuted ? '🔇' : '🔊';

        if (window.isMuted) {
            stopFrictionSound();
        }
    });
}

// ======================
// Button / Click Sound
// ======================
let soundPlaying = false;

const playButtonSound = () => {
    if (window.isMuted || soundPlaying) return;

    soundPlaying = true;

    const ctx = getAudioCtx();

    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = 'square';
    o.frequency.value = 800;

    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.08
    );

    o.connect(g);
    g.connect(ctx.destination);

    o.start();
    o.stop(ctx.currentTime + 0.08);

    o.onended = () => {
        soundPlaying = false;
    };
};

// Spin button click sound
if (typeof spinBtn !== 'undefined' && spinBtn) {
    spinBtn.addEventListener(
        'pointerdown',
        () => {
            playButtonSound();
        },
        { passive: true }
    );
}

// ======================
// Spin End Sounds
// ======================
const segmentSounds = {
    0: { type:'sawtooth', freq:800, duration:0.25, gain:0.5 },
    1: { type:'square', startFreq:700, endFreq:180, duration:0.6, gain:0.85 },
    9: { type:'square', startFreq:750, endFreq:150, duration:0.65, gain:0.85 },
    2: { type:'triangle', freq:450, duration:0.2, gain:0.15 },
    3: { type:'square', freq:520, duration:0.18, gain:0.15 },
    4: { type:'square', freq:880, duration:0.25, gain:0.5 },
    5: { type:'sine', freq:700, duration:0.16, gain:0.15 },
    6: { type:'triangle', freq:400, duration:0.19, gain:0.15 },
    7: { type:'square', freq:550, duration:0.21, gain:0.15 },
    8: { type:'sawtooth', freq:750, duration:0.22, gain:0.5 },
    10: { type:'sine', freq:620, duration:0.2, gain:0.15 },
    11: { type:'triangle', freq:530, duration:0.18, gain:0.15 },
    12: { type:'sawtooth', freq:900, duration:0.25, gain:0.5 },
    13: { type:'sawtooth', freq:490, duration:0.17, gain:0.15 },
    14: { type:'sine', freq:660, duration:0.2, gain:0.15 },
    15: { type:'triangle', freq:470, duration:0.18, gain:0.15 }
};

let spinEndPlaying = false;

const playSpinEndSound = i => {
    if (window.isMuted || spinEndPlaying) return;

    const s = segmentSounds[i];

    if (!s) return;

    spinEndPlaying = true;

    const ctx = getAudioCtx();

    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = s.type;

    if (s.startFreq && s.endFreq) {
        o.frequency.setValueAtTime(
            s.startFreq,
            ctx.currentTime
        );

        o.frequency.exponentialRampToValueAtTime(
            s.endFreq,
            ctx.currentTime + s.duration
        );
    } else {
        o.frequency.value = s.freq;
    }

    g.gain.setValueAtTime(
        s.gain || 0.15,
        ctx.currentTime
    );

    g.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + s.duration
    );

    o.connect(g);
    g.connect(ctx.destination);

    o.start();
    o.stop(ctx.currentTime + s.duration);

    o.onended = () => {
        spinEndPlaying = false;
    };
};

// ======================
// Warning Sound
// ======================
let warningPlaying = false;

const playWarningSound = () => {
    if (window.isMuted || warningPlaying) return;

    warningPlaying = true;

    const ctx = getAudioCtx();

    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = 'sawtooth';
    o.frequency.value = 300;

    g.gain.setValueAtTime(0.2, ctx.currentTime);

    g.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.4
    );

    o.connect(g);
    g.connect(ctx.destination);

    o.start();
    o.stop(ctx.currentTime + 0.4);

    o.onended = () => {
        warningPlaying = false;
    };
};

// ======================
// Success / Incorrect
// ======================
const playGameSuccessSound = () => {
    if (window.isMuted) return;

    const ctx = getAudioCtx();

    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = 'triangle';

    o.frequency.setValueAtTime(
        500,
        ctx.currentTime
    );

    o.frequency.exponentialRampToValueAtTime(
        1000,
        ctx.currentTime + 0.3
    );

    g.gain.setValueAtTime(
        0.5,
        ctx.currentTime
    );

    g.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.35
    );

    o.connect(g);
    g.connect(ctx.destination);

    o.start();
    o.stop(ctx.currentTime + 0.35);
};

const playIncorrectSound = () => {
    if (window.isMuted) return;

    const ctx = getAudioCtx();

    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = 'square';

    o.frequency.setValueAtTime(
        800,
        ctx.currentTime
    );

    g.gain.setValueAtTime(
        5,
        ctx.currentTime
    );

    g.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.3
    );

    o.connect(g);
    g.connect(ctx.destination);

    o.start();
    o.stop(ctx.currentTime + 0.3);
};

// ======================
// Friction / Spin Sound
// ======================
let frictionRunning = false;

let frictionSources = {};
let frictionGains = {};
let frictionFilters = {};
let ampLFOs = {};

const layers = {
    low: {
        amp: 0.08,
        gain: 0.18,
        filterFreq: 350,
        lfoFreq: 0.25,
        lfoGain: 0.015
    },

    high: {
        amp: 0.04,
        gain: 0.12,
        filterFreq: 1000,
        lfoFreq: 0.4,
        lfoGain: 0.01
    }
};

const createLayer = type => {
    const ctx = getAudioCtx();

    const buf = ctx.createBuffer(
        1,
        ctx.sampleRate,
        ctx.sampleRate
    );

    const data = buf.getChannelData(0);

    for (let i = 0; i < ctx.sampleRate; i++) {
        data[i] =
            (Math.random() * 2 - 1) *
            layers[type].amp;
    }

    frictionSources[type] =
        ctx.createBufferSource();

    frictionSources[type].buffer = buf;
    frictionSources[type].loop = true;

    frictionFilters[type] =
        ctx.createBiquadFilter();

    frictionFilters[type].type =
        type === 'low'
            ? 'lowpass'
            : 'highpass';

    frictionFilters[type].frequency.value =
        layers[type].filterFreq;

    frictionGains[type] =
        ctx.createGain();

    frictionGains[type].gain.value =
        layers[type].gain;

    ampLFOs[type] =
        ctx.createOscillator();

    ampLFOs[type].type = 'sine';

    ampLFOs[type].frequency.value =
        layers[type].lfoFreq;

    const lfoGain = ctx.createGain();

    lfoGain.gain.value =
        layers[type].lfoGain;

    ampLFOs[type].connect(lfoGain);
    lfoGain.connect(frictionGains[type].gain);

    frictionSources[type]
        .connect(frictionFilters[type]);

    frictionFilters[type]
        .connect(frictionGains[type]);

    frictionGains[type]
        .connect(ctx.destination);

    frictionSources[type].start();
    ampLFOs[type].start();
};

const startFrictionSound = () => {
    if (
        frictionRunning ||
        !pointerSpinning ||
        window.isMuted
    ) {
        return;
    }

    Object.keys(layers).forEach(createLayer);

    frictionRunning = true;
};

const stopFrictionSound = () => {
    if (!frictionRunning) return;

    const ctx = getAudioCtx();
    const now = ctx.currentTime;

    Object.values(frictionGains).forEach(g => {
        g.gain.setTargetAtTime(
            0,
            now,
            0.002
        );
    });

    setTimeout(() => {
        Object.values(frictionSources).forEach(s => {
            try {
                s?.stop();
            } catch {}
        });

        Object.values(ampLFOs).forEach(o => {
            try {
                o?.stop();
            } catch {}
        });

        frictionSources = {};
        frictionGains = {};
        frictionFilters = {};
        ampLFOs = {};

        frictionRunning = false;
    }, 20);
};

const updateFrictionPitch = () => {
    if (
        window.isMuted ||
        !pointerSpinning
    ) {
        stopFrictionSound();

        requestAnimationFrame(
            updateFrictionPitch
        );

        return;
    }

    if (frictionRunning) {
        const s = Math.max(
            0,
            spinSpeedPointer
        );

        const ctx = getAudioCtx();
        const now = ctx.currentTime;

        frictionSources.low.playbackRate
            .setTargetAtTime(
                0.35 + s * 1.4,
                now,
                0.03
            );

        frictionFilters.low.frequency
            .setTargetAtTime(
                250 + s * 500,
                now,
                0.03
            );

        ampLFOs.low.frequency
            .setTargetAtTime(
                0.2 + s * 1.5,
                now,
                0.03
            );

        frictionGains.low.gain
            .setTargetAtTime(
                Math.max(0.02, s * s * 0.45),
                now,
                0.03
            );

        frictionSources.high.playbackRate
            .setTargetAtTime(
                0.45 + s * 1.8,
                now,
                0.03
            );

        frictionFilters.high.frequency
            .setTargetAtTime(
                800 + s * 900,
                now,
                0.03
            );

        ampLFOs.high.frequency
            .setTargetAtTime(
                0.3 + s * 2.5,
                now,
                0.03
            );

        frictionGains.high.gain
            .setTargetAtTime(
                Math.max(0.01, s * s * 0.28),
                now,
                0.03
            );
    }

    requestAnimationFrame(
        updateFrictionPitch
    );
};

const spinFrictionController = () => {
    if (
        pointerSpinning &&
        !window.isMuted
    ) {
        startFrictionSound();
    } else {
        stopFrictionSound();
    }

    requestAnimationFrame(
        spinFrictionController
    );
};

// ======================
// Start Audio Controllers
// ======================
updateFrictionPitch();
spinFrictionController();