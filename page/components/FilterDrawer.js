const { expect } = require('@playwright/test');

class FilterDrawer {
  constructor(page) {
    this.page = page;

    // 🔹 Drawer container
    this.drawerCard = page.locator('div.drawer-end div.card[wire\\:key="drawer-card"]');

    // 🔹 All dropdowns scoped inside the drawer
    this.countryDropdown = this.drawerCard.getByText('Select Country', { exact: true });
    this.stateDropdown = this.drawerCard.getByText('Search by state name', { exact: true });
    this.districtDropdown = this.drawerCard.getByText('Search by district name', { exact: true });
    this.schoolTypeDropdown = this.drawerCard.getByText('Search ...', { exact: true });
    this.beatDropdown = this.drawerCard.getByText('Search ...', { exact: true });
    this.projectDropdown = this.drawerCard.getByText('Search by project name', { exact: true });
     this.filterButtonSchool = page.locator('//*[@id="schools"]/div/div[2]/button');
     this.filterButtonBeats = page.locator('//*[@id="beatssectors"]/div/div[3]/button');
    // 🔹 Buttons
    this.filterButton = page.locator('#schools button:has-text("Filter"), #projects button:has-text("Filter")');
    this.resetButton = this.drawerCard.getByRole('button', { name: 'Reset' });
    this.searchButton = this.drawerCard.getByRole('button', { name: 'Search' });
  }

  // --------------------------
  // Drawer actions
  // --------------------------
  async open() {
    console.log('Opening filter drawer...');
    await this.filterButton.click();
    await expect(this.drawerCard).toBeVisible({ timeout: 10000 });
    console.log('✅ Filter drawer opened');
  }

  async openbeatfilter() {
    console.log('Opening filter drawer...');
    await this.filterButtonBeats.click();
    await expect(this.drawerCard).toBeVisible({ timeout: 10000 });
    console.log('✅ Filter drawer opened');
  }

      async openschoolfilter() {
    console.log('Opening filter drawer...');
    await this.filterButtonSchool.click();
    await expect(this.drawerCard).toBeVisible({ timeout: 10000 });
    console.log('✅ Filter drawer opened');
  }

  async reset() {
    console.log('Resetting filters...');
    await this.resetButton.click({ force: true });
  }

  async search() {
    console.log('Executing search...');
    await this.searchButton.click({ force: true });
  }

  // --------------------------
  // 🔸 Core dropdown selection
  // --------------------------
// FilterDrawer.js
async selectOption(label, value) {
  console.log(`🔍 Selecting "${value}" from dropdown "${label}"`);

  // Step 1️⃣ - Click on the dropdown field
  const dropdownTrigger = this.drawerCard.getByRole('textbox', { name: label }).first();
  await dropdownTrigger.scrollIntoViewIfNeeded();
  await dropdownTrigger.click({ force: true });
  console.log(`✅ Clicked on dropdown "${label}"`);

  // Step 2️⃣ - Wait for the search input to become editable
  const searchBox = this.drawerCard.locator('input[x-ref="searchInput"]').first();
  await this.page.waitForTimeout(500); // short delay for UI to activate

  await this.page.waitForFunction(
    el => el && !el.hasAttribute('readonly'),
    searchBox,
    { timeout: 5000 }
  ).catch(() => console.log(`⚠️ Search box did not become editable for "${label}"`));

  // Step 3️⃣ - Type into the search box
  if (await searchBox.isEditable().catch(() => false)) {
    console.log(`⌨️ Typing "${value}" into search box...`);
    await searchBox.fill('');
    await searchBox.type(value, { delay: 100 });
    await this.page.waitForTimeout(1000); // give time for search results to populate
  } else {
    console.log(`⚠️ Search box not editable for "${label}". Using fallback.`);
  }

  // Step 4️⃣ - Click the matching search result (searched data)
  const searchResult = this.drawerCard
    .locator('div.font-semibold,truncatediv')
    .getByText(value, { exact: false })
    .first();

  try {
    await searchResult.scrollIntoViewIfNeeded();
    await searchResult.click({ force: true });
    console.log(`✅ Selected "${value}" from search results`);
  } catch {
    console.log(`⚠️ Could not find "${value}" in search results. Trying fallback.`);
    const fallback = this.drawerCard.getByText(value.split(' ')[0], { exact: false }).first();
    await fallback.click({ force: true });
    console.log(`✅ Selected "${value}" using fallback`);
  }

  // Step 5️⃣ - Close dropdown
  await this.page.keyboard.press('Escape');
  await this.page.waitForTimeout(500);
}


  // --------------------------
  // 🔹 Specific dropdowns
  // --------------------------
  async selectCountry(name) {
    await this.selectOption(this.countryDropdown, name);
    await this.page.waitForTimeout(1500); // allow dependent states to load
  }

  async selectState(name) {
    await this.selectOption(this.stateDropdown, name);
    await this.page.waitForTimeout(1500); // allow districts to load
  }

  async selectDistrict(name) {
    await this.selectOption(this.districtDropdown, name);
  }

  async selectSchoolType(name) {
    await this.selectOption(this.schoolTypeDropdown, name);
  }

  async selectBeat(name) {
    await this.selectOption(this.beatDropdown, name);
  }

  async selectProject(name) {
    await this.selectOption(this.projectDropdown, name);
  }
}

module.exports = FilterDrawer;
