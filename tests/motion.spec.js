const { test, expect } = require('@playwright/test');

const cards = '.service-card, .offering-card, .value-card, .faq-item, .team-member, .engineer-card';
const pages = ['index.html', 'services.html', 'about.html', 'contact.html'];

async function expectReadableCards(page) {
    const elements = page.locator(cards);
    expect(await elements.count()).toBeGreaterThan(0);
    for (const element of await elements.all()) {
        await expect(element).toHaveCSS('opacity', '1');
        await expect(element).toHaveCSS('transform', 'none');
    }
}

test.beforeEach(async ({ page }) => {
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
});

for (const file of pages) {
    test(`${file}: reduced motion leaves all cards readable without entrance effects`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto('/' + file);
        await expectReadableCards(page);
        await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
        expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    });

    test(`${file}: cards remain readable without JavaScript`, async ({ browser }) => {
        const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'no-preference' });
        const page = await context.newPage();
        await page.route('https://fonts.googleapis.com/**', route => route.abort());
        await page.goto('http://127.0.0.1:4173/' + file);
        await expectReadableCards(page);
        await context.close();
    });
}

test('changing to reduced motion cancels active effects and reveals every card', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/index.html', { waitUntil: 'domcontentloaded' });
    // Hold the entrance midway to check cancellation, not just its finished state.
    await page.locator(cards).evaluateAll(elements => {
        for (const element of elements) {
            for (const animation of element.getAnimations()) {
                animation.pause();
                animation.currentTime = 300;
            }
        }
    });
    await expect(page.locator(cards).first()).not.toHaveCSS('opacity', '1');
    await expect(page.locator('.scroll-line')).toHaveCSS('animation-name', 'scrollPulse');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expectReadableCards(page);
    await expect(page.locator('.scroll-line')).toHaveCSS('animation-name', 'none');
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
});

test('reduced motion keeps buttons and card arrows stationary on hover', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/index.html');
    for (const selector of ['.btn-primary', '.btn-light', '.card-link']) {
        const element = page.locator(selector).first();
        await element.hover();
        await expect(element).toHaveCSS('transform', 'none');
        if (selector === '.card-link') {
            await expect(element.locator('svg')).toHaveCSS('transform', 'none');
            const gap = await element.evaluate(el => getComputedStyle(el).gap);
            await page.mouse.move(0, 0);
            await expect(element).toHaveCSS('gap', gap);
        }
    }
});

test('shared anchor scrolling follows live motion preference and keeps the header offset', async ({ page }) => {
    // Add a same-page link before the shared script initializes its handlers.
    await page.route('**/services.html', async route => {
        const response = await route.fetch();
        const body = (await response.text()).replace('<script src="script.js">',
            '<a id="motion-anchor" href="#integration">Integration</a><script src="script.js">');
        await route.fulfill({ response, body });
    });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/services.html');
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth');
    await page.evaluate(() => {
        const scrollTo = window.scrollTo.bind(window);
        window.scrollTo = options => {
            scrollTo(options);
            window.anchorScroll = { ...options, actualTop: window.scrollY };
        };
    });
    for (const preference of ['reduce', 'no-preference', 'reduce']) {
        await page.emulateMedia({ reducedMotion: preference });
        await page.evaluate(async () => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            // Let Chromium cancel the preceding smooth scroll before the next click.
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            document.getElementById('motion-anchor').click();
        });
        const scroll = await page.evaluate(() => window.anchorScroll);
        expect(scroll.behavior).toBe(preference === 'reduce' ? 'auto' : 'smooth');
        if (preference === 'reduce') {
            expect(Math.abs(scroll.actualTop - scroll.top)).toBeLessThan(1);
            const targetTop = await page.locator('#integration').evaluate(el => el.getBoundingClientRect().top);
            const headerHeight = await page.locator('.header').evaluate(el => el.offsetHeight);
            expect(Math.abs(targetTop - headerHeight - 20)).toBeLessThan(1);
        }
    }
});

test('Argus reduced motion disables card lift and native smooth scrolling', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/argus.html');
    const card = page.locator('.fw-card').first();
    await card.hover();
    await expect(card).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -3)');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(card).toHaveCSS('transform', 'none');
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
    // Firefox can finish native fragment navigation after the click task returns.
    // The CSS assertion above checks that the jump does not use smooth scrolling.
    await page.locator('a[href="#how"]').click();
    await expect(page).toHaveURL(/#how$/);
    await expect.poll(async () => {
        const top = await page.locator('#how').evaluate(el => el.getBoundingClientRect().top);
        return Math.abs(top);
    }).toBeLessThan(1);
});
