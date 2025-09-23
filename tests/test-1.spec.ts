import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
 
  await page.getByText('Demographics').click();   //Demographics
  await page.locator('summary').filter({ hasText: 'Countries' }).click(); //Countries
  await page.getByRole('link', { name: 'Browse Countries' }).click();   //Browse Countries
  await page.locator('#countries').getByText('Countries').click();    //Countries Header
  await page.getByRole('textbox', { name: 'Search...' }).click();    //Search Box
  await page.locator('#countries').getByRole('link').click();         // + Button
  await page.locator('#create-country').getByText('Create Country').click();   //Create Country
  await page.getByRole('textbox', { name: 'Country Code *' }).click();    //Country Code
  await page.getByRole('textbox', { name: 'Country Name *' }).click();    //Country Name
  await page.getByRole('button', { name: 'Reset' }).click();          //Reset Button  
  await page.getByRole('button', { name: 'Create' }).click();       //Create Button
  await page.getByRole('button', { name: 'Back' }).click();      //Back Button
  await page.getByRole('cell', { name: 'ISO code' }).click();    //ISO Code Column
  await page.getByRole('row', { name: 'IND India Nov 23, 2024 Edit' }).getByRole('link').click();  //Select any Country 
  await page.getByRole('button', { name: 'Edit' }).click();    //Edit Button
  await page.getByText('Edit Country Details').click();        //Edit Country Details
  await page.getByRole('button', { name: 'Back' }).click();    //Back Button
  await page.getByRole('row', { name: 'PER Peru Aug 6, 2025 Edit' }).getByRole('button').click();   //Select any Country
  await page.getByRole('button', { name: 'Cancel' }).click();        //Cancel Button
  await page.getByRole('row', { name: 'PER Peru Aug 6, 2025 Edit' }).getByRole('button').click();   //Select any Country
  await page.getByRole('button', { name: 'Cancel' }).click();      //Cancel Button
  await page.getByRole('link', { name: 'Create Country' }).click();  //Create Country
});