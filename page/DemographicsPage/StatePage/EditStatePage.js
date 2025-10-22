const StateForm = require('./StateForm');
const { expect } = require('@playwright/test');

class EditStatePage {
  constructor(page) {
    this.page = page;
    this.form = new StateForm(page);

    this.editButton = page.getByRole('button', { name: 'Edit' });
  }

  // 🔹 Verify pre-populated values (state name + code)
  async verifyPrepopulatedData(expectedName, expectedCode) {
    await expect(this.form.statename).toHaveValue(expectedName);
    await expect(this.form.statecode).toHaveValue(expectedCode);
  }

  // 🔹 Fields should be read-only before clicking Edit
  async verifyFieldsReadOnly() {
    await expect(this.form.statename).toBeDisabled();
    await expect(this.form.statecode).toBeDisabled();
  }

  // 🔹 Enable editing
  async enableEditing() {
    await this.editButton.click();
  }

  // 🔹 After Edit, name should be editable, but code may stay disabled (depends on your app)
  async verifyFieldsEditable() {
    await expect(this.form.statename).toBeEditable();
    await expect(this.form.statecode).toBeDisabled(); // adjust if state code is editable in your app
  }
}

module.exports = EditStatePage;
