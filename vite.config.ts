import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { svelteTesting } from '@testing-library/svelte/vite';
import svg from '@poppanator/sveltekit-svg';

export default defineConfig({
	plugins: [
		sveltekit(),
		svelteTesting(),
		svg(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			injectRegister: false,

			pwaAssets: {
				disabled: false,
				config: true
			},

			manifest: {
				name: 'Workout',
				short_name: 'Workout',
				description: 'Workout',
				theme_color: '#ffffff'
			},

			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
				cleanupOutdatedCaches: true,
				clientsClaim: true
			},

			devOptions: {
				enabled: false,
				navigateFallback: 'index.html',
				suppressWarnings: true,
				type: 'module'
			}
		})
	],

	test: {
		setupFiles: ['./vitest.setup.ts'],
		include: ['tests/**/*.test.ts'],
		globals: true,
		environment: 'happy-dom',
		css: true
	},
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined
});
