const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
const fullHtml = read('applicability-checker.html');
const widgetHtml = read('widget.html');
const baseline = {
    productType: 'hardware_software', craScope: 'commercial', euMarket: 'yes',
    connectivity: 'internet', euActivity: 'yes', companySize: 'medium',
    sector: 'manufacturing', industrialUse: 'yes',
};

function loadEvaluator(html) {
    const element = { classList: { add() {} }, appendChild() {}, addEventListener() {} };
    const context = vm.createContext({
        document: { querySelectorAll: () => [], getElementById: () => element, createElement: () => element },
        location: { search: '' }, URLSearchParams,
    });
    for (const [, script] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
        vm.runInContext(script, context);
    }
    return input => JSON.parse(JSON.stringify(context.evaluate(input)));
}

const full = loadEvaluator(fullHtml);
const widget = loadEvaluator(widgetHtml);
const cases = [
    ['listed EU manufacturer with industrial product', {}, ['applies', 'applies', 'applies']],
    ['small manufacturer needs exception review', { companySize: 'small' }, ['applies', 'maybe', 'applies']],
    ['unknown SME classification', { companySize: 'unknown' }, ['applies', 'maybe', 'applies']],
    ['transport hardware without IACS use', { sector: 'transport', industrialUse: 'no' }, ['applies', 'applies', 'not-applicable']],
    ['transport industrial software', { productType: 'software_only', sector: 'transport' }, ['applies', 'applies', 'applies']],
    ['health-sector commercial software without IACS use', { productType: 'software_only', sector: 'health', industrialUse: 'no' }, ['applies', 'applies', 'not-applicable']],
    ['declared MDR/IVDR product exclusion', { craScope: 'excluded', sector: 'health', industrialUse: 'no' }, ['not-applicable', 'applies', 'not-applicable']],
    ['uncertain product exclusion', { craScope: 'unknown' }, ['maybe', 'applies', 'applies']],
    ['product sold outside EU, organization operates in EU', { euMarket: 'no' }, ['not-applicable', 'applies', 'applies']],
    ['EU product sales, no declared EU entity activity', { euActivity: 'no' }, ['applies', 'not-applicable', 'applies']],
    ['planned EU product availability', { euMarket: 'planning' }, ['maybe', 'applies', 'applies']],
    ['unknown EU entity activity', { euActivity: 'unknown' }, ['applies', 'maybe', 'applies']],
    ['device/local connectivity still counts', { connectivity: 'local_network' }, ['applies', 'applies', 'applies']],
    ['no direct or indirect data connection', { connectivity: 'no' }, ['not-applicable', 'applies', 'applies']],
    ['unknown connectivity', { connectivity: 'unknown' }, ['maybe', 'applies', 'applies']],
    ['SaaS needs product/remote-processing review', { productType: 'saas' }, ['maybe', 'applies', 'applies']],
    ['small DNS/trust/public-telecom entity', { sector: 'special_digital', companySize: 'small' }, ['applies', 'applies', 'applies']],
    ['small cloud entity still needs size/exception review', { sector: 'digital', companySize: 'small' }, ['applies', 'maybe', 'applies']],
    ['finance requires DORA review', { sector: 'finance' }, ['applies', 'maybe', 'applies']],
    ['other activity is not an exclusion', { sector: 'other' }, ['applies', 'maybe', 'applies']],
    ['uncertain industrial use', { industrialUse: 'unknown' }, ['applies', 'applies', 'maybe']],
    ['conflicting OT and non-industrial answers', { productType: 'ot_ics', industrialUse: 'no' }, ['applies', 'applies', 'maybe']],
];

