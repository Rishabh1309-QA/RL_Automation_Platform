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

    // 🔹 Demographics → Projects ✅ (NEW)
    this.projectsSummary = page.locator('summary').filter({ hasText: 'Projects' });
    this.browseProjectsLink = page.getByRole('link', { name: 'Browse Projects' });
    this.createProjectLink = page.getByRole('link', { name: 'Create Project' });

    // (Future: Beats / Schools can be added here in same pattern)
  }

  // ======================================================
  // 🔹 Generic helper for stable clicks
  // ======================================================
  async safeClick(locator, timeout = 7000) {
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
  // 🔹 Projects ✅ (New Section)
  // ======================================================
  async openProjectsMenu() {
    await this.openDemographicsMenu();
    await this.safeClick(this.projectsSummary);
  }

  async goToBrowseProjects() {
    await this.openProjectsMenu();
    await this.safeClick(this.browseProjectsLink);
  }

  async goToCreateProject() {
    await this.openProjectsMenu();
    await this.safeClick(this.createProjectLink);
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
}

module.exports = BasePage;
