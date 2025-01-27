import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm build && pnpm preview',
		port: 4173
	},

	testDir: 'tests/e2e',
	projects: [
		// Setup project
		{ name: 'setup', testMatch: /.*\.setup\.ts/ },
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				// Use prepared auth state.
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['setup']
		},

		{
			name: 'firefox',
			use: {
				...devices['Desktop Firefox'],
				// Use prepared auth state.
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['setup']
		}
	]
});
