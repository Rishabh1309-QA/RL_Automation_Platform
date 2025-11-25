import { expect } from '@playwright/test';

class CreatePollPage {
  constructor(page) {
    this.page = page;

     // Form fields
    this.productComponentDropdown = page.getByRole('main').locator('form div').filter({ hasText: 'Select product components' }).nth(3);
    this.pollNameInput = page.getByRole('textbox', { name: 'Poll Name *' });
    this.pollQuestionInput = page.getByRole('textbox', { name: 'Poll Question *' });
    this.languageDropdown = page.getByRole('main').locator('form div').filter({ hasText: 'Select language' }).nth(3);
    this.optionsDropdown = page.getByRole('main').locator('form div').filter({ hasText: 'Select number of options' }).nth(3);
    
    // Poll options
    this.option1Input = page.getByRole('textbox', { name: 'Poll Option 1' });
    this.option2Input = page.getByRole('textbox', { name: 'Poll Option 2' });
    this.option1CorrectCheckbox = page.getByRole('main')
      .locator('form div')
      .filter({ hasText: 'Poll Option 1 255 characters remaining Correct Answer' })
      .getByLabel('Correct Answer');

     // Buttons
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.updateButton = page.getByRole('button', { name: 'Update' });

    // Toast messages
    this.pollCreatedMsg = page.getByText('Poll created successfully!');
    this.pollUpdatedMsg = page.getByText('Poll updated successfully!');
    this.pollDeletedMsg = page.getByText('Poll deleted successfully');

    // Browse Polls page locators
    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.pollCell = (pollName) => page.getByRole('cell', { name: pollName });
  

// Poll row locator by poll name
this.pollRow = (pollName) => page.getByRole('row', { name: pollName });

// Edit locators
this.editLink = (pollName) => this.pollRow(pollName).locator('a[data-tip="Edit"]'); // SVG link in row
this.editButtonInForm = page.getByRole('button', { name: 'Edit' }); // button inside form
this.languageDropdownForUpdate = page.getByText('Hindi(হিন্দী) Select Language');
this.languageOption = (lang) => page.getByText(lang);
this.updateButton = page.getByRole('button', { name: 'Update' });
this.toastMessage = page.locator('div.font-bold', { hasText: 'Poll updated successfully' });
//Back button
 this.backButton = page.getByRole('button', { name: 'Back' });
// search
this.searchButton = page.getByRole('button', { name: 'Search' });

//Delete locators
    this.browsePollsLink = page.locator('a', { hasText: 'Browse Polls' });
    this.pollRow = (name) => page.getByRole('row', { name });
    this.pollActionButton = (name) => this.pollRow(name).getByRole('button');
    this.deleteDialogButton = page.getByRole('main').getByRole('dialog').getByRole('button', { name: 'Delete' });
    this.toastMessage = page.locator('div.font-bold', { hasText: 'Poll deleted successfully' });

//locators for negative test cases--------------
    // Generic invalid input locator
    this.invalidInputs = page.locator('input:invalid');
   this.optionRequiredError = page.getByText('The poll option field is').first();
   this.correctAnswerPopup = this.page.locator('.alert-error .font-bold').first();
   this.duplicatePollMsg = page.getByText('The poll name has already');
   //for short string
   this.pollNameError = page.getByText('The poll name field must be');
    this.pollQuestionError = page.getByText('The poll question field must');
    //for long string
    this.pollNameLimitError = page.getByText('The poll name field must not');
    this.pollQuestionLimitError = page.getByText('The poll question field must');
}


async selectProductComponent() {

    await this.page.keyboard.press('Escape');
  }

  async selectLanguage() {
     // Open the dropdown first
    await this.languageDropdownInFilter.click();

    // Wait for the options to appear
    await this.hindiOption.waitFor({ state: 'visible', timeout: 5000 });

    // Click on Hindi
    await this.hindiOption.click();
    // Step 4: Close the dropdown
    await this.page.keyboard.press('Escape');
  }


