import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://v2.dev.lilyogis.in/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('rishav.r@rocketlearning.org');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Rishabh1309!@');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('summary').filter({ hasText: 'Demographics' }).click();
  await page.getByText('States', { exact: true }).click();
  await page.getByRole('link', { name: 'Browse States' }).click();
  await page.getByText('Districts', { exact: true }).click();
  await page.getByRole('link', { name: 'Browse Districts' }).click();
  await page.getByRole('row', { name: 'Test Punjabi Punjab (PB)' }).getByRole('link').click();
  await page.getByText('Edit', { exact: true }).click();
  await page.getByRole('button', { name: 'Back' }).click();
  await page.getByRole('row', { name: 'Test Punjabi Punjab (PB)' }).getByRole('link').click();
  await page.getByText('Edit', { exact: true }).click();
  await page.getByRole('textbox', { name: 'District Name *' }).click();
  await page.getByText('India (IND) Search').click();
  await page.getByRole('textbox', { name: 'Select Country *' }).press('Escape');
  await page.getByText('Punjab (PB) Search').click();
  await page.getByRole('textbox', { name: 'Select State *' }).press('Escape');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByText('Edit', { exact: true }).click();
  await page.getByRole('button', { name: 'Update' }).click();
});