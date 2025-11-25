const { expect } = require('@playwright/test');
const DistrictForm = require('./DistrictForm');

class EditDistrictPage {
  constructor(page) {
    this.page = page;
    this.form = new DistrictForm(page);
    this.editButton = page.getByText('Edit', { exact: true }); // from your recorder
  }

  // ✅ Pre-populated data check
  async verifyPrepopulatedData(expectedName, expectedCountry, expectedState) {
    await this.form.expectPrepopulatedValues({
      name: expectedName,
      country: expectedCountry,
      state: expectedState,
    });
  }

async verifyFieldsReadOnly() {
  // District Name might be a standard disabled textbox like Country fields
  await expect(this.form.districtName).toBeDisabled();
  
}
  // ✅ Enable edit mode
  async enableEditing() {
    await this.editButton.first().click({ force: true });
  }

  // ✅ Ensure fields are editable after enabling
  async verifyFieldsEditable() {
    await expect(this.form.districtName).toBeEditable();
    await expect(this.form.countryTextbox).toBeEditable();
    await expect(this.form.stateTextbox).toBeEditable();
  }

  // ✅ Edit flow helper
  async editDistrict({ name, country, state }) {
    await this.enableEditing();
    await this.form.fillForm({ name, country, state });
    await this.form.save();
  }

  // ✅ Cancel edit flow
  async cancelEdit() {
    await this.form.cancel();
  }
}

module.exports = EditDistrictPage;
