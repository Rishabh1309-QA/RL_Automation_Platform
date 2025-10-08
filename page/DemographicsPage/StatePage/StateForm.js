const { expect } = require('@playwright/test');

class StateForm {
  constructor(page) {
    this.page = page;

    // Custom dropdown for country
    this.countryDropdown = page.locator('div[placeholder="Search ..."]');
    this.statecode = page.getByPlaceholder('e.g. DL for Delhi');
    this.statename = page.getByPlaceholder('e.g. Delhi');

    // Buttons
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.saveButton = page.getByRole('button', { name: 'Update' });

    this.nameField = this.statename;
    this.codeField = this.statecode;
  }

  async selectCountry(countryName) {
    await this.countryDropdown.click();
    await this.page.getByText(countryName, { exact: false }).click();
  }

  async fillForm({ country, name, code }) {
    if (country) await this.selectCountry(country);
    if (code) await this.statecode.fill(code);
    if (name) await this.statename.fill(name);
  }

  async create() {
    await this.createButton.click();
  }

  async save() {
    await this.saveButton.click();
  }

  async reset() {
    await this.resetButton.click();
  }

  async back() {
    await this.backButton.click();
  }

  async expectEmpty() {
    await expect(this.nameField).toHaveValue('');
    await expect(this.codeField).toHaveValue('');
  }
}

module.exports = StateForm;
