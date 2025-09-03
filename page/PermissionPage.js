import { expect } from '@playwright/test';

class PermissionPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.permissionsLink = page.getByRole('link', { name: 'Permissions' }).first();
    this.permissionsHeader = page.locator('div.text-4xl.font-extrabold', { hasText: 'Permissions' });

    // Pagination
    this.nextButton = page.getByRole('button', { name: 'Next »' });
    this.prevButton = page.getByRole('button', { name: '« Previous' });

    // Table headers
    this.permissionNameHeader = page.getByRole('cell', { name: 'Permission Name' });

    // Create Permission
    this.addPermissionBtn = page.locator('#permissions').getByRole('link');
    this.permissionNameInput = page.getByRole('textbox', { name: 'Permission Name *' });
    this.createButton = page.getByRole('button', { name: 'Create' });

    // Edit/Update
    this.editToggleButton = page.locator('#toggleButton');
    this.updateButton = page.getByRole('button', { name: 'Update' });

    // Search/Delete
    this.searchInput = page.getByRole('textbox', { name: 'Search...' });
    this.confirmDeleteBtn = page.getByRole('dialog').getByRole('button', { name: 'Delete' });

    // Reset & Back
    this.resetButton = page.locator(
      '//html/body/main/div/div[1]/div/div/div[4]/div/div/form/div[2]/button[1]'
    );
    this.backButton = page.getByRole('link', { name: 'Back' });

    // Row locators
    this.permissionRow = (name) =>
      page.getByRole('row', { name: new RegExp(name, 'i') });

    this.editButton = (name) =>
      this.permissionRow(name).getByRole('link', { name: 'Edit' });

    this.deleteButton = (name) =>
      this.permissionRow(name).getByRole('button', { name: 'Delete' });
  }

  // --- Actions ---
  async navigateToPermissions(basePage) {
    await basePage.openUserMenu();
    await this.permissionsLink.click();
    await this.page.waitForURL('**/permissions');
    await expect(this.permissionsHeader).toBeVisible();
  }

  async verifyPermissionsHeader() {
    await expect(this.permissionsHeader).toBeVisible();
  }

  async paginateNextAndPrevious() {
    await this.nextButton.click();
    await this.prevButton.click();
    await expect(this.nextButton).toBeVisible();
  }

  async verifyPermissionNameHeader() {
    await expect(this.permissionNameHeader).toBeVisible();
  }

  async createPermission(permissionName) {
    await this.addPermissionBtn.click();
    await this.permissionNameInput.fill(permissionName);
    await this.createButton.click();
  }

  async openPermissionDetails(permissionName) {
    await this.searchPermission(permissionName);
    const row = this.permissionRow(permissionName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await this.editButton(permissionName).click();
  }

  async editPermissionName(newName) {
    await this.editToggleButton.click();
    await this.permissionNameInput.fill(newName);
    await this.updateButton.click();
  }

  async searchPermission(name) {
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill('');
    await this.searchInput.fill(name);
  }

  async deletePermission(name) {
    await this.deleteButton(name).click();
    await this.confirmDeleteBtn.click();
  }

  async openCreateForm() {
    await this.addPermissionBtn.click();
  }

  async resetForm() {
    await expect(this.resetButton).toBeVisible();
    await this.resetButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }
}

export default PermissionPage;
