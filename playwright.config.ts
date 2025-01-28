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
		{ name: 'workout setup', testMatch: /auth\.setup\.ts/, teardown: 'workout teardown' },
		{
			name: 'workout chromium',
			testDir: 'tests/e2e/workout',
			use: {
				...devices['Desktop Chrome'],
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['workout setup']
		},
		{
			name: 'workout firefox',
			testDir: 'tests/e2e/workout',
			use: {
				...devices['Desktop Firefox'],
				storageState: 'playwright/.auth/user.json'
			},
			dependencies: ['workout setup']
		},
		{
			name: 'profile chromium',
			testDir: 'tests/e2e/profile',
			use: devices['Desktop Chrome']
		},
		{
			name: 'profile firefox',
			testDir: 'tests/e2e/profile',
			use: devices['Desktop Firefox']
		}
	]
});
