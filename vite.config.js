import { defineConfig } from 'vite';
import { resolve } from 'path';
import { generateCasesHtml } from './scripts/pre-render-cases.js';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
  server: {
    open: true,
  },
  plugins: [
    {
      name: 'pre-render-cases',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          const casesHtml = generateCasesHtml();
          return html.replace('<div id="cases"></div>', `<div id="cases">\n${casesHtml}\n      </div>`);
        },
      },
    },
  ],
});
