// page/PollPage/BrowsePollsPage.js

import { expect } from '@playwright/test';

class BrowsePollsPage {
  constructor(page) {
    this.page = page;
   

    // Header
    this.pollsHeader = page.locator('#polls').getByText('Polls');
     this.browsePollsLink = page.locator('a', { hasText: 'Browse Polls' });
    // Navigation
    this.createPollIcon = page.locator('#polls').getByRole('link');
    this.backButton = page.getByRole('button', { name: 'Back' });

    // Table columns
    this.columnPollName = page.getByRole('cell', { name: 'Poll Name' });
    this.columnCreatedBy = page.getByRole('cell', { name: 'Created By' });
    this.columnLanguage = page.getByRole('cell', { name: 'Language' });
    this.columnCreatedOn = page.getByRole('cell', { name: 'Created On' });

    // Search
    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.pollCell = (name) => page.getByRole('cell', { name });

    // Pagination
    this.nextButton = page.getByRole('button', { name: 'Next »' });
    this.prevButton = page.getByRole('button', { name: '« Previous' });

    // Filters
    this.filtersButton = page.locator('.actions button').nth(0);
    this.closeButton = page.locator('button.btn-ghost').nth(0);
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.successToast = page.getByText('Filters cleared successfully.');
    this.drawerCard = page.locator('div.drawer-end div.card[wire\\:key="drawer-card"]');
    this.drawerTitle = this.drawerCard.getByRole('heading', { name: 'Filters' });
    this.languageDropdownInFilter = page.locator('div.select[placeholder="Select a language"]');
    this.hindiOption = page.locator('div.font-semibold', { hasText: 'Hindi' });
    this.searchButton = page.getByRole('button', { name: 'Search' });

    this.pollName = "pollName";

    // Row based on dynamic poll name
    this.pollRow = page.getByRole('row', { name: new RegExp(this.pollName, 'i') });
    this.arrowIcon = this.pollRow.locator('svg').first();

    // Detail elements
    this.productComponents = page.getByRole('cell', { name: /Product Components/i });
     // Each detail section inside the box
    this.activity = page.locator('.min-w-64 > div:nth-child(2)').first();
    this.question = page.locator('.min-w-64 > div:nth-child(3)').first();
    this.options = page.locator('.min-w-64 > div:nth-child(4)').first();
    this.responseType = page.locator('.min-w-64 > div:nth-child(5)').first();


    //Filters   
   this.filtersButton = page.locator('.actions button').nth(0);
   this.closeButton = page.locator('button.btn-ghost'); // X (close) button

    }

  // Actions
  async verifyPollPageLoaded() {
    await expect(this.pollsHeader).toBeVisible();
    await expect(this.pollsHeader).toHaveText('Polls');
  }

  async clickCreatePollIcon() {
    await this.createPollIcon.click();
  }

  async clickBackButton() {
    await this.backButton.click();
  }

  async verifyBackToBrowsePolls() {
    await this.verifyPollPageLoaded();
    console.log('✅ User is redirected back to the Browse Poll page');
  }

  async verifyBrowsePollColumns() {
    await expect(this.columnPollName).toBeVisible();
    await expect(this.columnCreatedBy).toBeVisible();
    await expect(this.columnLanguage).toBeVisible();
    await expect(this.columnCreatedOn).toBeVisible();
    console.log('✅ Verified all expected columns are present on Browse Polls page');
  }

  async goToNextPage() {
    await this.nextButton.click();
  }

  async goToPreviousPage() {
    await this.prevButton.click();
  }

  async isNextButtonEnabled() {
    return await this.nextButton.isEnabled();
  }

  async isPrevButtonEnabled() {
    return await this.prevButton.isEnabled();
  }

  async openFilterPanel() {
    await this.filtersButton.click();
    console.log('✅ Filter panel opened successfully');
  }

  async closeFilterPanel() {
    await this.closeButton.click();
    console.log('✅ Filter panel closed successfully');
  }

  async resetFilter() {
    await this.resetButton.click();
    await expect(this.successToast).toBeVisible();
    const toastText = await this.successToast.textContent();
    console.log(`✅ Reset successful: ${toastText?.trim()}`);
  }

  async applyLanguageFilter(language = 'Hindi') {
    await this.languageDropdownInFilter.click();
    await this.hindiOption.waitFor({ state: 'visible' });
    await this.hindiOption.click();
    await this.page.keyboard.press('Escape');
    await this.searchButton.click();
  }

  async searchPoll(name) {
    await this.searchBox.fill(name);
    await expect(this.pollCell(name)).toBeVisible();
    console.log(`✅ Poll "${name}" found in search results`);
  }

  async expandPollDetails() {
    await this.browsePollsLink.click();
    await this.arrowIcon.click();
  }

  async verifyPollDetailsVisible() {
    await expect(this.productComponents).toBeVisible(); 
    await expect(this.activity).toBeVisible();
    await expect(this.question).toBeVisible();
    await expect(this.options).toBeVisible();
    await expect(this.responseType).toBeVisible();
  }

  async printPollDetails() {
    const productText = await this.productComponents.textContent();
    const activityText = await this.activity.textContent();
    const questionText = await this.question.textContent();
    const optionsText = await this.options.textContent();
    const responseTypeText = await this.responseType.textContent();

    console.log('📝 Poll Details:');
    console.log(`➡️  Product Components: ${productText?.trim()}`);
    console.log(`➡️  Activity: ${activityText?.trim()}`);
    console.log(`➡️  Question: ${questionText?.trim()}`);
    console.log(`➡️  Options: ${optionsText?.trim()}`);
    console.log(`➡️  Response Type: ${responseTypeText?.trim()}`);
  }

}

export default BrowsePollsPage;
