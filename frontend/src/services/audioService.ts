let audio: HTMLAudioElement | null = null;
let currentTrack: string | null = null;

export function playTrack(track: number | string, options?: { loop?: boolean; volume?: number }) {
  const trackStr = String(track);
  if (currentTrack === trackStr && audio && !audio.paused) return;

  const src = `/sound/${trackStr}.mp3`;

  if (!audio) {
    audio = new Audio(src);
  } else {
    audio.src = src;
  }

  audio.loop = options?.loop ?? true;
  audio.volume = typeof options?.volume === 'number' ? options!.volume : 0.6;
  audio.play().catch(err => {
    // play can fail on autoplay policy; ignore silently
    console.log('Audio play prevented or failed:', err);
  });
  currentTrack = trackStr;
}

export function stop() {
  if (audio) {
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (e) {}
    currentTrack = null;
  }
}

export function getCurrentTrack() {
  return currentTrack;
}
