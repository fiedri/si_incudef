import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
  build:{
    target: ['chrome87', 'safari14', 'es2020']
  }
});
