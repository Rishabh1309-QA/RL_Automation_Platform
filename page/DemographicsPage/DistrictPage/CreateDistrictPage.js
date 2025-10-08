const DistrictForm = require('./DistrictForm');
const { expect } = require('@playwright/test');

class CreateDistrictPage {
  constructor(page) {
    this.page = page;
    this.pageHeader = page.getByRole('heading', { name: 'Create District' });
    this.form = new DistrictForm(page);
  }
}

module.exports = CreateDistrictPage;
