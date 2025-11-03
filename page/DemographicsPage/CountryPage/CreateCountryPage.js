const CountryForm = require('./CountryForm');
const { expect } = require('@playwright/test');

class CreateCountryPage {
  constructor(page) {
    this.page = page;
    this.pageHeader = page.getByRole('heading', { name: 'Create Country' });
    this.form = new CountryForm(page);
  }
}

module.exports = CreateCountryPage;
