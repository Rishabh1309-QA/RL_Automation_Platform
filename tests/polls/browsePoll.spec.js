import { expect } from '@playwright/test';
import { test } from '../../fixtures';
const BasePage = require('../../page/BasePage');
const CreatePollPage = require('../../page/PollPage/CreatePollPage').default;
const BrowsePollsPage = require('../../page/PollPage/BrowsePollsPage').default;


test.describe('Poll Module', () => {
  let basePage;
  let createPollPage;
  let browsePollPage;
  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browsePollPage = new BrowsePollsPage(page);
    createPollPage = new CreatePollPage(page);
    await page.waitForTimeout(2000);
    await basePage.goToBrowsePolls();

  });

  test('✅ Verify user lands on Browse Poll page successfully', async ({ page }) => {
    // Navigate to Browse Poll page
    
     console.log('✅ User is successfully on the Browse Poll page');
    // Verify user is on Poll page
    await browsePollPage.verifyPollPageLoaded();
  });

 test('✅ Verify user can navigate between Browse and Create Poll pages', async ({ page }) => {
    // Step 1: Click '+' icon to go to Create Poll page
    await browsePollPage.clickCreatePollIcon();
    await createPollPage.verifyCreatePollPageLoaded();

    // Step 3: Click 'Back' to return to Browse Polls page
    await browsePollPage.clickBackButton();
    await browsePollPage.verifyBackToBrowsePolls();
  });

    test('✅ Verify user lands on Browse Poll page and sees all expected columns', async ({ page }) => {
    await browsePollPage.verifyPollPageLoaded();

    // Step 2: Verify all table columns are visible
    await browsePollPage.verifyBrowsePollColumns();
  });

 test('should navigate to next and previous pages', async ({ page }) => {
    expect(await browsePollPage.isNextButtonEnabled()).toBe(true);

    // Go to next page
    await browsePollPage.goToNextPage();
    // Optionally, verify page content changed
    // expect(await page.locator('selector-for-page-content').textContent()).toContain('Expected Text on Page 2');

    // Verify Previous button is enabled
    expect(await browsePollPage.isPrevButtonEnabled()).toBe(true);

    // Go to previous page
    await browsePollPage.goToPreviousPage();
 }); 
 

test('Verify clicking on arrow and poll details', async ({ page }) => {
  // Step: Click '+' icon to go to Create Poll page
    await browsePollPage.clickCreatePollIcon();

  const pollName = "pollName";
    await createPollPage.createPoll(
    pollName,
    'What is the capital of India?',
    'Hindi(हिन्दी)',
    'Delhi',
    'Kolkata'
  ); 
   
  // Step 4: Expand and verify the created poll
  // await page.waitForTimeout(5000);
  await browsePollPage.expandPollDetails();
  await browsePollPage.verifyPollDetailsVisible();
  await browsePollPage.printPollDetails();
   await createPollPage.deletePoll(pollName);
});

test('Open and close the filter panel', async ({ page }) => {
  await browsePollPage.openFilterPanel();
  await browsePollPage.closeFilterPanel();
});

test('User can reset the filters and see confirmation', async ({ page }) => {
  await browsePollPage.openFilterPanel();
  await browsePollPage.resetFilter(); // ✅ Reset and print toast message
});


 }); 