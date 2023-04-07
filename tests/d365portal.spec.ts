import { test, expect } from '@playwright/test';

test('d365 portal test', async ({ browser }) => {

  //get current date/time used for firstname
  const dateTimeNow = new Date().toString(); 

  // get portal context first
  const userContext = await browser.newContext({ storageState: '.auth/mcoeDemoPortal.json' });
  const userPage = await userContext.newPage();
  await userPage.goto('https://mcoe-playwrightdemo.powerappsportals.com/default/');

  //applicant info
  await userPage.getByLabel('First Name').fill(dateTimeNow);
  await userPage.getByLabel('Last Name').fill("Testing");
  await userPage.getByLabel('Email Address').fill("testerguy@thisisatest.com");
  await userPage.getByPlaceholder('Provide a telephone number').fill('867-5309');
  await userPage.getByRole('button', { name: 'Next' }).click();

  //project details
  await userPage.getByLabel('Enter description of permit request').fill('Beremod maximusaesto dunt labo.');
  await userPage.getByRole('button', { name: 'Next' }).click();

  //required documents
  await userPage.getByRole('button', { name: 'Next' }).click();

  //acknowledgement
  await userPage.getByLabel('Initials').fill('A+');
  await userPage.getByRole('button', { name: 'Next' }).click();

  //review
  await userPage.getByRole('button', { name: 'Submit' }).click();

  //Expect submission to be successful from portal
  await expect( userPage.getByText('Permit submission successful')).toBeTruthy();

  // next, go to crm and expect that page is there
    const adminContext = await browser.newContext({ storageState: '.auth/d365portal.json' });
    const adminPage = await adminContext.newPage();
    await adminPage.goto('https://org98a3e4f8.crm.dynamics.com/main.aspx?appid=c8a6efcd-59d5-ed11-a7c7-002248299159&pagetype=entitylist&etn=bp_defaultapplication');
  
  await adminPage.getByRole('gridcell', { name: dateTimeNow }).click({clickCount:2});

  await expect(adminPage.getByLabel('Last Name')).toHaveValue('Testing');

});


