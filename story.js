const voice = new Audio('assets/VoiceLines/ImSOSoftRN.mp3');
const validAudioMap = new Map();

const validAudioEntries = [
    ['init', new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13])],
    ['trashRace', new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 29, 30, 31, 32])],
    ['fine car', new Set([0])],
    ['Aegislash', new Set([0, 1, 2, 3, 4, 5, 6, 7])],
    ['Aggron', new Set([0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])],
    ['aids', new Set([0])],
    ['ass car', new Set([0, 1])],
    ['azumarill', new Set([0, 1, 2, 3, 4])],
    ['bellsprout', new Set([0])],
    ['big trix poops', new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])],
    ['brian robinson, rb 1 of the falcons', new Set([0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12])],
    ['finale', new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])],
    ['froakie', new Set([0])],
    ['gardevoir', new Set([1, 2, 3])],
    ['ghastly', new Set([0])],
    ['goat car', new Set([0])],
    ['goat win', new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])],
    ['gyarados', new Set([0])],
    ['hiv', new Set([0])],
    ['Ivysaur', new Set([0, 1])],
    ['kevin is gay', new Set([0, 1])],
    ['lucario', new Set([0, 1, 2])],
    ['Medicham', new Set([0, 1, 2, 3, 4, 5, 6, 7, 8])],
    ['Mewtwo X', new Set([0])],
    ['nidoran male', new Set([0])],
    ['oddish', new Set([0])],
    ['oof', new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])],
    ['Pelipper', new Set([0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12])],
    ['peniswine', new Set([0, 1, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 43, 44, 45, 46, 47, 48, 49, 52, 53, 54, 55, 57, 58, 59, 60, 63, 64])], ['pikachu', new Set([0])],
    ['shit car', new Set([0, 1])],
    ['skarmory', new Set([0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12])],
    ['slim win', new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14])],
    ['sniff', new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])],
    ['spinarak', new Set([0, 1, 2, 3])],
    ['suicune', new Set([0, 1, 2, 3])],
    ['superfuck', new Set([0, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])],
    ['Surskit', new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])],
    ['trevenaunt', new Set([0])],
    ['Vanillish', new Set([0, 1, 3])],
    ['Vikavolt', new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])],
];

validAudioEntries.forEach(([dir, set]) => validAudioMap.set(dir, set));

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let distortionNode = null;
let sourceNode = null;

function createDistortion(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1;
        curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    const waveshaper = audioCtx.createWaveShaper();
    waveshaper.curve = curve;
    // waveshaper.oversample = '4x';
    return waveshaper;
}

export class story {
    constructor(name, dialogue) {
        this.name = name;
        this.dialogue = dialogue;
        this.index = -1;
    }

    nextDialogue(drunk) {
        this.index += 1;
        this.setAudio(drunk);
        return (this.index < this.dialogue.length) ? this.dialogue[this.index] : 'Error: pussy';
    }

    resetIndex() {
        this.index = 0;
    }

    setAudio(drunk) {
        const dirSet = validAudioMap.get(this.name);
        voice.pause();

        if (!dirSet || !dirSet.has(this.index)) {
            return;
        }

        if (sourceNode) {
            sourceNode.disconnect();
        }

        if (!sourceNode) {
            sourceNode = audioCtx.createMediaElementSource(voice);
        }

        const dest = audioCtx.destination;

        if (drunk < 5) {
            // Apply distortion
            if (!distortionNode) {
                distortionNode = createDistortion(4000/drunk);
            }
            sourceNode.connect(distortionNode);
            distortionNode.connect(dest);
        } else {
            // Clean audio
            sourceNode.connect(dest);
        }

        voice.src = `assets/VoiceLines/${this.name}/${this.index}.mp3`;
        voice.load();
        voice.play().catch(() => { });
    }
}
export function playDialogue() {
    voice.play();
}