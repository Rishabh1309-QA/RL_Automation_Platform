const { expect } = require('@playwright/test');

class BrowseCountryPage {
  constructor(page) {
    this.page = page;

    // Locators inside Browse Countries page
    this.pageHeader = page.locator('#countries').getByText('Countries');
    this.countryTable = page.locator('table');
    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.addButton = page.locator('#countries').getByRole('link'); // + button
  }

  async goToBrowseCountries(basePage) {
    await basePage.goToBrowseCountries();
    await expect(this.pageHeader).toBeVisible();
  }

  async clickCreateCountry(basePage) {
    await basePage.goToCreateCountry();
  }

  countryRow(name) {
    return this.page.locator('tr', { hasText: name });
  }

  async deleteCountry(countryName) {
    const row = this.page.locator(`tr:has-text("${countryName}")`);
    await row.getByRole('button', { name: 'Delete' }).click();

    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Delete' }).click();

    await expect(this.countryTable).not.toContainText(countryName);
  }

  async verifyCountryInTable(countryName) {
    await expect(this.countryTable).toContainText(countryName);
  }

  async searchCountry(countryName) {
    await this.searchBox.fill(countryName);
  }

  async clickAddCountry() {
    await this.addButton.click();
  }

  async getIsoCodes() {
    const rawValues = await this.page.locator('table tr td:nth-child(1)').allTextContents();
    return rawValues.map(val => val.trim());
  }

  async sortByIsoCode() {
    await this.page.getByRole('cell', { name: 'ISO code' }).click();
  }

  // 🔹 New reusable sorting helper (asc/desc)
  async verifyIsoSorting() {
  // Baseline table values (no assumption about current order)
  const baseline = await this.getIsoCodes();
  const ascSorted = [...baseline].sort((a, b) => a.localeCompare(b));
  const descSorted = [...ascSorted].reverse();

  // 🔹 First click
  await this.sortByIsoCode();
  const firstClick = await this.getIsoCodes();

  if (JSON.stringify(firstClick) === JSON.stringify(ascSorted)) {
    // ✅ First click gave Asc
    await expect(firstClick).toEqual(ascSorted);

    // Second click must give Desc
    await this.sortByIsoCode();
    const secondClick = await this.getIsoCodes();
    await expect(secondClick).toEqual(descSorted);

  } else {
    // ✅ First click gave Desc
    await expect(firstClick).toEqual(descSorted);

    // Second click must give Asc
    await this.sortByIsoCode();
    const secondClick = await this.getIsoCodes();
    await expect(secondClick).toEqual(ascSorted);
  }
}





  async clickEditCountry(countryName) {
    const row = this.page.locator(`tr:has-text("${countryName}")`);
    await row.getByRole('link', { name: 'Edit' }).click();
  }

  async cancelDeleteCountry(countryName) {
    const row = this.page.locator(`tr:has-text("${countryName}")`);
    await row.getByRole('button').click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }
}

module.exports = BrowseCountryPage;
