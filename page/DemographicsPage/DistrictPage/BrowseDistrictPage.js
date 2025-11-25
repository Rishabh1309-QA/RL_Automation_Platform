const { expect } = require('@playwright/test');

class BrowseDistrictPage {
  constructor(page) {
    this.page = page;
    this.pageHeader = page.locator('#districts').getByText('Districts');
    this.districtTable = page.locator('table');
    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.addButton = page.locator('#districts').getByRole('link'); // + button consistent with Country
    // Filter panel (right side in your screenshot)
    this.filterButton = page.locator('//*[@id="districts"]/div/div[3]/button'); 
    this.drawerCard = page.locator('div.drawer-end div.card[wire\\:key="drawer-card"]');
    this.drawerTitle = this.drawerCard.getByRole('heading', { name: 'Filters' });

    // Dropdowns inside filter panel
    this.countryDropdown = this.drawerCard.getByText('Select a country', { exact: true });
    this.stateDropdown = this.drawerCard.getByText('Select a state', { exact: true });

    // Buttons
    this.resetButton = this.drawerCard.getByRole('button', { name: 'Reset' });
    this.searchButton = this.drawerCard.getByRole('button', { name: 'Search' });
  }

  async goToBrowseDistricts(basePage) {
    await basePage.goToBrowseDistricts();
    await expect(this.pageHeader).toBeVisible();
  }

  districtRow(name) {
    return this.page.locator('tr', { hasText: name });
  }

  async clickAddDistrict() {
    await this.addButton.click();
  }

  async clickEditDistrict(districtName) {
    const row = this.page.locator(`tr:has-text("${districtName}")`);

    // Explicitly wait for the row with the NEW NAME to become visible on the page.
    // This handles the data reload after the update.
    await row.waitFor({ state: 'visible', timeout: 15000 }); // Increase timeout for stability

    await row.getByRole('link', { name: 'Edit' }).click();
  }

  async deleteDistrict(dName) {
    const row = this.page.locator(`tr:has-text("${dName}")`);
    await row.getByRole('button', { name: 'Delete' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Delete' }).click();
    //await expect(this.districtTable).not.toContainText(dName);
  }

  async cancelDeleteDistrict(dName) {
    const row = this.page.locator(`tr:has-text("${dName}")`);
    await row.getByRole('button', { name: 'Delete' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(this.districtTable).toContainText(dName);
  }

  async searchDistrict(name) {
    await this.searchBox.fill(name);
  }

  async getDistrictColumnValues() {
    const raw = await this.page.locator('table tr td:nth-child(1)').allTextContents();
    return raw.map(v => v.trim());
  }

  async sortByDistrictColumn() {
    await this.districtColumnHeader.click();
  }

  async verifyDistrictSorting() {
    const baseline = await this.getDistrictColumnValues();
    const asc = [...baseline].sort((a, b) => a.localeCompare(b));
    const desc = [...asc].reverse();

    await this.sortByDistrictColumn();
    const first = await this.getDistrictColumnValues();

    if (JSON.stringify(first) === JSON.stringify(asc)) {
      await expect(first).toEqual(asc);
      await this.sortByDistrictColumn();
      const second = await this.getDistrictColumnValues();
      await expect(second).toEqual(desc);
    } else {
      await expect(first).toEqual(desc);
      await this.sortByDistrictColumn();
      const second = await this.getDistrictColumnValues();
      await expect(second).toEqual(asc);
    }
  }

  // --- Filter interactions
  async verifyFilterResults({ country, state } = {}) {
    
    if (country) {
      await expect(this.districtTable).toContainText(country);
    }
    if (state) {
      await expect(this.districtTable).toContainText(state);
    }
  }
  async openFilters() {
    console.log('Opening filter drawer...');
    await this.filterButton.click();
    await expect(this.drawerCard).toBeVisible({ timeout: 10000 });
    console.log('Filter panel opened');
  }

  async selectCountry(countryName) {
    console.log('Selecting country:', countryName);
    await expect(this.drawerCard).toBeVisible();

    // Click inside the drawer card only
    await this.countryDropdown.scrollIntoViewIfNeeded();
    await this.countryDropdown.click({ force: true });

    // Click the country option within the card
    const option = this.page.getByText(`${countryName} (`, { exact: false });
    await expect(option.first()).toBeVisible({ timeout: 10000 });
    await option.first().click({ force: true });

    await this.page.keyboard.press('Escape');
  }

async selectState(stateName) {
  console.log('Selecting state:', stateName);
  await expect(this.drawerCard).toBeVisible();

  // Click inside the drawer card only
  await this.stateDropdown.scrollIntoViewIfNeeded();
  await this.stateDropdown.click({ force: true });

  // Click the state option within the card
  const option = this.page.getByText(`${stateName} (`, { exact: false });
  await expect(option.first()).toBeVisible({ timeout: 10000 });
  await option.first().click({ force: true });

  // Close dropdown
  await this.page.keyboard.press('Escape');
}




  async resetFilters() {
    console.log('Resetting filters...');
    await this.resetButton.scrollIntoViewIfNeeded();
    await this.resetButton.click({ force: true });
  }

  async search() {
    await this.searchButton.click({ force: true });
    console.log('Clicked Search');
  }
}

module.exports = BrowseDistrictPage;
