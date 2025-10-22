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

    //
    this.stakeholdersMenu = page.locator('summary').filter({ hasText: 'Stakeholders' });
    this.moderatorsLink = page.getByText('Moderators', { exact: true });
    this.browseModeratorLink = page.getByRole('link', { name: 'Browse Moderator' });
    // ... other locators ...
    // this.stakeHoldersMenu = page.locator // (This was in your original file [cite: 61])
    // It should be updated/corrected to:
    //this.stakeholdersMenu = page.getByRole('button', { name: 'Stakeholders' });
  }



  // 🔹 Generic menu openers
  async openUserMenu() {
    await this.userMenuButton.waitFor({ state: 'visible' });
    await this.userMenuButton.click();
  }

  async openDemographicsMenu() {
    await this.demographicsMenuButton.click();
  }

// 🔹 Stakeholders Methods (FIXED LOGIC)
  async openStakeholdersMenu() {
    // Explicitly wait for the top-level menu item to ensure the page is ready
    await this.stakeholdersMenu.waitFor({ state: 'visible' }); 
    await this.stakeholdersMenu.click();
  }

  async openModeratorsMenu() {
    // 1. Click Stakeholders to expand it
    await this.openStakeholdersMenu(); 
    // 2. Click Moderators to expand it and reveal the 'Browse' link
    await this.moderatorsLink.click(); 
  }

  async goToBrowseModerator() {
    // Your required flow: Stakeholders -> Moderators -> Browse Moderator
    await this.openModeratorsMenu(); 
    await this.browseModeratorLink.click();
    
  
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