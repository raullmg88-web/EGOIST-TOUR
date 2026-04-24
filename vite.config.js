import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cosplayers: resolve(__dirname, 'cosplayers/index.html'),
        artistas: resolve(__dirname, 'artistas/index.html'),
        invitados: resolve(__dirname, 'invitados/index.html'),
        merch: resolve(__dirname, 'merch/index.html'),
        horarios: resolve(__dirname, 'horarios/index.html'),
        info: resolve(__dirname, 'info/index.html'),
        admin: resolve(__dirname, 'admin/index.html')
      }
    }
  }
});
