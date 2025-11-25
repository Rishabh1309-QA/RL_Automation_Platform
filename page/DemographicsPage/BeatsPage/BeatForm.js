// page/DemographicsPage/BeatsPage/BeatForm.js
const { expect } = require('@playwright/test');

class BeatForm {
  constructor(page) {
    this.page = page;

    // Fields
    this.beatName = page.getByRole('textbox', { name: 'Beat/Sector Name *' });
    this.beatCode = page.getByRole('textbox', { name: 'Beat/Sector Code *' });

    // Dropdowns
    this.districtDropdown = page.locator('div[placeholder="Search ..."]').first(); // District field
    this.projectDropdown = page.locator('div[placeholder="Search ..."]').nth(1); // Project field

    // Buttons
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.backButton = page.getByRole('button', { name: 'Back' });

    // Toast / messages
    this.toastMessageSelector = '.toast-message';
  }

  // ---------- Simple fill helpers ----------
  async enterName(value) {
    await this.beatName.fill(value);
  }

  async enterCode(value) {
    await this.beatCode.fill(value);
  }

  // ---------- Dropdown selection ----------
  async selectDistrict(name) {
    console.log(`🌍 Selecting District: ${name}`);
    await this.districtDropdown.scrollIntoViewIfNeeded();
    await this.districtDropdown.click();

    const option = this.page.getByText(name, { exact: false });
    await expect(option.first()).toBeVisible({ timeout: 10000 });
    await option.first().click();
  }

  async selectProject(name) {
    console.log(`🏗️ Selecting Project: ${name}`);
    // Wait for the dropdown to become interactive
    await this.page.waitForTimeout(1500);

    await this.projectDropdown.scrollIntoViewIfNeeded();
    await this.projectDropdown.click();

    // Select option from list
    const option = this.page.getByText(name, { exact: false });
    await expect(option.first()).toBeVisible({ timeout: 10000 });
    await option.first().click();
  }

  // ---------- Combined form fill ----------
  async fillForm({ name = '', code = '', district = '', project = '' } = {}) {
    if (name) await this.enterName(name);
    if (code) await this.enterCode(code);
    if (district) await this.selectDistrict(district);
    if (project) await this.selectProject(project);
  }

  // ---------- Actions ----------
  async create() {
    // Wait a bit for “Project Name” field to open after clicking “Create”
    await this.page.waitForTimeout(1500);
    await this.createButton.click();
  }

  async reset() {
    await this.resetButton.click();
  }

  async back() {
    await this.backButton.click();
  }

  // ---------- Assertions ----------
  async expectToastContains(text, timeout = 8000) {
    const toast = this.page.locator(this.toastMessageSelector);
    await expect(toast).toContainText(text, { timeout });
  }

  async isNameValid() {
    return await this.beatName.evaluate(el => el.validity.valid);
  }
}

module.exports = BeatForm;
