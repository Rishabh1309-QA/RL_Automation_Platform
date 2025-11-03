import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://v2.dev.lilyogis.in/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('rishav.r@rocketlearning.org');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Rishabh1309!@');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('summary').filter({ hasText: 'Demographics' }).click();
  await page.locator('summary').filter({ hasText: 'Districts' }).click();
  await page.getByRole('link', { name: 'Browse Districts' }).click();
  await page.locator('#districts').getByRole('button').click();
  await page.getByRole('main').locator('form div').filter({ hasText: 'Select a country' }).nth(2).click();
  await page.getByRole('main').locator('form').getByText('India (IND)').click();
  await page.locator('#option-marya6935fac152a27c02f377113ce17f677-1').press('Escape');
  await page.getByRole('main').locator('form div').filter({ hasText: 'Select a state' }).nth(2).click();
  await page.getByText('Gujarat (GJ)').click();
  await page.locator('#option-maryd32732f2b5561b6dc16bc21d451cd18d-3').press('Escape');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('cell', { name: 'State' }).click();
  await page.locator('#districts').getByRole('button').click();
  await page.getByRole('button', { name: 'Reset' }).click();
});