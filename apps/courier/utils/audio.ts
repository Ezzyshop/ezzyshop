// Looping alarm for new orders, built on the Web Audio API so no binary asset is
// required. Telegram/iOS block audio until a user gesture, so `unlockAudio()` must
// be called from within a tap handler (e.g. the login button) before the alarm can play.

let audioCtx: AudioContext | null = null;
let loopTimer: ReturnType<typeof setInterval> | null = null;
let unlocked = false;

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  return audioCtx;
};

/** Call from a user gesture to allow audio playback afterwards. */
export const unlockAudio = () => {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  unlocked = true;
};

export const isAudioUnlocked = () => unlocked;

const beep = () => {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.setValueAtTime(1180, now + 0.18);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.38);
};

/** Start the repeating alarm. No-op if audio has not been unlocked yet. */
export const startAlarm = () => {
  if (!unlocked || loopTimer) return;
  beep();
  loopTimer = setInterval(beep, 1500);
};

export const stopAlarm = () => {
  if (loopTimer) {
    clearInterval(loopTimer);
    loopTimer = null;
  }
};
