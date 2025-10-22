import { expect } from '@playwright/test';
class BrowseActivityPage {
  constructor(page) {
    this.page = page;
    
    // Locators
    this.contentMenu = page.locator('summary').filter({ hasText: 'Content' }).first();
    this.activitiesMenu = page.locator('summary').filter({ hasText: 'Activities' });
    this.browseActivitiesLink = page.getByRole('link', { name: 'Browse Activities' });
    this.activitiesHeader = page.locator('#activities').getByText('Activities');
    this.nextButton = page.getByRole('button', { name: 'Next »' });
    this.previousButton = page.getByRole('button', { name: '« Previous' });
    this.plusIcon = page.locator('#activities').getByRole('link'); // + icon in activities
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.createActivityHeader = this.page.getByText('Create Activity', { exact: true });

    // Filter locators
    this.filterButton = page.locator('#activities').getByRole('button').nth(1); // filter icon
    this.filtersSidebarHeader = page.locator('div.text-2xl.font-bold', { hasText: 'Filters' });
    this.filtersSidebar = page.locator('aside[aria-label="Filters"], div[role="complementary"]');
// Close button: select the SVG inside the filters sidebar
this.filtersCloseButton = page.locator('aside[aria-label="Filters"] svg[data-slot="icon"]');


this.resetButton = this.page.getByRole('button', { name: 'Reset' });
this.searchButton = this.page.getByRole('button', { name: 'Search' });

this.resetButton = this.page.getByRole('button', { name: 'Reset' });
this.searchButton = this.page.getByRole('button', { name: 'Search' });


  }

  // Actions
  async openActivitiesMenu() {
    await this.contentMenu.click();
    await this.activitiesMenu.click();
  }

  async goToBrowseActivities() {
    await this.browseActivitiesLink.click();
  }

  async verifyActivitiesPage() {
    await this.activitiesHeader.click();  // Or you can use expect().toBeVisible()
  }

  async navigateNext() {
    await this.nextButton.click();
  }

  async navigatePrevious() {
    await this.previousButton.click();
  }

  async clickPlusIcon() {
    await this.plusIcon.click();
  }

  async verifyCreateActivityPage() {
  // wait up to 10 seconds for "Create Activity" div to appear
  await this.createActivityHeader.waitFor({ state: 'visible', timeout: 20000 });
  await expect(this.createActivityHeader).toBeVisible();
}
  async clickBackButton() {
    await this.backButton.click();
  }

  async verifyBrowseActivitiesPage() {
  const activitiesLink = this.page.getByRole('link', { name: 'Activities', exact: true });
  await activitiesLink.waitFor({ state: 'visible', timeout: 10000 });
  await expect(activitiesLink).toBeVisible();
}



async openFilters() {
  await this.filterButton.waitFor({ state: 'attached', timeout: 10000 });
  await this.filterButton.click({ force: true });

  // Wait for sidebar header
  await this.filtersSidebarHeader.waitFor({ state: 'visible', timeout: 10000 });
  await expect(this.filtersSidebarHeader).toBeVisible();
}

async closeFilters() {
  // Wait for close button and click
  await this.filtersCloseButton.waitFor({ state: 'visible', timeout: 10000 });
  await this.filtersCloseButton.click();

  // Ensure sidebar is gone
  await expect(this.filtersSidebarHeader).toBeHidden();
}


}

export default BrowseActivityPage;
