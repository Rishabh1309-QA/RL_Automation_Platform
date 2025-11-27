const { expect } = require('@playwright/test');

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

    // 🔹 Demographics → Projects
    this.projectsSummary = page.locator('summary').filter({ hasText: 'Projects' });
    this.browseProjectsLink = page.getByRole('link', { name: 'Browse Projects' });
    this.createProjectLink = page.getByRole('link', { name: 'Create Project' });

    // 🔹 Demographics → Beats/Sectors ✅ (New)
    this.beatsSummary = page.locator('summary').filter({ hasText: 'Beats/Sectors' });
    this.browseBeatsLink = page.getByRole('link', { name: 'Browse Beats/Sectors' });
    this.createBeatLink = page.getByRole('link', { name: 'Create Beat/Sector' });

    // 🔹 Demographics → Schools

    this.schoolsSummary = page.locator('summary').filter({ hasText: 'Schools' });
    this.browseSchoolsLink = page.getByRole('link', { name: 'Browse Schools' });
    this.createSchoolLink = page.getByRole('link', { name: 'Create School' });

    // 🔹 Stakeholders → Moderator
    this.moderatorSummary = page.locator('summary').filter({ hasText: 'Moderator' });
    this.browseModeratorLink = page.getByRole('link', { name: 'Browse Moderator' });
    this.createModeratorLink = page.getByRole('link', { name: 'Create Moderator' });

     this.stakeholdersMenuButton = page.locator("//span[text()='Stakeholders']");
    this.moderatorMenuButton = page.locator("//span[text()='Moderators']");
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
  // 🔹 Projects
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
  // 🔹 Beats/Sectors ✅
  // ======================================================
  async openBeatsMenu() {
    await this.openDemographicsMenu();
    await this.safeClick(this.beatsSummary);
  }

  async goToBrowseBeats() {
    await this.openBeatsMenu();
    await this.safeClick(this.browseBeatsLink);
  }

  async goToCreateBeat() {
    await this.openBeatsMenu();
    await this.safeClick(this.createBeatLink);
  }

  // ======================================================
// 🔹 Schools
// ======================================================
async openSchoolsMenu() {
  await this.openDemographicsMenu();
  await this.safeClick(this.schoolsSummary);
}

async goToBrowseSchools() {
  await this.openSchoolsMenu();
  await this.safeClick(this.browseSchoolsLink);
}

async goToCreateSchool() {
  await this.openSchoolsMenu();
  await this.safeClick(this.createSchoolLink);
}
 // ============================================================
  // 🔹 STAKEHOLDERS MODULE (NEW)
  // ============================================================
  async openStakeholdersMenu() {
    await this.stakeholdersMenuButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.safeClick(this.stakeholdersMenuButton);
  }

  // ============================================================
  // 🔹 STAKEHOLDERS → MODERATOR (NEW)
  // ============================================================
  async openModeratorMenu() {
    await this.openStakeholdersMenu();
    await this.safeClick(this.moderatorSummary);
  }

  async goToBrowseModerator() {
    await this.openModeratorMenu();
    await this.safeClick(this.browseModeratorLink);
  }

  async goToCreateModerator() {
    await this.openModeratorMenu();
    await this.safeClick(this.createModeratorLink);
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
