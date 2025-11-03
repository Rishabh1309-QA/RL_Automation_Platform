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

    // Table
    this.permissionNameHeader = page.getByRole('cell', { name: 'Permission Name' });
    this.firstRowInTable = page.getByRole('row').nth(1);

    // Create
    this.addPermissionBtn = page.locator('#permissions').getByRole('link');
    this.permissionNameInput = page.getByRole('textbox', { name: 'Permission Name *' });
    this.createButton = page.getByRole('button', { name: 'Create' });

    // Edit
    this.editToggleButton = page.locator('#toggleButton');
    this.updateButton = page.getByRole('button', { name: 'Update' });

    // Search/Delete
    this.searchInput = page.getByPlaceholder('Search...');
    this.confirmDeleteBtn = page.getByRole('dialog').getByRole('button', { name: 'Delete' });
    this.cancelDeleteBtn = page.getByRole('dialog').getByRole('button', { name: 'Cancel' });

    // Feedback
    this.successToast = page.locator('div.font-bold');
    this.permissionNameError = (text) => this.page.locator(`text=${text}`);
    this.noResultsFoundText = page.locator(
      'div.text-center.py-4.text-gray-500.dark\\:text-gray-400',
      { hasText: 'No records found.' }
    );

    // Other
    this.resetButton = page.locator(
      '//html/body/main/div/div[1]/div/div/div[4]/div/div/form/div[2]/button[1]'
    );
    this.backButton = page.getByRole('link', { name: 'Back' });

    // Dynamic Rows
    this.permissionRow = (name) => page.getByRole('row', { name: new RegExp(name, 'i') });
    this.editButton = (name) => this.permissionRow(name).getByRole('link', { name: 'Edit' });
    this.deleteButton = (name) => this.permissionRow(name).getByRole('button', { name: 'Delete' });
  }

  // --- Assertions ---
 async assertPermissionNameError(text) {
  await expect(this.permissionNameError(text)).toBeVisible({ timeout: 10000 });
}

async assertDuplicatePermissionError(text) {
  await this.assertPermissionNameError(text);
}

  async assertNoResults() {
    await expect(this.noResultsFoundText).toBeVisible({ timeout: 5000 });
  }

  // --- Actions ---
  async navigateToPermissions(basePage) {
    await basePage.openUserMenu();
    await this.permissionsLink.click();
    await this.page.waitForURL('**/permissions');
    await expect(this.permissionsHeader).toBeVisible();
  }

  async paginateNextAndPrevious() {
    await this.nextButton.click();
    await this.prevButton.click();
  } 

  async createPermission(name) {
    await this.addPermissionBtn.click();
    await this.permissionNameInput.fill(name);
    await this.createButton.click();
    if (await this.backButton.isVisible().catch(() => false)) {
      await this.backButton.click();
    }
  }

  async openPermissionDetails(name) {
    if (!(await this.searchInput.isVisible().catch(() => false)) && await this.backButton.isVisible()) {
      await this.backButton.click();
      await expect(this.searchInput).toBeVisible();
    }
    await this.searchPermission(name);
    await expect(this.permissionRow(name)).toBeVisible({ timeout: 30000 });
    await this.editButton(name).click();
  }

  async editPermissionName(newName) {
    await this.editToggleButton.click();
    await this.permissionNameInput.fill(newName);
    await this.updateButton.click();
  }

  async searchPermission(name) {
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.fill('');
    await this.searchInput.fill(name);
    await this.searchInput.press('Enter');
  }

  async deletePermission(name) {
    await this.deleteButton(name).click();
    await this.confirmDeleteBtn.click();
  }

  async openCreateForm() {
    await this.addPermissionBtn.click();
  }

  async resetForm() {
    await this.resetButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }
}

export default PermissionPage;