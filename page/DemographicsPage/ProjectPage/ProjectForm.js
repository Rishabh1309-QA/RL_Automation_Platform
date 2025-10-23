// page/DemographicsPage/ProjectPage/ProjectForm.js
const { expect } = require('@playwright/test');

class ProjectForm {
  constructor(page) {
    this.page = page;

    // 📝 Form fields
    this.projectName = page.getByRole('textbox', { name: 'Project Name *' });
    this.projectCode = page.getByRole('textbox', { name: 'Project Code *' });
    this.districtDropdown = page.getByPlaceholder('Search ...');

    // 🖱️ Buttons
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.backButton = page.getByRole('button', { name: 'Back' });
  }

  // ========= Input Methods =========
  async enterProjectName(name) {
    await this.projectName.fill(name);
  }

  async enterProjectCode(code) {
    await this.projectCode.fill(code);
  }

  async selectDistrict(name) {
    await this.districtDropdown.click();
    const option = this.page.getByText(name, { exact: false });
    await expect(option.first()).toBeVisible({ timeout: 10000 });
    await option.first().click();
    await this.page.keyboard.press('Escape');
  }

  // ========= Action Methods =========
  async clickCreate() {
    await this.createButton.click();
  }

  async clickReset() {
    await this.resetButton.click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  // ========= Helper Methods =========
  async expectToastContains(text) {
    const toast = this.page.getByText(text, { exact: false });
    await expect(toast).toBeVisible({ timeout: 8000 });
  }

  // ========= Combined Fill =========
  async fillForm({ name, code, district }) {
    if (name) await this.enterProjectName(name);
    if (code) await this.enterProjectCode(code);
    if (district) await this.selectDistrict(district);
  }
}

module.exports = ProjectForm;
