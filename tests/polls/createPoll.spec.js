import { expect } from '@playwright/test';
import { test } from '../../fixtures';
const BasePage = require('../../page/BasePage');
const CreatePollPage = require('../../page/PollPage/CreatePollPage').default;

test.describe('Poll Module', () => {
  let basePage;
  let createPollPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    // Navigate to Polls → Create Poll
    await basePage.goToCreatePoll();
    
   createPollPage = new CreatePollPage(page);
    // Small wait to allow UI to settle (replace with explicit wait if possible)
    await page.waitForTimeout(2000);
  });

  test('✅ Verify user can create a poll successfully', async ({ page }) => {
    // Step 1: Fill poll details
    // Generate a random poll name
    const pollName = createPollPage.generateRandomPollName();
    await createPollPage.createPoll(
    pollName,
    'What is the capital of India?',
    'Hindi(हिन्दी)',
    'Delhi',
    'Kolkata'
  ); 
    await createPollPage.deletePoll(pollName);
    
    console.log(`✅ Verified that "${pollName}" deleted successfully`);

  });


  test('Verify user can search poll in browse poll page', async ({ page }) => {
  const pollName = createPollPage.generateRandomPollName();
    await createPollPage.createPoll(
    pollName,
    'What is the capital of India?',
    'Hindi(हिन्दी)',
    'Delhi',
    'Kolkata'
  );
  await createPollPage.verifyPollExists(pollName);
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
test('Should show validation error when poll options are empty', async ({ page }) => {
  const pollName = createPollPage.generateRandomPollName();
    await createPollPage.selectProductComponent();
    await createPollPage.enterPollDetails(pollName, 'What is the capital of india?');
    await createPollPage.selectLanguage('Hindi(हिन्दी)');
    await createPollPage.selectNumberOfOptions('2 options');
  await createPollPage.submitEmptyPollAndCheckValidation();
});


test('Should show error when no correct answer is selected', async ({ page }) => {
  const pollName = "Test Poll Without Correct Answer"; 
  await createPollPage.selectProductComponent();
    await createPollPage.enterPollDetails(pollName, 'What is the capital of india?');
    await createPollPage.selectLanguage('Hindi(हिन्दी)');
    await createPollPage.selectNumberOfOptions('2 options');

  // ❌ Don't select any correct answer
  await createPollPage.submitPollWithoutCorrectAnswer();
});


//Validate Duplicate Poll Name Handling
 test('Handle duplicate poll error', async ({ page }) => {
    await createPollPage.selectProductComponent();
    await createPollPage.enterPollDetails("poll", 'What is the capital of india?');
    await createPollPage.selectLanguage('Hindi(हिन्दी)');
    await createPollPage.selectNumberOfOptions('2 options');
    await createPollPage.enterOptions('Delhi', 'Kolkata');
    await createPollPage.submitPoll();

  await createPollPage.handleDuplicatePoll();
  });


  test('🔎 Verify poll name and question minimum length validation', async ({ page }) => {
  await createPollPage.selectProductComponent();
    await createPollPage.enterPollDetails("pol", 'que');
    await createPollPage.selectLanguage('Hindi(हिन्दी)');
    await createPollPage.selectNumberOfOptions('2 options');
    await createPollPage.enterOptions('Delhi', 'Kolkata');
    await createPollPage.submitPoll();

  // Verify validation messages
  await createPollPage.verifyMinLengthErrors();
});


test('🧾 Verify Poll Name and Question Character Limit Validation (max 255)', async ({ page }) => {
   // Generate a 256-character string
    const longString = 'A'.repeat(256);
 await createPollPage.selectProductComponent();
    await createPollPage.enterPollDetails(longString, longString);
    await createPollPage.selectLanguage('Hindi(हिन्दी)');
    await createPollPage.selectNumberOfOptions('2 options');
    await createPollPage.enterOptions('Delhi', 'Kolkata');
    await createPollPage.submitPoll();

  // Verify the validation messages
  await createPollPage.verifyCharacterLimitErrors();
});


test('🚫 Verify required fields', async ({ page }) => {
  // Submit empty form
    await createPollPage.submitPoll();
  // Verify required field validation
  await createPollPage.verifyRequiredFieldErrors();
});


});
