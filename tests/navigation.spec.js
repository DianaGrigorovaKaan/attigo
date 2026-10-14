const { test, expect } = require('@playwright/test');

const pages = ['index.html', 'services.html', 'about.html', 'contact.html', 'argus.html', 'applicability-checker.html'];

test.beforeEach(async ({ page }) => {
    // Navigation checks should not depend on the external font service.
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
});

for (const file of pages) {
    test(`${file}: desktop keyboard disclosures and dismissal`, async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto('/' + file);
        const nav = page.getByRole('navigation', { name: 'Main navigation' });
        const products = nav.getByRole('button', { name: 'Products', includeHidden: true });
        const argus = nav.getByRole('link', { name: 'Argus', exact: true });
        await expect(nav.getByRole('button', { name: 'Menu', exact: true, includeHidden: true })).toBeHidden();
        await expect(products).toHaveAttribute('aria-controls', 'product-links');
        await expect(argus).toBeHidden();

        await products.focus();
        await page.keyboard.press('Enter');
        await expect(products).toHaveAttribute('aria-expanded', 'true');
        await page.keyboard.press('Tab');
        await expect(argus).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(argus).toBeHidden();
        await expect(products).toBeFocused();
        await expect(products).toHaveAttribute('aria-expanded', 'false');

        await page.keyboard.press('Space');
        await expect(argus).toBeVisible();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await expect(nav.getByRole('link', { name: 'About', exact: true })).toBeFocused();
        await expect(argus).toBeHidden();

        await products.click();
        await page.locator('h1').click();
        await expect(argus).toBeHidden();
        await products.click();
        await argus.click();
        await expect(page).toHaveURL(/\/argus\.html$/);
        expect(errors).toEqual([]);
    });

    for (const width of [320, 390, 768]) {
        test(`${file}: touch navigation at ${width}px`, async ({ browser }) => {
            const context = await browser.newContext({ viewport: { width, height: 844 }, hasTouch: true });
            const page = await context.newPage();
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            await page.route('https://fonts.googleapis.com/**', route => route.abort());
            await page.goto('http://127.0.0.1:4173/' + file);
            const nav = page.getByRole('navigation', { name: 'Main navigation' });
            const menu = nav.getByRole('button', { name: 'Menu', exact: true, includeHidden: true });
            const products = nav.getByRole('button', { name: 'Products', includeHidden: true });
            const argus = nav.getByRole('link', { name: 'Argus', exact: true });
            await expect(menu).toHaveAttribute('aria-controls', 'primary-navigation');
            await expect(menu).toHaveAttribute('aria-expanded', 'false');
            await expect(products).toBeHidden();
            await menu.tap();
            await expect(menu).toHaveAttribute('aria-expanded', 'true');
            await menu.tap();
            await expect(products).toBeHidden();
            await expect(menu).toHaveAttribute('aria-expanded', 'false');
            await menu.tap();
            await products.tap();
            await expect(argus).toBeVisible();
            await expect(menu).toHaveAttribute('aria-expanded', 'true');
            await products.tap();
            await expect(argus).toBeHidden();
            await products.tap();
            const bounds = await nav.locator('.navigation-links').boundingBox();
            expect(bounds.x).toBeGreaterThanOrEqual(0);
            expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
            await page.keyboard.press('Escape');
            await expect(products).toBeFocused();
            await expect(argus).toBeHidden();
            await page.keyboard.press('Escape');
            await expect(menu).toBeFocused();
            await expect(products).toBeHidden();

            await menu.tap();
            await products.tap();
            await argus.tap();
            await expect(page).toHaveURL(/\/argus\.html$/);
            await expect(menu).toHaveAttribute('aria-expanded', 'false');
            expect(errors).toEqual([]);
            await context.close();
        });
    }

    test(`${file}: resizing resets menus and preserves visible focus`, async ({ page }) => {
        await page.goto('/' + file);
        const nav = page.getByRole('navigation', { name: 'Main navigation' });
        const menu = nav.getByRole('button', { name: 'Menu', exact: true, includeHidden: true });
        const products = nav.getByRole('button', { name: 'Products', includeHidden: true });
        const argus = nav.getByRole('link', { name: 'Argus', exact: true });
        await products.click();
        await argus.focus();
        await page.setViewportSize({ width: 390, height: 844 });
        await expect(menu).toBeFocused();
        await expect(products).toBeHidden();
        await expect(products).toHaveAttribute('aria-expanded', 'false');
        await page.setViewportSize({ width: 1280, height: 900 });
        await expect(nav.getByRole('link', { name: 'Home', exact: true })).toBeFocused();
        await expect(menu).toHaveAttribute('aria-expanded', 'false');
        await expect(argus).toBeHidden();
    });

    test(`${file}: links remain available without JavaScript`, async ({ browser }) => {
        const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 844 } });
        const page = await context.newPage();
        await page.route('https://fonts.googleapis.com/**', route => route.abort());
        await page.goto('http://127.0.0.1:4173/' + file);
        const nav = page.getByRole('navigation', { name: 'Main navigation' });
        for (const name of ['Home', 'Services', 'Argus', 'About', 'Contact']) {
            await expect(nav.getByRole('link', { name, exact: true })).toBeVisible();
        }
        await context.close();
    });
}

test('anchor scrolling handles empty, malformed and selector-sensitive fragments', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // Exercise the shared handler against regression cases before it initializes.
    await page.route('**/index.html', async route => {
        const response = await route.fetch();
        const html = (await response.text()).replace('<script src="script.js">', `
            <a href="#" id="empty">Empty fragment</a>
            <a href="#%" id="malformed">Malformed fragment</a>
            <a href="#a:b" id="special">Special fragment</a>
            <div id="a:b">Target</div>
            <script src="script.js">`);
        await route.fulfill({ response, body: html });
    });
    await page.goto('/index.html');
    for (const id of ['empty', 'malformed', 'special']) await page.locator('#' + id).click();
    expect(errors).toEqual([]);
});
