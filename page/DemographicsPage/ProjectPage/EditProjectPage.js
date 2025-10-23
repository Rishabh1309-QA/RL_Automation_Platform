const { expect } = require('@playwright/test');

class EditProjectPage {
  constructor(page) {
    this.page = page;

    // 🔹 Header
    this.pageHeader = page.getByText('Project Details');

    // 🔹 Fields
    this.projectNameField = page.getByRole('textbox', { name: 'Project Name *' });
    this.projectCodeField = page.getByRole('textbox', { name: 'Project Code *' });
    this.districtDropdown = page.getByText(/Select.*District/i);

    // 🔹 Buttons
    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.updateButton = page.getByRole('button', { name: 'Update' });
    this.backButton = page.getByRole('button', { name: 'Back' });

    // 🔹 Toast / Validation
    this.toastMessage = page.locator('.toast-message');
  }

  // ===============================
  // 🧭 Page & Navigation
  // ===============================
  async verifyPageLoaded() {
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }

  async goBack() {
    await this.backButton.click();
  }

  // ===============================
  // ✏️ Field Methods
  // ===============================
  async fillProjectName(name) {
    await this.projectNameField.fill(name);
  }

  async fillProjectCode(code) {
    await this.projectCodeField.fill(code);
  }

  async clearProjectName() {
    await this.projectNameField.fill('');
  }

  // ===============================
  // ⚙️ Form Actions
  // ===============================
  async clickEdit() {
    await this.editButton.click();
  }

  async clickUpdate() {
    await this.updateButton.click();
  }

  async updateProjectName(newName) {
    await this.projectNameField.fill(newName);
    await this.clickUpdate();
  }

  // ===============================
  // ✅ Verifications
  // ===============================
  async verifyPrePopulatedData(expectedName, expectedCode) {
    await expect(this.projectNameField).toHaveValue(expectedName);
    await expect(this.projectCodeField).toHaveValue(expectedCode);
  }

  async verifyFieldsAreEditable() {
    await expect(this.projectNameField).toBeEditable();
  }

  async verifyFieldsAreDisabled() {
    await expect(this.projectNameField).toBeDisabled();
    await expect(this.projectCodeField).toBeDisabled();
  }

  async expectToastContains(text) {
    await expect(this.toastMessage).toContainText(text, { timeout: 8000 });
  }
}

module.exports = EditProjectPage;
