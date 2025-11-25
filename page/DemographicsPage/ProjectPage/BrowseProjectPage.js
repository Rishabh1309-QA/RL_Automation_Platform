const { expect } = require('@playwright/test');

class BrowseProjectPage {
  constructor(page) {
    this.page = page;

    // 🔸 Browse Project Page Locators
    this.pageHeader = page.locator('#projects').getByText('Projects');
    this.projectTable = page.locator('table');
    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.addButton = page.locator('#projects').getByRole('link'); 

    // 🔸 Sorting
    this.projectColumnHeader = page.getByRole('cell', { name: 'Project', exact: true });

    // 🔸 Filter Drawer Trigger Button
    this.filterButton = page.locator('//*[@id="projects"]/div/div[3]/button');

    /** 🔽 Filter Drawer Elements (Update locators later) */
    this.drawerCard = page.locator('div.drawer-end div.card[wire\\:key="drawer-card"]');
    this.drawerTitle = this.drawerCard.getByRole('heading', { name: 'Filters' });

    this.countryDropdown = this.drawerCard.getByText('Select a country', { exact: true });
    this.stateDropdown = this.drawerCard.getByPlaceholder('Search by state name', { exact: true });
    this.districtDropdown = this.drawerCard.getByPlaceholder('Search by district name', { exact: true });

    this.resetButton = this.drawerCard.getByRole('button', { name: 'Reset' });
    this.searchButton = this.drawerCard.getByRole('button', { name: 'Search' });

    // Livewire loader 
    this.loader = page.locator('[wire\\:loading], [wire\\:loading\\.flex]');
  }

  async goToBrowseProjects(basePage) {
    await basePage.goToBrowseProjects();
    await expect(this.pageHeader).toBeVisible();
  }

  projectRow(name) {
    return this.page.locator('tr', { hasText: name });
  }

  async clickAddProject() {
    await this.addButton.click();
  }

  async clickEditProject(projectName) {
    const row = this.projectRow(projectName);
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await row.getByRole('link', { name: 'Edit' }).click();
  }

  async deleteProject(projectName) {
    const row = this.projectRow(projectName);
    await row.getByRole('button', { name: 'Delete' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Delete' }).click();
  }

  async cancelDeleteProject(projectName) {
    const row = this.projectRow(projectName);
    await row.getByRole('button', { name: 'Delete' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(this.projectTable).toContainText(projectName);
  }

  async searchProject(name) {
    await this.searchBox.fill(name);
  }

  async getProjectColumnValues() {
    const raw = await this.page.locator('table tr td:nth-child(2)').allTextContents();
    return raw.map(v => v.trim());
  }

  async sortByProjectColumn() {
    await this.projectColumnHeader.click();
  }

  async verifyProjectSorting() {
    const before = await this.getProjectColumnValues();
    await this.projectColumnHeader.click();
    const after = await this.getProjectColumnValues();

    const isSorted = after.every((val, i, arr) => i === 0 || arr[i - 1].localeCompare(val, 'hi', { sensitivity: 'base' }) <= 0);
    expect(isSorted).toBeTruthy();

    if (JSON.stringify(before) !== JSON.stringify(after)) {
      expect(after).not.toEqual(before);
    }
  }

  // ==========================
  // ✅ FILTER PANEL FUNCTIONS
  // ==========================

  async openFilters() {
    console.log("Opening filter panel...");
    await this.filterButton.click();
    await expect(this.drawerCard).toBeVisible({ timeout: 8000 });
    console.log("Filter panel opened");
  }

  async waitLoader() {
    await this.loader.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
  }

  async selectCountry(country) {
    console.log(`Selecting country: ${country}`);
    await expect(this.drawerCard).toBeVisible();

    await this.countryDropdown.scrollIntoViewIfNeeded();
    await this.countryDropdown.click({ force: true });

    const option = this.page.getByText(`${countryName} (`, { exact: false });
    await expect(option.first()).toBeVisible({ timeout: 8000 });

    await option.first().click({ force: true });
    await this.page.keyboard.press('Escape');

    await this.waitLoader();
  }

async selectState(stateName) {
  console.log(`Selecting state: ${stateName}`);
  await expect(this.drawerCard).toBeVisible();

  // Click dropdown (the div)
  await this.stateDropdown.scrollIntoViewIfNeeded();
  await this.stateDropdown.click();

  // Type in actual search input
  const stateInput = this.stateDropdown.locator('input');
  await stateInput.fill(stateName);

  // Pick the option
  const option = this.page.getByText(`${stateName} (`, { exact: false });
  await expect(option.first()).toBeVisible({ timeout: 10000 });
  await option.first().click();

  await this.page.keyboard.press('Escape');
  if (this.waitForLoader) await this.waitForLoader();
}


async selectDistrict(districtName) {
  console.log(`Selecting district: ${districtName}`);
  await expect(this.drawerCard).toBeVisible();

  // open dropdown
  await this.districtDropdown.scrollIntoViewIfNeeded();
  await this.districtDropdown.click({ force: true });

  // wait for options to appear
  await this.waitForLoaderToDisappear?.();
  await this.page.waitForTimeout(500);

  const option = this.page.getByText(`${districtName}`, { exact: false });
  await expect(option.first()).toBeVisible({ timeout: 30000 });
  await option.first().click({ force: true });

  await this.page.keyboard.press('Escape');
  console.log(`Selected district: ${districtName}`);
}


  async resetFilters() {
    console.log("Resetting filters...");
    await this.resetButton.click({ force: true });
    await this.waitLoader();
  }

  async search() {
    await this.searchButton.click({ force: true });
    await this.waitLoader();
  }

  async verifyFilterResults({ country, state }) {
    if (country) await expect(this.projectTable).toContainText(country);
    if (state) await expect(this.projectTable).toContainText(state);
  }
}

module.exports = BrowseProjectPage;
