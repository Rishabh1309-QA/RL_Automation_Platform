const { expect } = require('@playwright/test');

class CountryForm {
  constructor(page) {
    this.page = page;
    this.countryname = page.getByRole('textbox', { name: 'Country Name *' });
    this.countryCode = page.getByRole('textbox', { name: 'Country Code *' });
    this.saveButton = page.getByRole('button', { name: 'Update' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.createButton = page.getByRole('button', { name: 'Create' });

    // Aliases for clarity in tests
    this.nameField = this.countryname;
    this.isoField = this.countryCode;
  }

  async fillForm({ name, iso }) {
    if (name !== undefined) await this.countryname.fill(name);
    if (iso !== undefined) await this.countryCode.fill(iso);
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
    await expect(this.isoField).toHaveValue('');
  }
}

module.exports = CountryForm;
