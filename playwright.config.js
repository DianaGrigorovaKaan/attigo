const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    use: { baseURL: 'http://127.0.0.1:4173' },
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
                    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
                    : {},
            },
        },
        { name: 'firefox', use: { browserName: 'firefox' } },
        { name: 'webkit', use: { browserName: 'webkit' } },
    ],
    webServer: {
        command: 'node tests/server.js',
        url: 'http://127.0.0.1:4173',
    },
});
