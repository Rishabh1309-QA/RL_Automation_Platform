// BrowseSchoolPage.js
const { expect } = require('@playwright/test');

class BrowseSchoolPage {
  constructor(page) {
    this.page = page;

    // ============================================================
    // STATIC LOCATORS (Always available)
    // ============================================================

    this.pageHeader = page.locator('#schools').getByText('Schools');
    this.searchInput = page.getByPlaceholder('Search by UDISE code ');
    this.searchIconButton = page
      .locator('#schools')
      .locator('button')
      .filter({ has: page.locator('svg') })
      .last();

    this.addButton = page.locator('#schools').getByRole('link');

    this.schoolTable = page.locator('#schools .card table');
    this.tableRows = this.schoolTable.locator('tbody tr');

    this.loader = page.locator('[wire\\:loading], [wire\\:loading\\.flex]');

    this.filterButton = page.locator('//*[@id="schools"]/div/div[2]/button');
  }

  // ============================================================
  // DYNAMIC LOCATORS (Locator helper functions)
  // ============================================================

  drawerCard = () =>
    this.page.locator('div.drawer-end div.card[wire\\:key="drawer-card"]');

  resetButton = () =>
    this.drawerCard().getByRole('button', { name: 'Reset' });

  filterSearchButton = () =>
    this.drawerCard().getByRole('button', { name: 'Confirm' });

  rowByUdise = (udise) =>
    this.page.locator('tr', { hasText: udise });

  editButtonInRow = (udise) =>
    this.rowByUdise(udise).getByRole('link', { name: 'Edit' });

  deleteButtonInRow = (udise) =>
    this.rowByUdise(udise).getByRole('button', { name: 'Delete' });

  dialog = () => this.page.getByRole('dialog');

  // Dropdown placeholders
  stateDropdown = () =>
    this.page.locator('div[placeholder="Search by state name"]');

  districtDropdown = () =>
    this.page.locator('div[placeholder="Search by district name"]');

  searchInputInsideDropdown = (dropdown) =>
    dropdown.locator('input[x-ref="searchInput"]');

  // Filter dropdowns based on label
  filterContainerByLabel = (label) =>
    this.page.locator(`label:has-text("${label}")`).locator('..');

  filterSelectByLabel = (label) =>
    this.filterContainerByLabel(label).locator('.select');

  filterSearchInputByLabel = (label) =>
    this.filterSelectByLabel(label).locator('input[x-ref="searchInput"]');

  optionByText = (text) =>
    this.page.getByText(text, { exact: false });

  noDataMessage = () =>
    this.page.getByText(/No Data|No records|not found/i).first();

  udiseCell = (udise) =>
    this.page.getByText(udise, { exact: true }).locator('..');

  rowFromUdiseCell = (udise) =>
    this.udiseCell(udise).locator('..');

  districtCellFromRow = (udise) =>
    this.rowFromUdiseCell(udise).locator('td:nth-child(4)');

  // ============================================================
  // UTILITIES
  // ============================================================

  async waitLoader() {
    await this.loader.waitFor({ state: 'hidden', timeout: 12000 }).catch(() => {});
  }

  async waitForDrawerFullyOpen() {
    await expect(this.drawerCard()).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(300);
  }

  // ============================================================
  // PAGE NAVIGATION
  // ============================================================

  async goToBrowseSchools(basePage) {
    await basePage.goToBrowseSchools();
    await expect(this.pageHeader).toBeVisible({ timeout: 15000 });
  }

  async clickAddSchool() {
    await this.addButton.click();
  }

  async clickEditSchool(udise) {
    await expect(this.rowByUdise(udise)).toBeVisible({ timeout: 10000 });
    const btn = this.editButtonInRow(udise);
    await expect(btn).toBeVisible({ timeout: 5000 });
    await btn.click();
  }

  async cancelDeleteSchool(udise) {
    await expect(this.rowByUdise(udise)).toBeVisible({ timeout: 10000 });
    await this.deleteButtonInRow(udise).click();

    await this.dialog().getByRole('button', { name: 'Cancel' }).click();
  }

  // ============================================================
  // SEARCH
  // ============================================================

  async searchSchool(udise) {
    console.log(`🔍 Searching for UDISE: ${udise}`);

    await this.searchInput.fill('');
    await this.searchInput.fill(udise);
    await this.page.keyboard.press('Enter');

    await this.waitLoader();
    await this.page.waitForTimeout(120);

    const count = await this.tableRows.count();

    if (await this.noDataMessage().isVisible().catch(() => false)) return 0;

    if (count === 1) {
      const text = await this.tableRows.first().textContent();
      if (/No Data|No records|not found/i.test(text)) return 0;
    }

    return count;
  }

  async validateUdiseInTable(udise) {
    await expect(this.udiseCell(udise)).toBeVisible({ timeout: 15000 });

    // Validate district cell and UDISE
    await expect(this.districtCellFromRow(udise)).toContainText('Adilabad');
    await expect(this.udiseCell(udise)).toContainText(udise);
  }

  // ============================================================
  // FILTER PANEL
  // ============================================================

  async openFilters() {
    await this.filterButton.click();
    await expect(this.drawerCard()).toBeVisible({ timeout: 8000 });
  }

  async applyFilters() {
    await this.filterSearchButton().click({ force: true });
    await this.waitLoader();
  }

  async selectFilterDropdown(label, value) {
    await this.waitForDrawerFullyOpen();

    const dropdown = this.filterSelectByLabel(label);
    const input = this.filterSearchInputByLabel(label);

    await expect(dropdown).not.toHaveAttribute("readonly", "true", { timeout: 15000 });

    await dropdown.click();
    await expect(input.first()).toBeVisible();

    await input.fill('');
    await input.type(value, { delay: 60 });

    await expect(this.optionByText(value).first()).toBeVisible({ timeout: 15000 });
    await this.optionByText(value).first().click();
  }

  async selectState(state) {
    const dropdown = this.stateDropdown();
    await expect(dropdown).not.toHaveAttribute("readonly", "true", { timeout: 15000 });

    await dropdown.click();
    await expect(this.optionByText(state).first()).toBeVisible({ timeout: 15000 });

    await this.optionByText(state).first().click();
  }

  async selectDistrict(district) {
    const dropdown = this.districtDropdown();
    const input = this.searchInputInsideDropdown(dropdown);

    await expect(dropdown).not.toHaveAttribute("readonly", "true", { timeout: 15000 });

    await dropdown.click();
    await expect(input.first()).toBeVisible();

    await input.fill('');
    await input.type(district, { delay: 60 });

    await expect(this.optionByText(district).first()).toBeVisible({ timeout: 15000 });
    await this.optionByText(district).first().click();

    await this.page.keyboard.press('Escape');
  }

  async selectSchoolType(type) {
    await this.selectFilterDropdown("School Type", type);
    await this.page.keyboard.press('Escape');
  }

  async selectBeatSector(beat) {
    await this.selectFilterDropdown("Beat/Sector", beat);
    await this.page.keyboard.press('Escape');
  }

  async selectProject(project) {
    await this.selectFilterDropdown("Project", project);
    await this.page.keyboard.press('Escape');
  }

  async resetFilters() {
    await this.resetButton().click({ force: true });
    await this.waitLoader();
  }

  // ============================================================
  // VALIDATION
  // ============================================================

  async verifyFilterResults({ district }) {
    if (district) {
      await expect(this.schoolTable).toContainText(district);
    }
  }
}

module.exports = BrowseSchoolPage;
