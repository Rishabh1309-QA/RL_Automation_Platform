// page/DemographicsPage/ProjectPage/CreateProjectPage.js
const { expect } = require('@playwright/test');
const ProjectForm = require('./ProjectForm');
const FilterDrawer = require('../../Components/FilterDrawer');

class CreateProjectPage {
  constructor(page) {
    this.page = page;
    this.pageHeader = page.getByText('Create Project');
    this.form = new ProjectForm(page);
    this.filterDrawer = new FilterDrawer(page);
  }

  async verifyPageLoaded() {
    await expect(this.pageHeader).toBeVisible({ timeout: 15000 });
  }
}

module.exports = CreateProjectPage;