for (const [name, changes, statuses] of cases) {
    test(name, () => {
        for (const evaluate of [full, widget]) {
            const results = evaluate({ ...baseline, ...changes });
            expect(results.map(result => result.status)).toEqual(statuses);
            expect(results.map(result => result.id)).toEqual(['cra', 'nis2', 'iec62443']);
            expect(results[2].label).not.toMatch(/applies/i);
            for (const result of results) expect(result.source).toMatch(/^https:\/\//);
        }
    });
}

test('the questionnaires offer identical answers and agree on all 51,840 combinations', () => {
    const choices = {};
    for (const [, name, value] of fullHtml.matchAll(/<input type="radio" name="([^"]+)" value="([^"]+)"/g)) {
        (choices[name] ??= []).push(value);
    }
    const widgetChoices = {};
    for (const [, name, contents] of widgetHtml.matchAll(/<select id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
        widgetChoices[name] = [...contents.matchAll(/<option value="([^"]+)"/g)].map(match => match[1]);
    }
    expect(widgetChoices).toEqual(choices);
    expect(Object.keys(choices)).toEqual(Object.keys(baseline));
    const fields = Object.keys(choices);
    let count = 0;
    function compare(index, answers) {
        if (index === fields.length) {
            const a = JSON.stringify(full(answers));
            const b = JSON.stringify(widget(answers));
            if (a !== b) throw new Error('Checker disagreement: ' + JSON.stringify(answers));
            count++;
            return;
        }
        const key = fields[index];
        for (const value of choices[key]) compare(index + 1, { ...answers, [key]: value });
    }
    compare(0, {});
    expect(count).toBe(51840);
});

test('missing answers cannot produce an applicability conclusion', () => {
    for (const key of Object.keys(baseline)) {
        const answers = { ...baseline };
        delete answers[key];
        expect(full(answers)).toEqual([]);
        expect(widget(answers)).toEqual([]);
    }
});

const steps = [
    ['productType', 'craScope'], ['euMarket', 'connectivity'],
    ['euActivity', 'companySize'], ['sector', 'industrialUse'],
];

test.beforeEach(async ({ page }) => {
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
});

for (const [name, changes] of [cases[0], cases[5], cases[6], cases[8], cases[16]]) {
    test(`browser results agree: ${name}`, async ({ page }) => {
        const answers = { ...baseline, ...changes };
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto('/applicability-checker.html');
        for (let step = 0; step < steps.length; step++) {
            for (const key of steps[step]) await page.locator(`input[name="${key}"][value="${answers[key]}"]`).check();
            await page.locator('#btn' + (step + 1)).click();
        }
        await expect(page.locator('#results h2')).toBeFocused();
        const fullLabels = await page.locator('#resultCards .tag').allTextContents();
        const fullReasons = await page.locator('#resultCards .result-card > p:first-of-type').allTextContents();
        await expect(page.locator('#resultCards .result-card')).toHaveCount(3);
        await page.goto('/widget.html');
        for (const [key, value] of Object.entries(answers)) await page.locator('#' + key).selectOption(value);
        await page.getByRole('button', { name: 'Check applicability' }).click();
        await expect(page.locator('#results h2')).toBeFocused();
        expect(await page.locator('#resultList .tag').allTextContents()).toEqual(fullLabels);
        expect(await page.locator('#resultList .result > p:first-of-type').allTextContents()).toEqual(fullReasons);
        expect(errors).toEqual([]);
    });
}

test('full checker gates every step and allows answers to be revised', async ({ page }) => {
    await page.goto('/applicability-checker.html');
    for (let step = 0; step < steps.length; step++) {
        const button = page.locator('#btn' + (step + 1));
        await expect(button).toBeDisabled();
        const [first, second] = steps[step];
        await page.locator(`input[name="${first}"][value="${baseline[first]}"]`).check();
        await expect(button).toBeDisabled();
        await page.locator(`input[name="${second}"][value="${baseline[second]}"]`).check();
        await button.click();
    }
    await expect(page.locator('[data-framework="iec62443"] .tag')).toHaveText('Relevant standard');
    await page.getByRole('button', { name: 'Review answers' }).click();
    await expect(page.locator('#step4 h2')).toBeFocused();
    await page.locator('input[name="industrialUse"][value="no"]').check();
    await page.locator('#btn4').click();
    await expect(page.locator('[data-framework="iec62443"] .tag')).toHaveText('Not indicated');
});

test('standalone widget validates, resets and fits a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 600 });
    await page.goto('/widget.html?partner=TestPartner');
    await expect(page.locator('#partnerLine')).toContainText('TestPartner');
    await expect(page.locator('#checkBtn')).toBeDisabled();
    for (const [key, value] of Object.entries(baseline)) await page.locator('#' + key).selectOption(value);
    await page.locator('#checkBtn').click();
    await expect(page.locator('[data-framework="cra"]')).toContainText('11 September 2026');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await page.getByRole('button', { name: 'Start over' }).click();
    await expect(page.locator('#form h2')).toBeFocused();
    await expect(page.locator('#checkBtn')).toBeDisabled();
    for (const key of Object.keys(baseline)) await expect(page.locator('#' + key)).toHaveValue('');
    expect(widgetHtml).not.toMatch(/<script[^>]+src=/);
});
