import { initAsciiGlitch } from './ascii-glitch.js';
import { initAsciiFrameFlicker } from './ascii-frame-flicker.js';
import { initCaseDrawer } from './case-drawer.js';
import { initStickyNav } from './sticky-nav.js';
import { initCasesRender } from './cases-render.js';
import { initTgLinks } from './tg-links.js';

document.addEventListener('DOMContentLoaded', () => {
  initCasesRender();
  initAsciiGlitch();
  initAsciiFrameFlicker();
  initCaseDrawer();
  initStickyNav();
  initTgLinks();
});
