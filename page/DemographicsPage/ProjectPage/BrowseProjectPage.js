const { expect } = require('@playwright/test');

class BrowseProjectPage {
  constructor(page) {
    this.page = page;

    // 🔸 Browse Project Page Locators
    this.pageHeader = page.locator('#projects').getByText('Projects');
    this.projectTable = page.locator('table');
    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.addButton = page.locator('#projects').getByRole('link'); // + button

    // 🔸 Sorting - Project column
    this.projectColumnHeader = page.getByRole('cell', { name: 'Project', exact: true });

    // 🔸 Filter Drawer Button (handled in FilterDrawer for actions)
    this.filterButton = page.locator('//*[@id="projects"]/div/div[3]/button');
  }

  async goToBrowseProjects(basePage) {
    await basePage.goToBrowseProjects();
    await expect(this.pageHeader).toBeVisible();
  }

  projectRow(name) {
    return this.page.locator('tr', { hasText: name });
  }

  async clickAddProject() {
    await this.addButton.click();
  }

  async clickEditProject(projectName) {
    const row = this.projectRow(projectName);
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await row.getByRole('link', { name: 'Edit' }).click();
  }

  async deleteProject(projectName) {
    const row = this.projectRow(projectName);
    await row.getByRole('button', { name: 'Delete' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Delete' }).click();
  }

  async cancelDeleteProject(projectName) {
    const row = this.projectRow(projectName);
    await row.getByRole('button', { name: 'Delete' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(this.projectTable).toContainText(projectName);
  }

  async searchProject(name) {
    await this.searchBox.fill(name);
  }

  async getProjectColumnValues() {
    const raw = await this.page.locator('table tr td:nth-child(2)').allTextContents();
    return raw.map(v => v.trim());
  }

  async sortByProjectColumn() {
    await this.projectColumnHeader.click();
  }

async verifyProjectSorting() {
  // Get values before and after sorting
  const beforeSort = await this.getProjectColumnValues();
  await this.projectColumnHeader.click();
  const afterSort = await this.getProjectColumnValues();

  // Check that afterSort is sorted in ascending Hindi/English order
  const isSorted = afterSort.every((val, i, arr) => {
    return i === 0 || arr[i - 1].localeCompare(val, 'hi', { sensitivity: 'base' }) <= 0;
  });

  // 1️⃣ Sorting should produce a sorted sequence
  expect(isSorted).toBeTruthy();

  // 2️⃣ Sorted array should differ from original (if data was not already sorted)
  if (JSON.stringify(beforeSort) !== JSON.stringify(afterSort)) {
    expect(afterSort).not.toEqual(beforeSort);
  }
}


}

module.exports = BrowseProjectPage;
