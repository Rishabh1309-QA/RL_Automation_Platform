//const ModeratorForm = require('./ModeratorForm');
const { expect } = require('@playwright/test');

class GenerateEnrollmentPage {
  constructor(page) {
    this.page = page;
    this.pageHeader = page.getByRole('heading', { name: 'Teacher Enrollment Form' }); // Matches screenshot
    this.form = new ModeratorForm(page);
  }

  async verifyPageHeader() {
    await expect(this.pageHeader).toBeVisible();
  }

  // Wraps the form interaction for a complete action
  async generateLinkFor(state, language, sendLink = false) {
    await this.form.fillEnrollmentForm({ state, language, sendLink });
    await this.form.generateLink();
    // Logic to verify link generation/success message goes here
  }
}

module.exports = GenerateEnrollmentPage;