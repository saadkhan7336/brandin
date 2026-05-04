/**
 * Plays a pleasant two-tone notification chime using the Web Audio API.
 * No external audio files needed — runs entirely in the browser.
 */
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // Notes: C5 → E5 (pleasant rising chime)
    const notes = [523.25, 659.25];
    const noteLength = 0.12; // seconds each

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + i * (noteLength + 0.04);
      const endTime = startTime + noteLength;

      // Soft attack + decay envelope
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

      oscillator.start(startTime);
      oscillator.stop(endTime);
    });

    // Auto-close context after sound finishes
    setTimeout(() => ctx.close(), 1000);
  } catch (err) {
    // Silently fail — never crash the app over a sound
    console.warn('Notification sound failed:', err);
  }
}
