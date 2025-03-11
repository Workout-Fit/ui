import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	workers: process.env.CI ? 1 : undefined,
	webServer: {
		command: 'pnpm dev',
		reuseExistingServer: true,
		port: 5173
	},

	testDir: 'tests/e2e',
	projects: [
		// Setup project
		{
			name: 'workout teardown',
			use: { storageState: 'playwright/.auth/user.json' },
			testMatch: /workout\.teardown\.ts/
		},
		{ name: 'workout setup', testMatch: /auth\.setup\.ts/, teardown: 'workout teardown' },
		{
			name: 'workout',
			testDir: 'tests/e2e/workout',
			use: {
				...devices['Desktop Chrome'],
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['workout setup']
		},
		{
			name: 'account',
			testDir: 'tests/e2e/account',
			use: devices['Desktop Chrome']
		}
	]
});
