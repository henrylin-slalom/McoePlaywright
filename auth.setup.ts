// auth.setup.ts
import { test as setup } from '@playwright/test';
import dotenv from 'dotenv';
import { promises } from 'fs';

dotenv.config();

const d365Sales = './.auth/d365sales.json';
const d365Portal = './.auth/d365portal.json';

setup('authenticate to d365 sales', async ({ page }) => {

    const result = await isFileExists(d365Sales);

    if (result) {
        return;
    }

    // Perform authentication steps.
    await page.goto(process.env.SALES_URL as string);
    await page.fill('input[type="email"]', process.env.SALES_USERNAME as string);
    await page.click('input[type="submit"]');
    await page.fill('input[type="password"]', process.env.SALES_PASSWORD as string);
    await page.click('input[type="submit"]');
    await page.click('input[value="Yes"]');

    await page.waitForURL((url) => url.href.includes(process.env.SALES_URL as string));

    // End of authentication steps.

    await page.context().storageState({ path: d365Sales });
});


setup('authenticate to d365 portal', async ({ page }) => {

    const result = await isFileExists(d365Portal);

    if (result) {
        return;
    }

    // Perform authentication steps.
    await page.goto(process.env.PORTAL_URL as string);
    await page.fill('input[type="email"]', process.env.PORTAL_USERNAME as string);
    await page.click('input[type="submit"]');
    await page.fill('input[type="password"]', process.env.PORTAL_PASSWORD as string);
    await page.click('input[type="submit"]');
    await page.click('input[value="Yes"]');

    await page.waitForURL((url) => url.href.includes(process.env.PORTAL_URL as string));

    // End of authentication steps.

    await page.context().storageState({ path: d365Portal });
});


async function isFileExists(path) {
    try {
        await promises.access(path);
        return true;
    } catch {
        return false;
    }
}