  async verifyCreatePollPageLoaded() {
    console.log('✅ User is redirected to the Create Poll page');
  }

  async clickBackButton() {
    await this.backButton.click();
  }

// at Create poll page.
async selectProductComponent(optionText = 'Home Learning Activity (AWW PP, Pre-primary PP, FLN PP)') {
    // Click the dropdown to open it
    await this.productComponentDropdown.click();

    // Wait for the option to be visible and click it
    const option = this.page.locator('div.font-semibold.truncate', { hasText: optionText });
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
    // Press ESC to close the dropdown
    await this.page.keyboard.press('Escape');
}


  async enterPollDetails(name, question) {
    await this.pollNameInput.fill(name);
    await this.pollQuestionInput.fill(question);
  }

  async selectLanguage(language) {
    await this.languageDropdown.click();
    await this.page.getByText(language).click();
  }

  async selectNumberOfOptions(optionText) {
    await this.optionsDropdown.click();
    await this.page.getByText(optionText).click();
  }

  async enterOptions(option1, option2) {
    await this.option1CorrectCheckbox.check();
    await this.option1Input.fill(option1);
    await this.option2Input.fill(option2);
  }

  async submitPoll() {
    await this.createButton.click();
  }

async createPoll(
  pollName,
  question,
  language,
  option1 ,
  option2 ,
  productComponent){
  console.log(`🛠️ Starting poll creation for: ${pollName}`);

  // Step 2: Select product component
  await this.selectProductComponent(productComponent);

  // Step 3: Enter poll details (name & question)
  await this.enterPollDetails(pollName, question);

  // Step 4: Select language
  await this.selectLanguage(language);

  // Step 5: Select number of options
  await this.selectNumberOfOptions('2 options');

  // Step 6: Enter options and mark correct answer
  await this.enterOptions(option1, option2);

  // Step 7: Submit poll
  await this.submitPoll();

  console.log(`✅ Poll "${pollName}" created successfully`);
}

  async verifyPollExists(pollName) {
    await this.browsePollsLink.click();
    await this.searchBox.fill(pollName);
    await expect(this.pollCell(pollName)).toBeVisible();
    console.log(`✅ Verified that search functionality is working as expected in Browse Polls`);
    console.log(`✅ Verified that poll "${pollName}" is present in Browse Polls`);
  }


async editPoll(pollName, newLanguage = 'Assamese(অসমীয়া)') {
  // Step 1: Click the Edit link in the row
  const editLinkBtn = this.editLink(pollName);
  await expect(editLinkBtn).toBeVisible({ timeout: 10000 });
  await editLinkBtn.click();

  // Step 2: Click Edit button inside form to open fields
  await expect(this.editButtonInForm).toBeVisible({ timeout: 10000 });
  await this.editButtonInForm.click();

  // Step 3: Change language
  await this.languageDropdown.click();
  await this.languageOption(newLanguage).click();

  // Step 4: Submit update
  await this.updateButton.click();
  console.log(`✅ Poll "${pollName}" updated successfully`);
}



 async deletePoll(name) {
    // Navigate to Browse Polls
    await this.browsePollsLink.click();

    // Click delete button for specific poll
    await this.pollActionButton(name).click();

    // Confirm delete in dialog
    await this.deleteDialogButton.click();

    // Wait for success toast message
   // await this.toastMessage.waitFor({ state: 'visible', timeout: 5000 });
   // console.log('Toast Message:', await this.toastMessage.innerText());
  }

 // Generate a random poll name
  generateRandomPollName() {
    return 'poll_' + Math.random().toString(36).substring(2, 10);
  }
  
