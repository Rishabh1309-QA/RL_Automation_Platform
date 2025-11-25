const { expect } = require('@playwright/test');

class EditBeatPage {
  constructor(page) {
    this.page = page;

    // 🔹 Header
    this.pageHeader = page.getByText('Beat/Sector Details');

    // 🔹 Fields
    this.beatNameField = page.getByRole('textbox', { name: 'Beat/Sector Name *' });
    this.beatCodeField = page.getByRole('textbox', { name: 'Beat/Sector Code *' });
    this.projectDropdown = page.getByText(/Select.*Project/i);

    // 🔹 Buttons
    this.editButton = page.getByRole('button', { name: 'Edit' });
    this.updateButton = page.getByRole('button', { name: 'Update' });
    this.backButton = page.getByRole('button', { name: 'Back' });

    // 🔹 Toast / Validation
    this.toastMessage = page.locator('.toast-message');
  }

  // ===============================
  // 🧭 Navigation
  // ===============================
  async verifyPageLoaded() {
    await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
  }

  async goBack() {
    await this.backButton.click();
  }

  // ===============================
  // ✏️ Field Actions
  // ===============================
  async fillBeatName(name) {
    await this.beatNameField.fill(name);
  }

  async fillBeatCode(code) {
    await this.beatCodeField.fill(code);
  }

  async clearBeatName() {
    await this.beatNameField.fill('');
  }

  // ===============================
  // ⚙️ Button Actions
  // ===============================
  async clickEdit() {
    await this.editButton.click();
  }

  async clickUpdate() {
    await this.updateButton.click();
  }

  async updateBeatName(newName) {
    await this.beatNameField.fill(newName);
    await this.clickUpdate();
  }

  // ===============================
  // ✅ Verification Helpers
  // ===============================
  async verifyPrePopulatedData(expectedName, expectedCode) {
    await expect(this.beatNameField).toHaveValue(expectedName);
    await expect(this.beatCodeField).toHaveValue(expectedCode);
  }

  async verifyFieldsAreEditable() {
    await expect(this.beatNameField).toBeEditable();
  }

  async verifyFieldsAreDisabled() {
    await expect(this.beatNameField).toBeDisabled();
    await expect(this.beatCodeField).toBeDisabled();
  }

  async expectToastContains(text) {
    await expect(this.toastMessage).toContainText(text, { timeout: 8000 });
  }
}

module.exports = EditBeatPage;
