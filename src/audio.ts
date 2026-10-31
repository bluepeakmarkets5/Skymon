/** Original score and sound design. Every sample is synthesized locally with Web Audio. */
export type TrackName = 'title' | 'village' | 'battle' | 'inn' | 'shop' | 'victory' | 'defeat' | 'whiterun' | 'riften' | 'tundra' | 'rift' | 'gym' | 'gymBattle' | 'sanctuary';
export interface AudioSettings { master: number; music: number; sfx: number; dialogue: number; muted: boolean }
type Voice = 'flute' | 'lute' | 'string' | 'bass' | 'lead' | 'bell' | 'horn' | 'harp' | 'reed';
const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
const STORAGE = 'riverwood-audio-v1';
// Written for this game: D Dorian village theme, a warm G-major inn tune,
// and a D-minor battle theme. Numbers are MIDI pitches, zero is a rest.
interface Score { bpm: number; notes: number[]; roots: number[] }
const scores: Record<TrackName, Score> = {
  title: { bpm: 76, roots: [50, 48, 43, 45], notes: [74,0,77,0,79,77,74,0,72,0,74,0,69,0,0,0,67,0,69,72,74,0,77,0,76,74,72,0,69,0,0,0,74,0,77,79,81,0,79,77,74,0,72,74,69,0,0,0,67,69,72,0,74,72,69,67,69,0,74,0,74,0,0,0] },
  village: { bpm: 86, roots: [50, 43, 48, 45], notes: [74,0,77,79,77,0,74,0,72,74,69,0,67,0,69,0,74,0,77,0,79,81,79,77,74,0,72,0,69,0,0,0,72,0,74,77,76,0,74,72,69,0,67,69,72,0,74,0,77,79,77,74,72,0,69,67,69,0,74,0,74,0,0,0] },
  inn: { bpm: 104, roots: [43, 48, 50, 43], notes: [67,71,74,0,74,76,74,71,69,0,67,69,71,0,0,0,72,76,79,0,79,76,74,72,71,0,69,67,69,0,0,0,74,78,81,0,81,79,78,74,72,0,69,72,74,0,0,0,71,74,79,0,78,74,71,69,67,0,71,0,67,0,0,0] },
  shop: { bpm: 92, roots: [48, 45, 41, 43], notes: [72,0,76,0,79,0,76,74,72,0,67,0,69,0,0,0,69,0,72,0,76,0,74,72,69,0,64,0,67,0,0,0,65,0,69,0,72,0,74,72,69,0,65,0,67,0,0,0,67,0,71,0,74,0,76,74,71,0,67,0,72,0,0,0] },
  battle: { bpm: 158, roots: [38, 46, 41, 45], notes: [74,74,0,77,81,0,79,77,74,0,72,74,77,74,69,0,70,70,0,74,77,0,79,77,74,70,69,70,74,77,81,0,77,77,0,81,84,81,79,77,76,0,74,76,79,76,72,0,73,76,81,0,79,77,76,73,69,73,76,81,85,81,77,73] },
  victory: { bpm: 132, roots: [50, 55, 57, 50], notes: [74,0,74,74,74,0,81,0,79,81,83,0,86,0,0,0,83,81,79,0,78,0,74,0,76,78,79,81,86,0,0,0] },
  defeat: { bpm: 70, roots: [50, 46, 43, 45], notes: [74,0,0,72,0,0,69,0,0,0,65,0,0,0,0,0,67,0,0,69,0,0,73,0,0,0,74,0,0,0,0,0] },
  // Whiterun: a broad, rising D-Mixolydian horn call over strummed fifths.
  whiterun: { bpm: 94, roots: [50, 48, 55, 50, 50, 55, 48, 50], notes: [
    62,0,66,0,69,0,74,0,73,74,76,0,74,0,69,0,
    72,0,67,0,64,67,72,0,74,0,72,69,67,0,0,0,
    67,0,71,0,74,0,79,0,78,79,81,79,74,0,71,0,
    69,0,66,69,74,0,76,74,73,69,66,0,62,0,0,0,
    74,0,0,69,74,76,78,0,76,74,73,0,69,0,66,0,
    67,0,71,74,79,0,78,76,74,0,71,69,67,0,0,0,
    72,0,76,0,79,76,74,72,67,0,69,72,74,0,69,0,
    66,0,69,0,74,0,76,78,76,74,69,66,62,0,0,0,
  ] },
  // Riften: quiet A-minor canal music, plucked harp and a low woodwind reply.
  riften: { bpm: 82, roots: [45, 41, 43, 40, 45, 43, 41, 40], notes: [
    69,0,72,76,0,74,72,0,71,0,69,0,64,0,0,0,
    65,0,69,72,0,76,74,0,72,69,67,0,65,0,0,0,
    67,0,71,74,0,77,76,0,74,71,69,0,67,0,0,0,
    68,0,71,76,0,74,71,0,68,0,64,0,0,0,0,0,
    81,0,76,0,74,72,71,69,72,0,76,0,74,0,0,0,
    79,0,74,0,72,71,69,67,71,0,74,0,72,0,0,0,
    77,0,76,72,0,69,67,65,69,0,72,0,74,72,69,0,
    71,0,68,64,0,68,71,76,74,71,68,0,69,0,0,0,
  ] },
  // Tundra: generous rests and open fifths leave room for the wind.
  tundra: { bpm: 70, roots: [40, 45, 43, 38], notes: [
    76,0,0,0,78,0,79,0,83,0,0,81,79,0,0,0,
    81,0,0,0,76,0,74,0,73,0,0,76,81,0,0,0,
    79,0,0,0,74,0,71,0,74,0,0,76,79,0,0,0,
    78,0,0,76,74,0,73,0,74,0,0,0,76,0,0,0,
  ] },
  // The Rift: a wistful G-minor autumn melody, changing between flute and harp.
  rift: { bpm: 88, roots: [43, 39, 46, 41, 43, 46, 39, 38], notes: [
    79,0,77,74,0,70,72,0,74,0,70,0,67,0,0,0,
    75,0,74,70,0,67,65,0,67,0,70,0,75,0,0,0,
    77,0,74,0,70,72,74,0,77,79,77,74,70,0,0,0,
    72,0,69,0,65,67,69,0,72,74,72,69,65,0,0,0,
    67,0,70,74,0,79,81,0,82,0,81,79,77,74,70,0,
    74,0,77,0,82,0,81,77,74,0,72,70,72,0,0,0,
    75,0,74,70,0,67,65,0,63,0,67,70,75,0,74,0,
    69,0,66,0,62,66,69,74,72,69,66,0,67,0,0,0,
  ] },
  // Gym: measured training ostinato; the melody builds before settling to repeat.
  gym: { bpm: 118, roots: [48, 44, 41, 43], notes: [
    72,0,67,72,75,0,74,72,67,0,72,0,79,0,0,0,
    68,0,72,75,80,0,79,75,72,0,68,72,75,0,0,0,
    65,0,68,72,77,0,75,72,68,0,65,68,72,0,0,0,
    67,0,71,74,79,0,77,74,71,74,79,81,83,0,0,0,
  ] },
  // Gym battle: E-minor brass/chiptune duel, distinct syncopation and half-bar bass.
  gymBattle: { bpm: 174, roots: [40, 36, 43, 47, 40, 45, 36, 47], notes: [
    76,0,76,79,83,0,81,79,78,76,0,71,74,76,79,0,
    72,0,72,76,79,0,83,81,79,76,0,72,74,76,79,0,
    79,0,79,83,86,0,84,83,81,79,0,74,78,79,83,0,
    78,0,78,82,86,0,85,82,78,74,71,74,78,82,86,0,
    88,0,83,79,81,83,0,86,88,86,83,81,79,78,76,0,
    81,0,84,88,86,84,0,81,79,81,84,86,88,84,81,0,
    84,0,83,79,76,79,0,83,84,83,79,76,74,72,76,0,
    78,82,86,0,85,82,78,74,71,74,78,82,86,82,78,74,
  ] },
  // Sanctuary: a slow F-Lydian cradle song, harp harmonics over soft strings.
  sanctuary: { bpm: 62, roots: [41, 43, 45, 41], notes: [
    77,0,0,81,0,79,77,0,76,0,0,72,0,0,0,0,
    79,0,0,83,0,81,79,0,77,0,0,74,0,0,0,0,
    81,0,0,84,0,83,81,0,79,0,0,76,0,0,0,0,
    77,0,0,79,0,83,84,0,81,0,79,0,77,0,0,0,
  ] },

};

