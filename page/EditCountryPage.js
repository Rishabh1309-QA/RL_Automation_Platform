const { expect } = require('@playwright/test');
const CountryForm = require('../CountryForm');

class EditCountryPage {
  constructor(page) {
    this.page = page;
    this.form = new CountryForm(page);

    this.editButton = page.getByRole('button', { name: 'Edit' });
  }

  async verifyPrepopulatedData(expectedName, expectedIso) {
    await expect(this.form.countryname).toHaveValue(expectedName);
    await expect(this.form.countryCode).toHaveValue(expectedIso);
  }

  async verifyFieldsReadOnly() {
    await expect(this.form.countryname).toBeDisabled();
    await expect(this.form.countryCode).toBeDisabled();
  }

  async enableEditing() {
    await this.editButton.click();
  }

  async verifyFieldsEditable() {
    await expect(this.form.countryname).toBeEditable();
    await expect(this.form.countryCode).toBeDisabled();
  }
}

module.exports = EditCountryPage;
