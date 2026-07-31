import { useEffect, useState } from 'react';

const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src);

function preload(src) {
  return new Promise((resolve) => {
    if (isVideo(src)) {
      const video = document.createElement('video');
      video.muted = true;
      video.preload = 'auto';
      video.oncanplaythrough = resolve;
      video.onloadeddata = resolve;
      video.onerror = resolve;
      video.src = src;
    } else {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve;
      img.src = src;
    }
  });
}

const MAX_WAIT_MS = 6000;

export default function useAssetsLoaded(sources) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId;
    const timeout = new Promise((resolve) => { timeoutId = setTimeout(resolve, MAX_WAIT_MS); });
    Promise.race([Promise.all(sources.map(preload)), timeout]).then(() => {
      if (!cancelled) setLoaded(true);
    });
    return () => { cancelled = true; clearTimeout(timeoutId); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loaded;
}
