// questionsPage.js
import { expect } from '@playwright/test';

export class BrowseQuestionPage {
  constructor(page) {
    this.page = page;

    // 🔹 Locators at the top
    this.contentMenu = page.locator('summary').filter({ hasText: 'Content' }).first();
    this.questionsSummary = page.locator('summary').filter({ hasText: 'Questions' });
    this.browseQuestionsLink = page.getByRole('link', { name: 'Browse Questions' });
    this.questionsSection = page.locator('#questions').getByText('Questions');
    this.nextButton = page.getByRole('button', { name: 'Next »' });
    this.prevButton = page.getByRole('button', { name: '« Previous' });
   // this.questionsButton = page.locator('#questions').getByRole('button');
    this.questionFiltersText = page.getByText('Question Filters');
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.filterClearedMsg = page.getByText('Filter cleared successfully.');
    this.titleCell = page.getByRole('cell', { name: 'Title', exact: true });
    this.difficultyCell = page.getByRole('cell', { name: 'Difficulty Level' });
    this.languageCell = page.getByRole('cell', { name: 'Language' });
    this.activityCell = page.getByRole('cell', { name: 'Activity' });
    this.questionsLink = page.getByRole('link', { name: 'Questions', exact: true });

    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.sortIcon = page.locator('#questions svg').nth(1);
   this.plusIcon = page.locator('xpath=//*[@id="questions"]/div/div[3]/a');

    this.backButton = page.getByRole('button', { name: 'Back' });


    // Filter locators
    
    this.filterButton = page.locator('#questions').getByRole('button');
    this.difficultyDropdown = page.locator('.select').first();
    this.difficultyOption = page.locator('#option-marybde7059c76896458103065ee0f49e876-D')
                                .getByText('Difficult');

    this.languageDropdown = page.locator('div:nth-child(2) > div > .select');
    this.languageOption = page.getByRole('main').locator('form').getByText('Hindi (हिन्दी)');

    this.confirmBtn = page.getByRole('button', { name: 'Confirm' });
this.firstRowSvg = page.locator('table tbody tr:first-child td:first-child svg');

     this.questionCell = (name) =>
            page.getByRole('cell', { name });

        this.rowByName = (name) =>
            page.getByRole('row', { name });

        this.expandIcon = (name) =>
            this.rowByName(name).locator('svg').first();
      }

  // 🔹 Actions (methods)
  async navigateToBrowseQuestions() {
    await this.contentMenu.click();
    await this.questionsSummary.click();
    await this.browseQuestionsLink.click();
  }

  async interactWithQuestions() {
    await this.questionsSection.click();
    await this.nextButton.click();
    await this.prevButton.click();
  }

   async clickNextPagination() {
    console.log("➡ Clicking Next » button");
    await this.nextButton.click();
  }

  async clickPreviousPagination() {
    console.log("➡ Clicking « Previous button");
    await this.prevButton.click();
  }

 async searchByLang(keyword) {
    console.log(`➡ Searching for: ${keyword}`);
    await this.searchBox.click();
    await this.searchBox.fill(keyword);
  }

   async createQuestion() {
   // console.log(" Navigate to Create Question Page");
    await this.plusIcon.click();
  }



  async navigateBack() {
    console.log("Navigate Back to Browse Questions Page");
    await this.backButton.click();
  }

  async applyAndResetFilters() {
    await this.filterButton.click();
    await this.questionFiltersText.click();
    await this.resetButton.click();
    await expect(this.filterClearedMsg).toBeVisible();
  }
  

  async clickTableHeaders() {
    await this.titleCell.click();
    await this.difficultyCell.click();
    await this.languageCell.click();
    await this.activityCell.click();
  }

  async goBackToQuestions() {
    await this.questionsLink.click();
  }

  // Actions
  async openFilter() {
    await this.filterButton.click();
  }

  async selectDifficulty() {
    await this.difficultyDropdown.click();
    await this.difficultyOption.click();
  }

  async selectLanguage() {
    await this.languageDropdown.click();
    await this.languageOption.click();
  }

  async applyFilter() {
    await this.confirmBtn.click();
  }
 async clickQuestionCell(name) {
        await this.questionCell(name).click();
    }

    async searchByQuestionTitle(name) {
        await this.searchBox.click();
        await this.searchBox.fill(name);
    }

    async expandRow() {
        await this.firstRowSvg.click();
    }

}
export default BrowseQuestionPage;