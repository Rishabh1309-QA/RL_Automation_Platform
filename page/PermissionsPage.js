const { expect } = require('@playwright/test'); 
class PermissionsPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.usersMenu = page.getByText('Users');
    this.permissionsLink = page.getByRole('link', { name: 'Permissions' }).first();
      this.nextButton = page.getByRole('button', { name: 'Next »' });
    this.prevButton = page.getByRole('button', { name: '« Previous' });
     this.permissionsHeader = page.locator('div.text-4xl.font-extrabold', { hasText: 'Permissions' });

    this.permissionNameHeader = page.getByRole('cell', { name: 'Permission Name' });
  
    this.addPermissionBtn = page.locator('#permissions').getByRole('link');
    // Create Permission
    this.addPermissionBtn = page.locator('#permissions').getByRole('link');
    this.permissionNameInput = page.getByRole('textbox', { name: 'Permission Name *' });
    this.createButton = page.getByRole('button', { name: 'Create' });

    // Edit/Update
    this.editToggleButton = page.locator('#toggleButton');
    this.updateButton = page.getByRole('button', { name: 'Update' });

    // Search/Delete
    this.searchInput = page.getByRole('textbox', { name: 'Search...' });
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.confirmDeleteBtn = page.getByRole('dialog').getByRole('button', { name: 'Delete' });
    // this.searchInput = page.locator('input[placeholder="Search..."]');

     // Reset & Back buttons (FIX)
this.resetButton = page.locator(
      '//html/body/main/div/div[1]/div/div/div[4]/div/div/form/div[2]/button[1]'
    );
    this.backButton = page.getByRole('link', { name: 'Back' });
    
  }

  async navigateToPermissions() {
    await this.usersMenu.click();
    await this.permissionsLink.click();
     await expect(this.page).toHaveURL(/.*permissions/);
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
    await this.page.getByRole('row', { name: new RegExp(permissionName, 'i') })
      .getByRole('link', { name: 'Edit' })
      .first()
      .click();
  }

  async editPermissionName(newName) {
    await this.editToggleButton.click();
    await this.permissionNameInput.fill(newName);
    await this.updateButton.click();
  }

async searchPermission(name) {
  // Wait until input is visible and enabled
  await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
  
  // Clear any existing text before filling
  await this.searchInput.fill(''); 

  // Fill the input
  await this.searchInput.fill(name);
}


  async deletePermission(name) {
    await this.page.getByRole('row', { name: new RegExp(name, 'i') })
      .getByRole('button', { name: 'Delete' })
      .click();
    await this.confirmDeleteBtn.click();
  }
async openCreateForm() {
  await this.addPermissionBtn.click();
}

async resetForm() {
  await expect(this.resetButton).toBeVisible();
  await this.resetButton.click();
}


async openPermissionDetails(permissionName) {

  await this.searchPermission(permissionName); // Fill the search input
  await this.page.waitForTimeout(500);         // Small debounce if needed

  const row = this.page.getByRole('row', { name: new RegExp(permissionName, 'i') });
  await expect(row).toBeVisible({ timeout: 10000 });
  await row.getByRole('link', { name: 'Edit' }).click();
}


  async goBack() {
    await this.backButton.click();
  }
}

module.exports = PermissionsPage;
