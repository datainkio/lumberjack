import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'lumberjack',
      formats: ['es'],
      fileName: (format) => `index.js`
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['chalk'],
      input: {
        index: resolve(__dirname, 'src/index.js'),
        demo: resolve(__dirname, 'demo/index.html'),
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        dir: 'dist',
        assetFileNames: (assetInfo) => {
          // Keep CSS files in demo folder
          if (assetInfo.names[0] && assetInfo.names[0].endsWith('.css')) {
            return 'demo/[name][extname]';
          }
          return '[name][extname]';
        }
      }
    }
  }
});
