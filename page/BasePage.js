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
    // 🔹 Content -> Activities
    this.contentSummary = page.locator('summary').filter({ hasText: 'Content' }).first();
    this.activitiesMenuLink = page.getByText('Activities', { exact: true });
    this.browseActivitiesLink = page.getByRole('link', { name: 'Browse Activities' });
    this.createActivityLink = page.getByRole('link', { name: 'Create Activity' });
   
    //  content -> Polls
    this.pollsMenuLink = page.locator('summary').filter({ hasText: 'Polls' });
    this.createPollLink = page.getByRole('link', { name: 'Create Poll' });
    this.browsePollsLink = page.getByRole('link', { name: 'Browse Polls' });
    

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

  // 🔹 Content → Activities
  async openContentMenu() {
    await this.contentSummary.click();
  }
  async openActivitiesMenu() {
    await this.openContentMenu();
    await this.activitiesMenuLink.click();
  }
  async goToBrowseActivities() {
    await this.openActivitiesMenu();
    await this.browseActivitiesLink.click();
  }
  async goToCreateActivity() {
    await this.openActivitiesMenu();
    await this.createActivityLink.click();
  }

  //Polls
  async goToCreatePoll() {
    await this.contentSummary.click();
    await this.pollsMenuLink.click();
    await this.createPollLink.click();
  }

 async goToBrowsePolls() {
    await this.contentSummary.click();
    await this.pollsMenuLink.click();
    await this.browsePollsLink.click();
    
  }
}

module.exports = BasePage;
