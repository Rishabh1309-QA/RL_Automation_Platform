// page/roles.page.js
import { expect } from '@playwright/test';

class RolesPage {
  constructor(page) {
    this.page = page;

    // Locators for navigating to the Roles page
    this.userMenuLink = page.getByText('Users', { exact: true });
    this.rolesLink = page.getByRole('link', { name: 'Roles' });
    
    // Locators on the Roles page
    this.rolesPageHeader = page.locator('#roles').getByText('Roles');
    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.nextButton = page.getByRole('button', { name: 'Next »' });
    this.previousButton = page.getByRole('button', { name: '« Previous' });
    this.sortByNameHeader = page.locator("//html/body/main/div/div[1]/div/div/div[4]/div/div[2]/div/div[1]/table/thead/tr/th[1]");
    this.allRoleCells = page.locator('table tbody tr td:nth-child(1)');
    this.addRoleButton = page.locator("//a[@href='roles/create' and contains(@class, 'btn')]");
    this.createRoleHeader = page.getByText('Create Role', { exact: true });

    // Locators for a specific role row
    this.roleRow = (name) => page.getByRole('row', { name: new RegExp(name, 'i') });
    this.editButton = (rowName) => this.roleRow(rowName).getByRole('link', { name: 'Edit' });
    this.deleteButton = (rowName) => this.roleRow(rowName).getByRole('button', { name: 'Delete' });

    // Locators for the confirmation dialog
    this.confirmationModal = page.locator('div[role="dialog"]');
    this.confirmDeleteButton = page.locator('div[role="dialog"] button:has-text("Delete")');
    this.cancelDeleteButton = page.locator('div[role="dialog"] button:has-text("Cancel")');
  }

  // --- Actions ---
  async navigateToRolesPage(basePage) {
  await basePage.openUserMenu(); // This should be a method of BasePage
  await this.rolesLink.click();
  await this.page.waitForURL('**/roles');
  await expect(this.rolesPageHeader).toBeVisible();
}

  async searchRole(roleName) {
    await this.searchBox.fill(roleName);
    await this.searchBox.press('Enter');
  }

 async sortByName() {
  // Wait for the main table to be visible, ensuring the data is loaded.
  const tableLocator = this.page.locator('table');
  await tableLocator.waitFor({ state: 'visible', timeout: 30000 });

  // Wait for the column header to be visible before clicking.
  await this.sortByNameHeader.waitFor({ state: 'visible', timeout: 30000 });
  await this.sortByNameHeader.click();
}

  async goToNextPage() {
    await this.nextButton.click();
    await this.page.waitForURL(/page=\d+/);
  }

  async goToPreviousPage() {
    await this.previousButton.click();
    await this.page.waitForURL(/page=1|roles$/);
  }

  async addRole() {
    await this.addRoleButton.click();
    await this.page.waitForURL('**/roles/create');

  }
  
  // --- Assertions & Verifications ---
  async assertRoleVisible(roleName) {
    await this.roleRow(roleName).waitFor({ state: 'visible', timeout: 5000 });
  }

  async assertRoleHeaderVisible() {
    await expect(this.createRoleHeader).toBeVisible();
  }

  async getRoleNames() {
    const names = await this.allRoleCells.allTextContents();
    return names.map((n) => n.trim().replace(/\s+/g, ' '));
  }

  async deleteRoleAndVerify(roleName) {
    const roleRow = this.roleRow(roleName);
    await expect(roleRow).toBeVisible();
    await this.deleteButton(roleName).click();
    await this.confirmDeleteButton.click();
    await expect(this.confirmationModal).not.toBeVisible();
    await expect(roleRow).toHaveCount(0);
  }

  async cancelDeleteAndVerify(roleName) {
    const roleRow = this.roleRow(roleName);
    await expect(roleRow).toBeVisible();
    await this.deleteButton(roleName).click();
    await this.cancelDeleteButton.click();
    await expect(this.confirmationModal).not.toBeVisible();
    await expect(roleRow).toBeVisible();
  }
}
module.exports = RolesPage;