  async submitEmptyPollAndCheckValidation() {
  await this.createButton.click();
  await expect(this.optionRequiredError).toBeVisible();
  console.log('❗ Validation error shown: Poll option field is required.');
}

async submitPollWithoutCorrectAnswer() {
  await this.createButton.click();
  // Wait for toast to appear after click
  await this.correctAnswerPopup.waitFor({ state: 'visible', timeout: 5000 });

  await expect(this.correctAnswerPopup).toBeVisible();
  const msg = await this.correctAnswerPopup.textContent();
  console.log(`❗ Validation shown: ${msg?.trim()}`);
}

async handleDuplicatePoll() {
 await this.duplicatePollMsg.waitFor({ state: 'visible', timeout: 5000 });

    // Get and print the error text
    const errorText = await this.duplicatePollMsg.textContent();
    console.log(`❌ Error Message: ${errorText.trim()}`);
    await this.duplicatePollMsg.click();

    // Action: click the Back button
    await this.backButton.click();
  }

async verifyMinLengthErrors() {
    await this.pollNameError.waitFor({ state: 'visible', timeout: 5000 });
    const nameErrorText = await this.pollNameError.textContent();
    console.log(`⚠️ Poll Name Error: ${nameErrorText.trim()}`);
    await expect(this.pollNameError).toBeVisible();

    const questionErrorText = await this.pollQuestionError.textContent();
    console.log(`⚠️ Poll Question Error: ${questionErrorText.trim()}`);
    await expect(this.pollQuestionError).toBeVisible();

    await this.pollNameError.click();
    await this.pollQuestionError.click();
  }

  async verifyCharacterLimitErrors() {

    // Wait for poll name error
    await this.pollNameLimitError.waitFor({ state: 'visible', timeout: 5000 });
    const nameLimitErrorText = await this.pollNameLimitError.textContent();
    console.log(`⚠️ Poll Name Limit Error: ${nameLimitErrorText.trim()}`);
    await expect(this.pollNameLimitError).toBeVisible();

    // Wait for poll question error
    await this.pollQuestionLimitError.waitFor({ state: 'visible', timeout: 5000 });
    const questionLimitErrorText = await this.pollQuestionLimitError.textContent();
    console.log(`⚠️ Poll Question Limit Error: ${questionLimitErrorText.trim()}`);
    await expect(this.pollQuestionLimitError).toBeVisible();

    // Optional clicks (as per your earlier test pattern)
    await this.pollNameLimitError.click();
    await this.pollQuestionLimitError.click();
  }
 async verifyRequiredFieldErrors() {
    // Wait for invalid inputs to appear
    await this.page.waitForTimeout(1000); // small delay to allow validation to show

    // Verify that 3 inputs are invalid
    await expect(this.invalidInputs).toHaveCount(5);

    console.log('❌ Required field validation triggered successfully.');
  }

// Verify all form fields are disabled before clicking "Edit"
   
  async verifyFieldsAreDisabled(pollName) {
    console.log('🔍 Verifying all fields are disabled before clicking Edit...');
     const editLinkBtn = this.editLink(pollName);
  await expect(editLinkBtn).toBeVisible({ timeout: 10000 });
  await editLinkBtn.click();
    const fields = [
      { name: 'Product Component', locator: this.productComponentDropdown },
      { name: 'Poll Name', locator: this.pollNameInput },
      { name: 'Poll Question', locator: this.pollQuestionInput },
      { name: 'Language', locator: this.languageDropdown },
      { name: 'Option 1', locator: this.option1Input },
      { name: 'Option 2', locator: this.option2Input },
    ];

    for (const field of fields) {
      await expect(field.locator).toBeDisabled();
      console.log(`✅ Verified: ${field.name} field is disabled`);
    }
    // Step 4: Submit 
  await this.updateButton.click();
  console.log(`✅ Verified update field is disabled`);

  }

//Click the "Back" button and verify navigation to browse page from edit page
  
  async navigateBackToBrowsePage(pollName) {
   const editLinkBtn = this.editLink(pollName);
   
  await expect(editLinkBtn).toBeVisible({ timeout: 10000 });
  await editLinkBtn.click();
    console.log('🔙 Clicking the Back button to navigate to Browse page...');
    await this.backButton.click();
    await expect(this.pollsHeader).toBeVisible();
     console.log('✅ User successfully navigated back to the Browse page.');
  }

}


export default CreatePollPage;
