import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'lumberjack',
      formats: ['es'],
      fileName: (format) => `index.js`,
      output: {
        dir: 'dist',
        entryFileNames: (format) => `${format.name}.js`,
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['chalk'],
      input: {
        main: resolve(__dirname, 'demo/index.html'),
      },
      output: {
        // Preserve module structure
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        dir: 'dist'
      }
    }
  }
});
