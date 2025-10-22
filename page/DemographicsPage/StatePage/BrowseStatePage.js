const { expect } = require('@playwright/test');

class BrowseStatePage {
  constructor(page) {
    this.page = page;

    // Header + table
    this.pageHeader = page.locator('#states').getByText('states');
    this.stateTable = page.locator('table');

    // Search + Add
    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.addButton = page.getByRole('link', { name: 'Create State' });
  }

  async goToBrowseStates(basePage) {
    await basePage.goToBrowseStates();
    await expect(this.pageHeader).toBeVisible();
  }

  async verifyDataIsDisplayed() {
    const firstRow = this.page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible();
  }

  async verifyStateInTable(stateName) {
    await expect(this.stateRow(stateName)).toBeVisible();
  }

  async searchState(name) {
    await this.searchBox.fill(name);
  }

  async clickEditState(stateName) {
    const row = this.page.locator(`tr:has-text("${stateName}")`);
    await row.getByRole('link', { name: 'Edit' }).click();
  }

  async clickAddState() {
    await this.addButton.click();
  }

  async cancelDeleteState(stateName) {
    const row = this.page.locator(`tr:has-text("${stateName}")`);
    await row.getByRole('button', { name: 'Delete' }).click();
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }

  async getStates() {
    return (await this.page.locator('table tr td:nth-child(1)').allTextContents())
      .map(t => t.trim());
  }

  async sortByState() {
    await this.page.getByRole('cell', { name: 'State' }).click();
  }

  // 🔹 Added helper: find row for specific state
  stateRow(stateName) {
    return this.page.locator(`table tr:has-text("${stateName}")`);
  }

  // 🔹 Added helper: delete state from table
 async deleteState(stateName) {
  // Locate the row for that specific state
  const row = this.page.locator(`tr:has-text("${stateName}")`);
  
  // Click the "Delete" button in that row
  await row.getByRole('button', { name: 'Delete' }).click();

  // Wait for the confirmation dialog to appear
  const dialog = this.page.getByRole('dialog');
  
  // Click the "Delete" button inside the dialog
  await dialog.getByRole('button', { name: 'Delete' }).click();

  // Verify that the state is no longer in the table
  await expect(this.stateTable).not.toContainText(stateName);

  console.log(`🗑️ Deleted state "${stateName}" successfully.`);
}

}

module.exports = BrowseStatePage;
