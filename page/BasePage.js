class BasePage {
  constructor(page) {
    this.page = page;
    this.userMenuButton = page.locator('summary').filter({ hasText: 'Users' }); // adjust name
  }

  async openUserMenu() {
    await this.userMenuButton.click();

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

    // (later add Projects, Beats/Sectors, Schools here)
  }

  // ======================================================
  // 🔹 Generic helper for stable clicks
  // ======================================================
  async safeClick(locator, timeout = 7000) {
    // Wait until the element is visible and stable
    await locator.waitFor({ state: 'visible', timeout });
    await locator.scrollIntoViewIfNeeded();

    try {
      await locator.click({ timeout });
    } catch (err) {
      console.warn(`⚠️ safeClick retrying after initial failure: ${err.message}`);
      await this.page.waitForTimeout(500);
      await locator.click({ timeout });
    }
  }

  // ======================================================
  // 🔹 Generic menu openers
  // ======================================================
  async openUserMenu() {
    await this.userMenuButton.waitFor({ state: 'visible' });
    await this.safeClick(this.userMenuButton);
  }

  async openDemographicsMenu() {
    await this.demographicsMenuButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded');
    await this.safeClick(this.demographicsMenuButton);

    // Optional wait for the submenus to appear
   // const firstSubMenu = this.page.locator('summary', { hasText: 'Countries' }).first();
   // await firstSubMenu.waitFor({ state: 'visible', timeout: 7000 });
  }

  // ======================================================
  // 🔹 Countries
  // ======================================================
  async openCountriesMenu() {
    await this.openDemographicsMenu();
    await this.safeClick(this.countriesSummary);
  }

  async goToBrowseCountries() {
    await this.openCountriesMenu();
    await this.safeClick(this.browseCountriesLink);
  }

  async goToCreateCountry() {
    await this.openCountriesMenu();
    await this.safeClick(this.createCountryLink);
  }

  // ======================================================
  // 🔹 States
  // ======================================================
  async openStatesMenu() {
    await this.openDemographicsMenu();
    await this.safeClick(this.statesSummary);
  }

  async goToBrowseStates() {
    await this.openStatesMenu();
    await this.safeClick(this.browseStatesLink);
  }

  async goToCreateState() {
    await this.openStatesMenu();
    await this.safeClick(this.createStateLink);
  }

  // ======================================================
  // 🔹 Districts
  // ======================================================
  async openDistrictsMenu() {
    await this.openDemographicsMenu();
    await this.safeClick(this.districtsSummary);
  }

  async goToBrowseDistricts() {
    await this.openDistrictsMenu();
    await this.safeClick(this.browseDistrictsLink);
  }

  async goToCreateDistrict() {
    await this.openDistrictsMenu();
    await this.safeClick(this.createDistrictLink);
  }

  // ======================================================
  // 🔹 Generic helpers (DRY)
  // ======================================================
  async goToBrowse(moduleName) {
    await this.openDemographicsMenu();
    const moduleSummary = this.page.locator('summary', { hasText: moduleName });
    await this.safeClick(moduleSummary);
    await this.safeClick(this.page.getByRole('link', { name: `Browse ${moduleName}` }));
  }

  async goToCreate(moduleName) {
    await this.openDemographicsMenu();
    const moduleSummary = this.page.locator('summary', { hasText: moduleName });
    await this.safeClick(moduleSummary);
    await this.safeClick(this.page.getByRole('link', { name: `Create ${moduleName}` }));
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
