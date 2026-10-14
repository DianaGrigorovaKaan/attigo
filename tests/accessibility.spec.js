const { test, expect } = require('@playwright/test');

const sitePages = ['index', 'services', 'about', 'contact', 'argus', 'applicability-checker'];

test.beforeEach(async ({ page }) => {
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
});

for (const name of sitePages) {
    for (const javaScriptEnabled of [true, false]) {
        test(`${name}: skip navigation with JavaScript ${javaScriptEnabled ? 'on' : 'off'}`, async ({ browser }) => {
            const context = await browser.newContext({ javaScriptEnabled });
            const page = await context.newPage();
            await page.route('https://fonts.googleapis.com/**', route => route.abort());
            await page.goto('http://127.0.0.1:4173/' + name + '.html');
            await page.keyboard.press('Tab');
            const skip = page.getByRole('link', { name: 'Skip to main content' });
            await expect(skip).toBeFocused();
            await expect(skip).toBeInViewport();
            await page.keyboard.press('Enter');
            await expect(page.getByRole('main')).toBeFocused();
            await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toHaveCount(1);
            await page.keyboard.press('Tab');
            expect(await page.evaluate(() => !!document.activeElement.closest('main'))).toBe(true);
            await context.close();
        });
    }
}

for (const name of [...sitePages, 'widget']) {
    test(`${name}: reflow, enlarged text and text spacing`, async ({ page }) => {
        // 320 CSS px corresponds to a 1280px-wide viewport at 400% browser zoom.
        // Exercise text-only enlargement separately, including fixed-pixel fonts.
        for (const [width, enlarged] of [[320, false], [1280, true]]) {
            await page.setViewportSize({ width, height: 900 });
            await page.goto('/' + name + '.html');
            if (enlarged) await page.evaluate(() => {
                const sizes = [...document.querySelectorAll('body *')].map(el => [el, parseFloat(getComputedStyle(el).fontSize)]);
                for (const [el, size] of sizes) el.style.fontSize = `${size * 2}px`;
            });
            await page.addStyleTag({ content: `
                * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }
                p { margin-bottom: 2em !important; }
            ` });
            const overflow = await page.evaluate(() => ({
                page: document.documentElement.scrollWidth - innerWidth,
                // Also catch content hidden by a clipping ancestor, not just page scrolling.
                elements: [...document.querySelectorAll('main *')].filter(el => {
                    if (el.closest('pre, select')) return false;
                    const box = el.getBoundingClientRect();
                    return box.width && (box.right > innerWidth + 1 || box.left < -1);
                }).map(el => el.tagName + '.' + el.className),
            }));
            expect(overflow, `${name}, width ${width}, enlarged ${enlarged}`).toEqual({ page: 0, elements: [] });
        }
    });
}

test('full checker works with radio keys and keeps focus on each step', async ({ page }) => {
    await page.goto('/applicability-checker.html');
    for (let step = 1; step <= 4; step++) {
        for (const group of await page.locator(`#step${step} fieldset`).all()) {
            const first = group.getByRole('radio').first();
            await first.focus();
            await page.keyboard.press('Space');
            await page.keyboard.press('ArrowDown');
            await expect(group.getByRole('radio').nth(1)).toBeChecked();
            await expect(group.getByRole('radio').nth(1)).toBeFocused();
        }
        await page.locator('#btn' + step).focus();
        await page.keyboard.press('Enter');
        await expect(page.locator(step === 4 ? '#results h2' : `#step${step + 1} h2`)).toBeFocused();
    }
    await page.getByRole('button', { name: 'Review answers' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#step4 h2')).toBeFocused();
});

for (const name of ['index', 'services', 'about', 'contact']) {
    test(`${name}: keyboard focus stays below the fixed header`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 600 });
        await page.goto('/' + name + '.html');
        // Tab backwards from the footer: the browser must scroll earlier links
        // into view below the header, rather than hiding them behind it.
        await page.locator('footer a').first().focus();
        const links = await page.locator('main a[href]').count();
        for (let i = 0; i < links; i++) {
            await page.keyboard.press('Shift+Tab');
            await expect.poll(() => page.evaluate(() => {
                const focused = document.activeElement;
                const box = focused.getBoundingClientRect();
                const header = document.querySelector('body > .header').getBoundingClientRect();
                return box.bottom > header.bottom && box.top < innerHeight;
            })).toBe(true);
            expect(await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle)).not.toBe('none');
        }
    });
}
