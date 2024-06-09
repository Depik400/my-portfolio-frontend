import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
// @ts-ignore
import eslint from 'vite-plugin-eslint';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.glb'],
  plugins: [
    vue(),
    eslint({
      exclude: [/virtual:/, /node_modules/]
    }),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
  ],
});
