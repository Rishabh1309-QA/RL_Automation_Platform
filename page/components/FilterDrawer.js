const { expect } = require('@playwright/test');

class FilterDrawer {
  constructor(page) {
    this.page = page;

 // 🔹 All locators
    this.filterButton = page.locator('//*[@id="projects"]/div/div[3]/button'); 
    this.drawerCard = page.locator('div.drawer-end div.card[wire\\:key="drawer-card"]');
    this.resetButton = this.drawerCard.getByRole('button', { name: 'Reset' });
    this.searchButton = this.drawerCard.getByRole('button', { name: 'Search' });
    this.countryDropdown = this.drawerCard.getByText('Select Country', { exact: true });
    this.stateDropdown = this.drawerCard.getByText('Select State', { exact: true });
    this.districtDropdown = this.drawerCard.getByPlaceholder('Search by district name', { exact: true });
    this.projectDropdown = this.drawerCard.getByText('Select Project', { exact: true });
    this.beatDropdown = this.drawerCard.getByText('Select Beat', { exact: true });
    this.schoolTypeDropdown = this.drawerCard.getByText('Select School Type', { exact: true });
  }

  // ---------------------------
  async open() {
    console.log('Opening filter drawer...');
    await this.filterButton.click();
    await expect(this.drawerCard).toBeVisible({ timeout: 10000 });
    console.log('Filter drawer opened');
  }

  async reset() {
    console.log('Resetting filter...');
    await this.resetButton.scrollIntoViewIfNeeded();
    await this.resetButton.click({ force: true });
  }

  async search() {
    console.log('Executing search...');
    await this.searchButton.click({ force: true });
  }

  // ---------------------------
  // 🔸 Reusable Dropdown Logic
  // ---------------------------

  async selectOption(dropdown, value) {
  console.log(`Selecting option "${value}"`);
  await dropdown.scrollIntoViewIfNeeded();
  await dropdown.click({ force: true });

  // First try with code pattern e.g. "India (IND)"
  let option = this.page.getByText(`${value} (`, { exact: false });

  // Fallback if district or others have no code
  if ((await option.count()) === 0) {
    option = this.page.getByText(value, { exact: false });
  }

  await expect(option.first()).toBeVisible({ timeout: 10000 });
  await option.first().click({ force: true });
  await this.page.keyboard.press('Escape');
}


  async selectCountry(name) {
    await this.selectOption(this.countryDropdown, name);
  }

  async selectState(name) {
    await this.selectOption(this.stateDropdown, name);
  }

  async selectDistrict(name) {
    await this.selectOption(this.districtDropdown, name);
  }

  async selectProject(name) {
    await this.selectOption(this.projectDropdown, name);
  }

  async selectBeat(name) {
    await this.selectOption(this.beatDropdown, name);
  }

  async selectSchoolType(name) {
    await this.selectOption(this.schoolTypeDropdown, name);
  }
}

module.exports = FilterDrawer;
