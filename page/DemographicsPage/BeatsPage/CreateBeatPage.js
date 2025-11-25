// page/DemographicsPage/BeatsPage/CreateBeatPage.js
const { expect } = require('@playwright/test');
const BeatForm = require('./BeatForm');

class CreateBeatPage {
  constructor(page) {
    this.page = page;
    this.pageHeader = page.getByText('Create Beat/Sector'); // heading text from screenshot
    this.form = new BeatForm(page);
  }

  async verifyPageLoaded() {
    await expect(this.pageHeader).toBeVisible();
  }
}

module.exports = CreateBeatPage;