type ExpansionTrack = 'whiterun' | 'riften' | 'tundra' | 'rift' | 'gym' | 'gymBattle' | 'sanctuary';
interface Arrangement { lead: Voice; pluck: Voice; third: number; leadVolume: number; bassVolume: number; pluckVolume: number }
const arrangements: Record<ExpansionTrack, Arrangement> = {
  whiterun: { lead: 'horn', pluck: 'lute', third: 4, leadVolume: .095, bassVolume: .12, pluckVolume: .06 },
  riften: { lead: 'harp', pluck: 'lute', third: 3, leadVolume: .15, bassVolume: .095, pluckVolume: .055 },
  tundra: { lead: 'flute', pluck: 'harp', third: 3, leadVolume: .11, bassVolume: .075, pluckVolume: .035 },
  rift: { lead: 'flute', pluck: 'harp', third: 3, leadVolume: .11, bassVolume: .095, pluckVolume: .06 },
  gym: { lead: 'reed', pluck: 'lute', third: 3, leadVolume: .09, bassVolume: .12, pluckVolume: .055 },
  gymBattle: { lead: 'lead', pluck: 'harp', third: 3, leadVolume: .075, bassVolume: .15, pluckVolume: .05 },
  sanctuary: { lead: 'harp', pluck: 'bell', third: 4, leadVolume: .12, bassVolume: .065, pluckVolume: .025 },
};

