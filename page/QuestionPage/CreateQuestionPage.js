import { expect } from '@playwright/test';
import path from 'path';

class CreateQuestionPage {
  constructor(page) {
    this.page = page;

    this.contentMenu = page.locator('summary').filter({ hasText: 'Content' }).first();
    this.questionsSummary = page.locator('summary').filter({ hasText: 'Questions' });
    this.createQuestionLink = page.getByRole('link', { name: 'Create Question' });
    // Question Details tab locators
    this.questionTitle = 'Automation test Question';
    this.titleInput = page.getByRole('textbox', { name: 'Title *' });
    this.difficultySelect = page.locator('.select').first();
    this.componentSelect = page.locator('div:nth-child(3) > div > .select');
    this.activitySelect = page.locator('div:nth-child(4) > div > .select');
    this.uploadFileInput = page.getByRole('textbox', { name: 'Upload Multimedia file' });
    this.nextBtn = page.getByRole('button', { name: 'Next' });
    this.languageDropdown = page.locator('#lang-0');
    this.questionText = page.getByPlaceholder(' ', { exact: true });
    this.optionTab = page.getByRole('tab', { name: 'Options' });
    this.questionTab = page.getByRole('tab', { name: 'Questions' });
    this.finishBtn = page.getByRole('button', { name: 'Finish' });
// reqired field on first tab in question creation
    this.titleError = page.locator('.text-red-500.label-text-alt.p-1', {
  hasText: 'The title field is required.'
    });

//Add more languges
   this.addMoreLanguageBtn = page.getByRole('button').filter({ hasText: 'Add more language' });
   this.language2Label = page.getByText('Language #2');
  
  //Deletion of question
  // Row of the question
    this.row = page.locator(`tr:has(td:has-text("Automation test Question"))`);

    // Delete button inside that row
    this.deleteBtn = page.locator(
      `tr:has(td:has-text("Automation test Question")) [data-tip="Delete"]`
    ).first();

    // Confirmation modal delete button
    this.confirmDeleteBtn = page.getByRole('dialog').getByRole('button', { name: 'Delete' });

    // Success toast
    this.successSaveToast = page.getByText('Questions details saved');
    this.successDeleteToast = page.getByText('Question deleted successfully.');
  }


  async goToCreateQuestion() {
    await this.contentMenu.click();
    await this.questionsSummary.click();
    await this.createQuestionLink.click();
  }
  
  async fillQuestionDetails() {
    await this.titleInput.fill('Automation test Question');
    await this.difficultySelect.click();
    await this.page.getByText('Difficult', { exact: true }).click();
      await this.page.keyboard.press('Escape');
    await this.componentSelect.click();
    await this.page.getByText('Home Learning Activity').click();
    await this.page.keyboard.press('Escape');
    await this.activitySelect.click();
    await this.page.getByText('Activity 29/').click();
    await this.page.keyboard.press('Escape');
  }

   async uploadMedia(fileName) {
    // Move up two folders (from /page/QuestionPage) to project root, then into /tests/uploadFiles
    const filePath = path.join(__dirname, '../../tests/uploadFiles', fileName);
    await this.uploadFileInput.setInputFiles(filePath);
  }

  async enterQuestionAndOptions() {
    await this.nextBtn.click();
    await this.languageDropdown.click();
    await this.page.getByText('Hindi (हिन्दी)').click();
    await this.questionText.fill('What is the name of PM?');
    await this.optionTab.click();

    const optionBase = (index) => this.page.locator(`[id="questiondivid-0\\.${index}"]`).getByRole('textbox', { name: 'Enter option' });
    await optionBase(0).fill('1');
    await optionBase(1).fill('2');
    await optionBase(2).fill('3');

    await this.page.locator('[id="questiondivid-0\\.0"]').getByRole('checkbox', { name: 'Correct Answer' }).check();
  }

  async finishQuestionCreation() {
    await this.questionTab.click();
    await this.finishBtn.click();
  }
// reqired field on first tab in question creation
   async titleEmptyAndClickNext() {
     await this.titleInput.fill('');
    await this.difficultySelect.click();
    await this.page.getByText('Difficult', { exact: true }).click();
    await this.nextBtn.click();
  }
  async verifyTitleIsRequired() {
    await this.page.waitForTimeout(300);    
  await this.titleError.waitFor({ state: 'visible', timeout: 8000 });
  await expect(this.titleError).toBeVisible();
  }

  //Add more languges
    async clickAddMoreLanguage() {
    await this.addMoreLanguageBtn.click();
  }

  async verifyLanguage2Visible() {
    await expect(this.language2Label).toBeVisible();
  }
async clickNext() {
    await this.titleInput.fill('test');
    await this.difficultySelect.click();
    await this.page.getByText('Difficult', { exact: true }).click();
    await this.nextBtn.click();
  }

   async verifySaveSuccess() {
    await this.successSaveToast.waitFor({ state: 'visible' });
  }

  async openDeleteModal() {
    await this.deleteBtn.click();
  }

  async confirmDelete() {
    await this.confirmDeleteBtn.click();
  }

  async verifyDeleteSuccess() {
    await this.successDeleteToast.waitFor({ state: 'visible' });
  }

} 

module.exports = CreateQuestionPage;
