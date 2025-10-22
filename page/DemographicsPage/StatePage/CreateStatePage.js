const StateForm = require('./StateForm');
const { expect } = require('@playwright/test');

class CreateStatePage {
  constructor(page) {
    this.page = page;
    this.form = new StateForm(page);

    // FIXED: use text instead of role
    this.pageHeader =page.locator('//*[@id="create-state"]/div/div[1]/div');
  }

  async goToCreateState(basePage) {
    await basePage.goToCreateState();
    await expect(this.pageHeader).toBeVisible();
  }

  async createState({ country, name, code }) {
    await this.form.fillForm({ country, name, code });
    await this.form.create();
  }
}

module.exports = CreateStatePage;
