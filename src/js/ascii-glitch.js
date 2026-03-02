import { ASCII_FRAMES } from '../data/ascii-frames.js';
import { CONTACT_ASCII_FRAMES } from '../data/contact-ascii-frames.js';

const FRAME_INTERVAL = 1200;
const CHAR_INTERVAL = 4;
const CHARS_PER_TICK = 100;

function fitScale(container, inner, frame, mode = 'contain') {
  if (!container || !inner || !frame) return;
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const iw = frame.scrollWidth;
  const ih = frame.scrollHeight;
  if (iw === 0 || ih === 0) return;
  const scale =
    mode === 'cover'
      ? Math.max(cw / iw, ch / ih)
      : Math.min(cw / iw, ch / ih, 1);
  inner.style.transform = `scale(${scale})`;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function typewriterTransition(frame, fromStr, toStr, onComplete) {
  if (!frame) return;

  const len = Math.min(fromStr.length, toStr.length);
  const indices = shuffleArray(Array.from({ length: len }, (_, i) => i));

  let charIndex = 0;
  const result = [...fromStr];

  function tick() {
    const end = Math.min(charIndex + CHARS_PER_TICK, indices.length);
    for (let i = charIndex; i < end; i++) {
      const idx = indices[i];
      result[idx] = toStr[idx];
    }
    charIndex = end;
    frame.textContent = result.join('');

    if (charIndex < indices.length) {
      setTimeout(tick, CHAR_INTERVAL);
    } else {
      frame.textContent = toStr;
      onComplete?.();
    }
  }

  tick();
}

function initAsciiForContainer(container, innerClass, frameClass, frames, opts = {}) {
  if (!container || !frames?.length) return;

  const inner = document.createElement('span');
  inner.className = innerClass;
  const frame = document.createElement('span');
  frame.className = frameClass;

  let currentFrame = 0;
  let isTransitioning = false;

  const fitMode = opts.fitMode || 'contain';
  const doFitScale = () => fitScale(container, inner, frame, fitMode);

  const setTransitioning = (val) => {
    if (opts.signalTransitioning) {
      container.dataset.transitioning = val ? 'true' : 'false';
    }
  };

  const nextFrame = () => {
    if (frames.length < 2) return;
    if (isTransitioning) return;

    const next = (currentFrame + 1) % frames.length;
    const fromStr = frames[currentFrame];
    const toStr = frames[next];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      frame.textContent = toStr;
      currentFrame = next;
      doFitScale();
      return;
    }

    isTransitioning = true;
    setTransitioning(true);
    typewriterTransition(frame, fromStr, toStr, () => {
      currentFrame = next;
      isTransitioning = false;
      setTransitioning(false);
      doFitScale();
    });
  };

  frame.textContent = frames[0];
  inner.appendChild(frame);
  container.appendChild(inner);
  requestAnimationFrame(() => requestAnimationFrame(doFitScale));

  const ro = new ResizeObserver(doFitScale);
  ro.observe(container);

  if (frames.length > 1) {
    setInterval(nextFrame, FRAME_INTERVAL);
  }
}

export function initAsciiGlitch() {
  const heroContainer = document.querySelector('.hero__ascii-art');
  if (heroContainer) {
    initAsciiForContainer(heroContainer, 'hero__ascii-inner', 'hero__ascii-frame', ASCII_FRAMES);
  }

  const contactContainer = document.querySelector('.contact__ascii-art');
  if (contactContainer) {
    initAsciiForContainer(contactContainer, 'contact__ascii-inner', 'contact__ascii-frame', CONTACT_ASCII_FRAMES, {
      signalTransitioning: true,
      fitMode: 'contain',
    });
  }
}
