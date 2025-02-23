import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { svelteTesting } from '@testing-library/svelte/vite';
import { FontaineTransform } from 'fontaine';
import path from 'node:path';
import svg from '@poppanator/sveltekit-svg';

export default defineConfig({
	plugins: [
		FontaineTransform.vite({
			fallbacks: ['Segoe UI'],
			resolvePath: (id) => new URL(path.join(path.dirname(import.meta.url), 'node_modules', id))
		}),
		paraglide({ project: './project.inlang', outdir: './src/lib/paraglide' }),
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
				theme_color: '#000000',
				background_color: '#6200ee',
				display: 'standalone',
				orientation: 'portrait',
				scope: '/',
				start_url: '/'
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
		include: ['tests/unit/**/*.test.ts'],
		globals: true,
		environment: 'happy-dom',
		css: true
	},
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined
});