export class AudioManager {
  settings: AudioSettings = { master: .7, music: .55, sfx: .75, dialogue: .4, muted: false };
  private ctx?: AudioContext;
  private master?: GainNode;
  private musicGain?: GainNode;
  private sfxGain?: GainNode;
  private dialogueGain?: GainNode;
  private trackBus?: GainNode;
  private noiseBuffer?: AudioBuffer;
  private ambientNodes: Array<{ source: AudioBufferSourceNode; gain: GainNode }> = [];
  private proximity = { river: 0, forge: 0, mill: 0 };
  private timer?: ReturnType<typeof setInterval>;
  private track: TrackName = 'title';
  private step = 0;
  private nextNote = 0;
  private lastAmbient = 0;
  private noteCount = 0;
  private effectCounts: Record<string, number> = {};
  private lastEffect: Record<string, number> = {};
  private paused = false;

  constructor() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE) || 'null');
      if (stored && typeof stored === 'object') {
        for (const key of ['master', 'music', 'sfx', 'dialogue'] as const) {
          if (typeof stored[key] === 'number') this.settings[key] = clamp(stored[key]);
        }
        this.settings.muted = stored.muted === true;
      }
    } catch { /* Private browsing and storage denial do not prevent playing. */ }
    if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.suspend(); else void this.resume();
    });
  }

  get diagnostics() {
    return { track: this.track, contextState: this.ctx?.state || 'not-initialized', noteCount: this.noteCount, effectCounts: { ...this.effectCounts } };
  }

  async unlock(): Promise<void> {
    try {
      if (!this.ctx) {
        const Constructor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Constructor) return;
        this.ctx = new Constructor();
        this.master = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();
        this.dialogueGain = this.ctx.createGain();
        this.master.connect(this.ctx.destination);
        this.musicGain.connect(this.master);
        this.sfxGain.connect(this.master);
        this.dialogueGain.connect(this.master);
        this.noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        let seed = 71823;
        for (let i = 0; i < data.length; i++) {
          seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
          data[i] = ((seed >>> 0) / 4294967296) * 2 - 1;
        }
        this.createAmbience();
        this.applySettings();
        this.setTrack(this.track);
        this.timer = setInterval(() => this.schedule(), 80);
      }
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.paused = false;
      this.nextNote = Math.max(this.ctx.currentTime + .04, this.nextNote);
      this.schedule();
    } catch { /* Safari may reject resuming outside a gesture; the next tap retries. */ }
  }

  applySettings(): void {
    for (const key of ['master', 'music', 'sfx', 'dialogue'] as const) this.settings[key] = clamp(this.settings[key]);
    const t = this.ctx?.currentTime || 0;
    this.master?.gain.setTargetAtTime(this.settings.muted ? 0 : this.settings.master, t, .03);
    this.musicGain?.gain.setTargetAtTime(this.settings.music, t, .03);
    this.sfxGain?.gain.setTargetAtTime(this.settings.sfx, t, .03);
    this.dialogueGain?.gain.setTargetAtTime(this.settings.dialogue, t, .03);
    try { localStorage.setItem(STORAGE, JSON.stringify(this.settings)); } catch { /* Optional persistence. */ }
  }

  setTrack(name: TrackName): void {
    const changed = this.track !== name;
    this.track = name;
    if (!this.ctx || !this.musicGain) return;
    if (!changed && this.trackBus) return;
    const t = this.ctx.currentTime;
    if (this.trackBus) {
      const old = this.trackBus;
      old.gain.cancelScheduledValues(t);
      old.gain.setTargetAtTime(0, t, .18);
      setTimeout(() => old.disconnect(), 1800);
    }
    this.trackBus = this.ctx.createGain();
    this.trackBus.gain.setValueAtTime(0, t);
    this.trackBus.gain.linearRampToValueAtTime(1, t + .65);
    this.trackBus.connect(this.musicGain);
    this.step = 0;
    this.nextNote = t + .08;
    this.updateAmbientGains();
  }

  private schedule(): void {
    if (!this.ctx || this.ctx.state !== 'running' || this.paused || !this.trackBus) return;
    const t = this.ctx.currentTime;
    if (this.nextNote < t - .5) this.nextNote = t + .03;
    const score = scores[this.track];
    const length = 30 / score.bpm;
    while (this.nextNote < t + .25) {
      // Fanfare and lament end cleanly; the next scene supplies its own track.
      if ((this.track === 'victory' || this.track === 'defeat') && this.step >= score.notes.length) break;
      const n = this.step % score.notes.length;
      const pitch = score.notes[n];
      const root = score.roots[Math.floor(n / 16) % score.roots.length];
      const arrangement = arrangements[this.track as ExpansionTrack];
      if (arrangement) {
        this.expansionPhrase(arrangement, pitch, root, length, n);
      } else {
        const isBattle = this.track === 'battle';
        const lead: Voice = isBattle ? 'lead' : this.track === 'shop' ? 'bell' : this.track === 'inn' ? 'lute' : 'flute';
        if (pitch) this.note(pitch, this.nextNote, length * 1.65, lead, isBattle ? .085 : .12, this.trackBus);
        if (this.step % 4 === 0) this.note(root - (isBattle ? 0 : 12), this.nextNote, length * 3.5, 'bass', .14, this.trackBus);
        if (this.step % 2 === 0) {
          const third = this.track === 'inn' || this.track === 'shop' || this.track === 'victory' ? 4 : 3;
          const interval = [0, 7, 12, third + 12][Math.floor(this.step / 2) % 4];
          this.note(root + interval, this.nextNote, length * 2.8, 'lute', isBattle ? .045 : .065, this.trackBus);
        }
        if (this.step % 16 === 0 && !isBattle) {
          this.note(root, this.nextNote, length * 15, 'string', .035, this.trackBus);
          this.note(root + 7, this.nextNote, length * 15, 'string', .025, this.trackBus);
        }
        if (isBattle) {
          if (this.step % 4 === 0) this.kick(this.nextNote, this.trackBus);
          if (this.step % 4 === 2) this.noise(this.nextNote, .16, 1300, .07, this.trackBus);
          this.noise(this.nextNote, .035, 7000, this.step % 2 ? .018 : .03, this.trackBus);
        } else if (this.track === 'inn' && this.step % 4 === 2) {
          this.noise(this.nextNote, .035, 1600, .025, this.trackBus);
        }
      }
      this.step++;
      this.nextNote += length;
    }
    if (t - this.lastAmbient > 2.5 && ['village', 'whiterun', 'riften', 'tundra', 'rift'].includes(this.track)) {
      this.lastAmbient = t;
      if (this.proximity.forge > .3) this.effect('hammer');
      if (this.proximity.mill > .3) this.effect('wheel');
      if (Math.random() < .35) this.effect('bird');
    }
  }

  private expansionPhrase(arrangement: Arrangement, pitch: number, root: number, length: number, n: number): void {
    const bus = this.trackBus!;
    const time = this.nextNote;
    const bar = Math.floor(n / 16);
    const thirds: Record<ExpansionTrack, number[]> = {
      whiterun: [4,4,4,4,4,4,4,4], riften: [3,4,4,4,3,4,4,4],
      tundra: [3,4,4,4], rift: [3,4,4,4,3,4,4,4],
      gym: [3,4,3,4], gymBattle: [3,4,4,4,3,3,4,4], sanctuary: [4,4,3,4],
    };
    const third = thirds[this.track as ExpansionTrack]?.[bar] ?? arrangement.third;
    const isCombat = this.track === 'gymBattle';
    const spacious = this.track === 'tundra' || this.track === 'sanctuary';
    let voice = arrangement.lead;
    if (this.track === 'rift' && bar % 2 === 1) voice = 'harp';
    if (isCombat && n >= 64) voice = 'horn';
    if (pitch) {
      this.note(pitch, time, length * (spacious ? 3.1 : voice === 'harp' ? 2.5 : 1.7), voice, arrangement.leadVolume, bus);
      if (isCombat && n % 8 === 0) this.note(pitch - 12, time, length * 1.6, 'horn', .045, bus);
    }
    const bassSpacing = spacious ? 8 : 4;
    if (this.step % bassSpacing === 0) {
      const fifth = (this.track === 'gym' || isCombat) && this.step % 8 === 4 ? 7 : 0;
      this.note(root - (isCombat ? 0 : 12) + fifth, time, length * (bassSpacing - .3), 'bass', arrangement.bassVolume, bus);
    }
    const pluckSpacing = spacious ? 4 : this.track === 'gym' || isCombat ? 1 : 2;
    if (this.step % pluckSpacing === 0) {
      const intervals = this.track === 'riften' ? [0,7,third + 12,7,12,7,third,7] : [0,7,12,third + 12,7,12,third + 12,7];
      const interval = intervals[Math.floor(this.step / pluckSpacing) % intervals.length];
      this.note(root + interval, time, length * (spacious ? 4 : 2.4), arrangement.pluck, arrangement.pluckVolume, bus);
    }
    if (this.step % 16 === 0) {
      const sustain = length * (isCombat ? 6 : 15);
      this.note(root, time, sustain, 'string', isCombat ? .018 : .028, bus);
      this.note(root + 7, time, sustain, 'string', isCombat ? .014 : .021, bus);
      if (this.track === 'whiterun') {
        this.note(root + third, time + .035, length * 4.5, 'lute', .045, bus);
        this.note(root + 7, time + .07, length * 4.5, 'lute', .035, bus);
      }
    }
    if (this.track === 'riften' && this.step % 16 === 12) {
      this.note(root + 12, time, length * 3.5, 'reed', .035, bus);
    }
    if (this.track === 'tundra' && this.step % 16 === 8) {
      this.note(root + 19, time, length * 6, 'flute', .025, bus);
    }
    if (isCombat) {
      if ([0,3,8,10].includes(this.step % 16)) this.kick(time, bus);
      if (this.step % 8 === 4 || this.step % 16 === 14) {
        this.noise(time, .17, 1700, .075, bus);
        this.note(38, time, .12, 'horn', .035, bus);
      }
      this.noise(time, this.step % 4 === 3 ? .075 : .025, 6500, this.step % 2 ? .022 : .032, bus);
      if (this.step % 32 === 31) this.noise(time + length / 2, .04, 2800, .045, bus);
    } else if (this.track === 'gym') {
      if (this.step % 8 === 0) this.kick(time, bus);
      if (this.step % 8 === 4) this.noise(time, .09, 950, .03, bus);
      if (this.step % 2 === 0) this.noise(time, .025, 3800, .012, bus);
    } else if (this.track === 'whiterun' && this.step % 8 === 0) {
      this.note(38, time, length * 2, 'bass', .045, bus);
      this.noise(time, .12, 360, .035, bus);
    }
  }

  private note(midi: number, time: number, duration: number, voice: Voice, volume: number, destination: AudioNode): void {
    if (!this.ctx) return;
    const c = this.ctx;
    const osc = c.createOscillator();
    const gain = c.createGain();
    const filter = c.createBiquadFilter();
    osc.type = voice === 'lead' ? 'square' : voice === 'string' || voice === 'horn' ? 'sawtooth' : voice === 'lute' || voice === 'reed' || voice === 'harp' ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(hz(midi), time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(voice === 'horn' ? 600 : voice === 'reed' ? 1600 : voice === 'harp' ? 5000 : voice === 'lead' ? 2800 : voice === 'string' ? 1100 : 3600, time);
    if (voice === 'horn') {
      filter.frequency.linearRampToValueAtTime(1800, time + Math.min(.12, duration / 3));
      filter.frequency.exponentialRampToValueAtTime(700, time + duration);
    }
    if (voice === 'harp') filter.frequency.exponentialRampToValueAtTime(1200, time + duration);
    const attack = voice === 'string' ? .3 : voice === 'horn' ? .055 : voice === 'reed' ? .025 : voice === 'flute' ? .045 : .006;
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + Math.min(attack, duration / 3));
    if (voice === 'lute' || voice === 'bell' || voice === 'harp') {
      gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    } else {
      gain.gain.setTargetAtTime(volume * .65, time + Math.min(attack + .05, duration * .5), .08);
      gain.gain.setTargetAtTime(.0001, time + duration * .76, Math.max(.01, duration * .08));
    }
    osc.connect(filter); filter.connect(gain); gain.connect(destination);
    osc.start(time); osc.stop(time + duration + .15);
    osc.onended = () => { osc.disconnect(); filter.disconnect(); gain.disconnect(); };
    this.noteCount++;
  }

  private sweep(start: number, end: number, duration: number, volume: number, type: OscillatorType = 'sine', offset = 0, bus?: AudioNode): void {
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime + offset;
    const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(start, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(10, end), t + duration);
    gain.gain.setValueAtTime(.0001, t); gain.gain.linearRampToValueAtTime(volume, t + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, t + duration);
    osc.connect(gain); gain.connect(bus || this.sfxGain);
    osc.start(t); osc.stop(t + duration + .03);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  }

  private noise(time: number, duration: number, frequency: number, volume: number, destination: AudioNode, endFrequency?: number): void {
    if (!this.ctx || !this.noiseBuffer) return;
    const source = this.ctx.createBufferSource(); source.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.Q.value = .65;
    filter.frequency.setValueAtTime(frequency, time);
    if (endFrequency) filter.frequency.exponentialRampToValueAtTime(endFrequency, time + duration);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(.0001, time); gain.gain.linearRampToValueAtTime(volume, time + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    source.connect(filter); filter.connect(gain); gain.connect(destination);
    source.start(time); source.stop(time + duration + .03);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
  }

  private kick(time: number, destination: AudioNode): void {
    if (!this.ctx) return;
    const oscillator = this.ctx.createOscillator(); const gain = this.ctx.createGain();
    oscillator.frequency.setValueAtTime(125, time); oscillator.frequency.exponentialRampToValueAtTime(42, time + .17);
    gain.gain.setValueAtTime(.15, time); gain.gain.exponentialRampToValueAtTime(.0001, time + .2);
    oscillator.connect(gain); gain.connect(destination); oscillator.start(time); oscillator.stop(time + .21);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }

  effect(name: string, variant = 0): void {
    if (!this.ctx || this.ctx.state !== 'running' || !this.sfxGain || !this.dialogueGain) return;
    const t = this.ctx.currentTime;
    const minGap = name === 'blip' ? .035 : name === 'step' || name === 'grass' ? .13 : .045;
    if (t - (this.lastEffect[name] ?? -10) < minGap) return;
    this.lastEffect[name] = t;
    this.effectCounts[name] = (this.effectCounts[name] || 0) + 1;
    const bus = this.sfxGain;
    const noise = (duration: number, frequency: number, volume: number, delay = 0, end?: number) => this.noise(t + delay, duration, frequency, volume, bus, end);
    const sweep = (a: number, b: number, d: number, v: number, type: OscillatorType = 'sine', delay = 0) => this.sweep(a, b, d, v, type, delay);
    const melody = (notes: number[], spacing = .09, volume = .16) => notes.forEach((n, i) => this.note(n, t + i * spacing, spacing * 2.6, 'bell', volume, bus));
    switch (name) {
      case 'blip': this.sweep(230 + (variant % 9) * 28, 190 + (variant % 9) * 28, .045, .07, 'triangle', 0, this.dialogueGain); break;
      case 'throw': sweep(260, 1100, .3, .13, 'triangle'); noise(.22, 2800, .12); break;
      case 'open': melody([74, 81, 86, 93], .06); noise(.23, 5200, .1); break;
      case 'roar':
      case 'intimidate':
        sweep(120, 48, 1.2, .27, 'sawtooth'); sweep(91, 41, 1.05, .22, 'triangle', .06);
        noise(1.25, 700, .6, 0, 180); noise(.5, 1200, .25, .18, 250); break;
      case 'cluck':
        sweep(640, 290, .09, .19, 'triangle'); sweep(780, 350, .12, .2, 'triangle', .13); sweep(700, 240, .22, .17, 'triangle', .29);
        noise(.08, 1800, .13); break;
      case 'bark': noise(.17, 650, .35); sweep(260, 100, .16, .16, 'sawtooth'); noise(.2, 500, .3, .23); break;
      case 'peck': sweep(1100, 180, .08, .2, 'square'); noise(.09, 2300, .18); break;
      case 'feather':
      case 'feather-storm':
        for (let i = 0; i < 5; i++) { noise(.22, 3500 + i * 300, .18, i * .09, 500); sweep(900 + i * 150, 330, .12, .07, 'triangle', i * .09); } break;
      case 'buff':
      case 'battle-cluck': melody([62, 69, 74, 77, 81], .09); this.effect('cluck'); break;
      case 'heal':
      case 'blessing':
      case 'hibernate': melody([62, 66, 69, 74, 78, 81, 86], .085, .12); break;
      case 'claw': noise(.22, 4000, .35, 0, 450); sweep(680, 80, .18, .16, 'sawtooth'); break;
      case 'maul': noise(.45, 850, .55, 0, 170); sweep(155, 30, .35, .3, 'triangle'); break;
      case 'hit':
      case 'damage': noise(.15, 1200, .3); sweep(160, 45, .12, .15, 'square'); break;
      case 'faint': sweep(440, 50, .7, .19, 'triangle'); noise(.3, 700, .13, .3); break;
      case 'level': melody([74, 78, 81, 86, 90], .12); break;
      case 'victory': melody([74, 74, 81, 86, 83, 86], .14); break;
      case 'defeat': melody([74, 72, 69, 65, 62], .2, .12); break;
      case 'step': noise(.055, variant % 2 ? 800 : 550, .08); break;
      case 'grass': noise(.09, 2400, .08); break;
      case 'door': sweep(180, 85, .15, .09, 'sawtooth'); noise(.08, 380, .22, .15); break;
      case 'hammer': sweep(1800, 1450, .25, .12, 'triangle'); sweep(2740, 2500, .17, .045, 'sine'); noise(.035, 3500, .2); break;
      case 'bird': sweep(1900, 3200, .12, .045); sweep(2800, 1800, .15, .04, 'sine', .17); sweep(2200, 2900, .1, .03, 'sine', .36); break;
      case 'fire': noise(.12, 1700, .1); noise(.07, 2800, .05, .18); break;
      case 'wheel': sweep(150, 120, .5, .035, 'triangle'); noise(.35, 400, .07); break;
      case 'wind': noise(1.5, 450, .1, 0, 850); break;
      case 'fox':
        // A fox's sharp double yip: nasal pitched attack and a breathy tail.
        this.animalVoice(920, 600, .2, .15, 10, .045); noise(.12, 2400, .12);
        this.animalVoice(1050, 570, .28, .13, 12, .035, .24); break;
      case 'snowfox':
        this.animalVoice(1120, 800, .16, .12, 14, .045);
        this.animalVoice(1250, 880, .18, .11, 12, .035, .21);
        this.animalVoice(1000, 620, .3, .1, 10, .025, .44); break;
      case 'wolf':
        // A rising, wavering howl with a quiet lower octave underneath.
        this.animalVoice(340, 490, 1.6, .17, 5, .025);
        this.animalVoice(170, 245, 1.55, .07, 5, .02, .03);
        noise(.4, 500, .12, 1.2, 250); break;
      case 'mudcrab':
        // Chitin clicks and a low watery rasp.
        [0,.075,.21,.29].forEach((d, i) => { noise(.055, 2100 + i * 330, .16, d); sweep(240 + i * 40, 65, .065, .09, 'square', d); });
        noise(.28, 450, .13, .34, 200); break;
      case 'skeever':
        this.animalVoice(1700, 950, .14, .11, 18, .07); noise(.09, 3700, .06);
        this.animalVoice(2100, 1300, .19, .09, 20, .06, .18); break;
      case 'goat':
        this.animalVoice(390, 260, .8, .18, 15, .075);
        this.animalVoice(780, 520, .75, .035, 15, .07, .02); break;
      case 'sabrecat':
        this.animalVoice(125, 78, .95, .24, 28, .08);
        this.animalVoice(245, 130, .65, .12, 19, .055, .05);
        noise(.85, 780, .38, 0, 260); noise(.24, 2200, .2, .7, 550); break;
      case 'capture':
        melody([74,78,81,86,81,90,86], .095, .13);
        this.note(62, t + .57, .8, 'harp', .1, bus);
        noise(.18, 6500, .07, .5); break;
      case 'badge':
        [62,69,74,78,81,86].forEach((n, i) => this.note(n, t + i * .12, .55, 'horn', .095, bus));
        [62,66,69,74].forEach(n => this.note(n, t + .83, 1.25, 'harp', .06, bus));
        melody([86,90,93,98], .15, .055); break;
      case 'escape':
        noise(.45, 3500, .2, 0, 350); sweep(700, 150, .3, .1, 'triangle');
        sweep(450, 80, .3, .07, 'triangle', .1); break;
      case 'poison':
        [0,.13,.31,.48].forEach((d, i) => { sweep(160 + i * 30, 420 - i * 35, .11, .12, 'sine', d); noise(.07, 650, .1, d + .065); });
        sweep(510, 220, .45, .08, 'triangle', .35); break;
      case 'frost':
        [93,98,102,105,110,117].forEach((n, i) => this.note(n, t + i * .055, .42, 'bell', .065, bus));
        noise(.65, 6800, .14, 0, 2100); break;
      case 'select': melody([74, 81], .045, .08); break;
      case 'cancel': sweep(330, 220, .12, .07, 'triangle'); break;
      case 'intro': sweep(110, 440, .6, .16, 'sawtooth'); melody([50, 57, 62, 69, 74], .09); break;
      default: sweep(660, 440, .07, .07, 'triangle');
    }
  }

  /** Formant-filtered, gently modulated calls rather than prerecorded animal samples. */
  private animalVoice(start: number, end: number, duration: number, volume: number, wobble: number, depth: number, delay = 0): void {
    if (!this.ctx || !this.sfxGain) return;
    const time = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(start * .78, time);
    osc.frequency.exponentialRampToValueAtTime(start, time + Math.min(.09, duration * .25));
    osc.frequency.exponentialRampToValueAtTime(end, time + duration);
    mod.frequency.value = wobble;
    modGain.gain.value = start * depth;
    mod.connect(modGain); modGain.connect(osc.frequency);
    filter.type = 'lowpass'; filter.Q.value = .9;
    filter.frequency.setValueAtTime(Math.max(550, start * 2.3), time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(300, end * 1.8), time + duration);
    gain.gain.setValueAtTime(.0001, time);
    gain.gain.linearRampToValueAtTime(volume, time + Math.min(.06, duration * .2));
    gain.gain.setTargetAtTime(volume * .6, time + duration * .35, .08);
    gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
    osc.connect(filter); filter.connect(gain); gain.connect(this.sfxGain);
    osc.start(time); mod.start(time); osc.stop(time + duration + .03); mod.stop(time + duration + .03);
    osc.onended = () => { osc.disconnect(); mod.disconnect(); modGain.disconnect(); filter.disconnect(); gain.disconnect(); };
  }

  ambience(river: number, forge: number, mill: number): void {
    this.proximity = { river: clamp(river), forge: clamp(forge), mill: clamp(mill) };
    this.updateAmbientGains();
  }

  private createAmbience(): void {
    if (!this.ctx || !this.noiseBuffer || !this.sfxGain) return;
    // Filtered continuous noise creates water, gentle wind, and hearth crackle.
    for (const [freq, q, rate] of [[1300, .2, .8], [240, .45, .6], [2700, .6, 1.15]]) {
      const source = this.ctx.createBufferSource(); source.buffer = this.noiseBuffer; source.loop = true; source.playbackRate.value = rate;
      const filter = this.ctx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = freq; filter.Q.value = q;
      const gain = this.ctx.createGain(); gain.gain.value = 0;
      source.connect(filter); filter.connect(gain); gain.connect(this.sfxGain); source.start();
      this.ambientNodes.push({ source, gain });
    }
  }

  private updateAmbientGains(): void {
    if (!this.ctx) return;
    const village = ['village', 'whiterun', 'riften', 'tundra', 'rift'].includes(this.track);
    const levels = [village ? this.proximity.river * .16 : 0, village ? (this.track === 'tundra' ? .045 : .025) : 0, village ? this.proximity.forge * .035 : this.track === 'inn' ? .015 : 0];
    this.ambientNodes.forEach((node, i) => node.gain.gain.setTargetAtTime(levels[i], this.ctx!.currentTime, .5));
  }

  suspend(): void { this.paused = true; if (this.ctx?.state === 'running') void this.ctx.suspend().catch(() => {}); }
  async resume(): Promise<void> { if (this.ctx) { await this.unlock(); this.nextNote = this.ctx.currentTime + .05; } }
  destroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.ambientNodes.forEach(n => { n.source.stop(); n.source.disconnect(); n.gain.disconnect(); });
    this.ambientNodes = [];
    if (this.ctx) void this.ctx.close();
  }
}

export const audio = new AudioManager();
