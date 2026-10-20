/** How long an audio or video file plays, in whole seconds, read from the file itself; `undefined` when it cannot be told. */
export const probeDuration = (file: File): Promise<number | undefined> =>
  new Promise((resolve) => {
    if (typeof document === 'undefined' || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return resolve(undefined);
    const kind = file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : null;
    if (!kind) return resolve(undefined);

    const media = document.createElement(kind);
    const url = URL.createObjectURL(file);
    const finish = (seconds?: number) => {
      window.clearTimeout(timer);
      media.removeAttribute('src');
      media.load?.();
      URL.revokeObjectURL(url);
      resolve(seconds !== undefined && Number.isFinite(seconds) && seconds > 0 ? Math.round(seconds) : undefined);
    };
    const timer = window.setTimeout(() => finish(), 3000);
    media.preload = 'metadata';
    media.onloadedmetadata = () => finish(media.duration);
    media.onerror = () => finish();
    media.src = url;
  });

/** 0:42, 12:05, 1:02:03. */
export const formatDuration = (seconds: number): string => {
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
};
