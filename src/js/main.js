import { initAsciiGlitch } from './ascii-glitch.js';
import { initAsciiFrameFlicker } from './ascii-frame-flicker.js';
import { initGallery } from './gallery.js';
import { initStickyNav } from './sticky-nav.js';
import { initCasesRender } from './cases-render.js';
import { initTgLinks } from './tg-links.js';

document.addEventListener('DOMContentLoaded', () => {
  initCasesRender();
  initAsciiGlitch();
  initAsciiFrameFlicker();
  initGallery();
  initStickyNav();
  initTgLinks();
});
