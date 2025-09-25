class BasePage {
  constructor(page) {
    this.page = page;

    // 🔹 Main Menus
    this.userMenuButton = page.locator('summary').filter({ hasText: 'Users' });
    this.demographicsMenuButton = page.getByText('Demographics');

    // 🔹 Demographics → Countries
    this.countriesSummary = page.locator('summary').filter({ hasText: 'Countries' });
    this.browseCountriesLink = page.getByRole('link', { name: 'Browse Countries' });
    this.createCountryLink = page.getByRole('link', { name: 'Create Country' });

    // 🔹 Demographics → States
    this.statesSummary = page.locator('summary').filter({ hasText: 'States' });
    this.browseStatesLink = page.getByRole('link', { name: 'Browse States' });
    this.createStateLink = page.getByRole('link', { name: 'Create State' });

    // 🔹 Demographics → Districts
    this.districtsSummary = page.locator('summary').filter({ hasText: 'Districts' });
    this.browseDistrictsLink = page.getByRole('link', { name: 'Browse Districts' });
    this.createDistrictLink = page.getByRole('link', { name: 'Create District' });

    // (you can keep adding Projects, Beats/Sectors, Schools, etc.)
  }

  // 🔹 Generic menu openers
  async openUserMenu() {
    await this.userMenuButton.waitFor({ state: 'visible' });
    await this.userMenuButton.click();
  }

  async openDemographicsMenu() {
    await this.demographicsMenuButton.click();
  }

  // 🔹 Countries
  async openCountriesMenu() {
    await this.openDemographicsMenu();
    await this.countriesSummary.click();
  }
  async goToBrowseCountries() {
    await this.openCountriesMenu();
    await this.browseCountriesLink.click();
  }
  async goToCreateCountry() {
    await this.openCountriesMenu();
    await this.createCountryLink.click();
  }

  // 🔹 States
  async openStatesMenu() {
    await this.openDemographicsMenu();
    await this.statesSummary.click();
  }
  async goToBrowseStates() {
    await this.openStatesMenu();
    await this.browseStatesLink.click();
  }
  async goToCreateState() {
    await this.openStatesMenu();
    await this.createStateLink.click();
  }

  // 🔹 Districts
  async openDistrictsMenu() {
    await this.openDemographicsMenu();
    await this.districtsSummary.click();
  }
  async goToBrowseDistricts() {
    await this.openDistrictsMenu();
    await this.browseDistrictsLink.click();
  }
  async goToCreateDistrict() {
    await this.openDistrictsMenu();
    await this.createDistrictLink.click();
  }
}

module.exports = BasePage;
