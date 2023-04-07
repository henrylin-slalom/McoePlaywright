import { test, expect } from '@playwright/test';

test.describe(() => {
  test.use({ storageState: '.auth/d365sales.json'});

  test('create new opportunity and opp products', async ({ page }) => {
    await page.goto('https://org23bee85b.crm.dynamics.com/main.aspx?appid=e11f42c0-82c5-ed11-b597-000d3a9b7c9a&pagetype=entitylist&etn=opportunity');
    await page.waitForURL((url)=> url.href.includes("opportunity"));
    
    // Expect #1 hamburger menu to be visible.
    await expect(page.getByRole('button', { name: 'App launcher' })).toBeVisible({timeout:45000});

    //try to save without topic
    await page.getByRole('menuitem', { name: 'New', exact: true }).click();
    await page.getByRole('menuitem', { name: 'Save & Close' }).click();

    //Expect #2 Topic mandatory message to be shown
    await expect(page.getByText('Topic: Required fields must be filled in.')).toBeVisible();

    //fill fields
    await page.getByLabel('Topic', { exact: true }).fill( new Date().toString() + ' new opp');
    await page.getByRole('combobox', { name: 'Account, Lookup' }).fill("MCOE");
    await page.getByText('MCOE Potatoes and Tomatoes Co').click();
    await page.getByRole('combobox', { name: 'Purchase Timeframe' }).selectOption({ label: 'Immediate' });
    await page.getByLabel('Budget Amount').fill("9001");
    await page.getByRole('tab', { name: 'Products' }).click();
    await page.getByRole('combobox', { name: 'Price List, Lookup' }).fill("MCOE");
    await page.getByText('MCOE', { exact: true }).click();

    //Save
    await page.getByRole('menuitem', { name: 'Save (CTRL+S)' }).click();
    
    await page.waitForURL((url) => url.href.includes("id" as string));

    //add products
    page.getByRole('menuitem', { name: 'Add products' }).click();
    await page.getByRole('textbox', { name: 'Quantity This field is business required.' }).fill('10');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Save to opportunity' }).click();
    
    await expect(page.getByRole('textbox', { name: 'Total Amount' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Total Amount' })).toHaveValue('$42.90');

  
  });
});

