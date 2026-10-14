const { test, expect } = require('@playwright/test');

const manualCopyMessage = 'Automatic copying is unavailable. Select the code above and copy it manually.';

test.beforeEach(async ({ page }) => {
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
});

test('Copy writes the complete embed snippet and announces success', async ({ page }) => {
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: async text => { window.copiedText = text; } }
        });
    });
    await page.goto('/argus.html');
    const button = page.getByRole('button', { name: 'Copy', exact: true });
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('Embed code copied.');
    expect(await page.evaluate(() => window.copiedText)).toBe(await page.locator('#embedCode').textContent());
    await expect(button).toBeEnabled();
});

for (const failure of ['missing API', 'permission denied', 'synchronous error']) {
    test(`Copy offers manual instructions without an uncaught error: ${failure}`, async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.addInitScript(failure => {
            window.unhandledRejections = [];
            window.addEventListener('unhandledrejection', event => {
                window.unhandledRejections.push(String(event.reason));
            });
            Object.defineProperty(navigator, 'clipboard', {
                value: failure === 'missing API' ? undefined : {
                    writeText: () => {
                        if (failure === 'synchronous error') throw new Error('Clipboard unavailable');
                        return Promise.reject(new DOMException('Clipboard denied', 'NotAllowedError'));
                    }
                }
            });
        }, failure);
        await page.goto('/argus.html');
        const button = page.getByRole('button', { name: 'Copy', exact: true });
        await button.click();
        await expect(page.getByRole('status')).toHaveText(manualCopyMessage);
        await expect(button).toBeEnabled();
        await page.locator('pre').focus();
        await expect(page.locator('pre')).toBeFocused();
        await expect(page.locator('#embedCode')).toContainText('https://attigo.dk/widget.html?partner=YourCompany');
        expect(errors).toEqual([]);
        expect(await page.evaluate(() => window.unhandledRejections)).toEqual([]);
    });
}

test('a denied copy can be retried successfully without stale feedback', async ({ page }) => {
    await page.addInitScript(() => {
        let attempts = 0;
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: async () => {
                    if (++attempts === 1) throw new DOMException('Clipboard denied', 'NotAllowedError');
                }
            }
        });
    });
    await page.goto('/argus.html');
    const button = page.getByRole('button', { name: 'Copy', exact: true });
    await button.click();
    await expect(page.getByRole('status')).toHaveText(manualCopyMessage);
    await button.click();
    await expect(page.getByRole('status')).toHaveText('Embed code copied.');
    await expect(button).toBeEnabled();
});

test('embed code remains available without JavaScript on a narrow screen', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
    const page = await context.newPage();
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.goto('http://127.0.0.1:4173/argus.html');
    await expect(page.getByRole('button', { name: 'Copy', exact: true, includeHidden: true })).toBeHidden();
    await expect(page.locator('#embedCode')).toBeVisible();
    await page.locator('pre').focus();
    await expect(page.locator('pre')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => page.locator('pre').evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
    await context.close();
});
