import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm build && pnpm preview',
		port: 4173
	},

	testDir: 'tests/e2e',
	projects: [
		// Setup project
		{
			name: 'workout teardown',
			use: { storageState: 'playwright/.auth/user.json' },
			testMatch: /workout\.teardown\.ts/
		},
		{ name: 'auth setup', testMatch: /auth\.setup\.ts/, teardown: 'workout teardown' },
		{
			name: 'authenticated chromium',
			testDir: 'tests/e2e/authenticated',
			use: {
				...devices['Desktop Chrome'],
				// Use prepared auth state.
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['auth setup']
		},

		{
			name: 'authenticated firefox',
			testDir: 'tests/e2e/authenticated',
			use: {
				...devices['Desktop Firefox'],
				// Use prepared auth state.
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['auth setup']
		}
	]
});
