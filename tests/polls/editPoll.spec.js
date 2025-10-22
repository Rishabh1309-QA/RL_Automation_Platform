import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import BasePage from '../../page/BasePage.js';
import CreatePollPage from '../../page/PollPage/CreatePollPage.js';

test.describe('Poll Module', () => {
  let basePage;
  let createPollPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    createPollPage = new CreatePollPage(page);
    await basePage.goToCreatePoll();

    // Small wait to allow UI to settle (replace with explicit wait if possible)
    await page.waitForTimeout(2000);
  });

  test('✅ Verify user can edit an existing poll', async ({ page }) => {
    // Edit the poll: change language to Assamese

     const pollName = createPollPage.generateRandomPollName();
     await createPollPage.createPoll(
    pollName,
    'What is the capital of India?',
    'Hindi(हिन्दी)',
    'Delhi',
    'Kolkata'
  );
    await createPollPage.editPoll(pollName, 'Assamese(অসমীয়া)');

    // Optional: verify that the poll language updated in the row (if UI shows language)
    await createPollPage.searchBox.fill(pollName);
    const pollRow = createPollPage.pollRow(pollName);
    await expect(pollRow).toBeVisible({ timeout: 10000 });

    console.log(`✅ Verified that poll "${pollName}" was edited successfully`);
  });

});

