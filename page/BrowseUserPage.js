import { expect } from '@playwright/test';

class BrowseUserPage {
  constructor(page) {
    this.page = page;
    this.browseUserLink = page.getByRole('link', { name: 'Browse User' });
    this.searchBox = page.getByPlaceholder('Search... ');
    this.userRow = (name) => page.getByRole('row', { name: new RegExp(name, 'i') });
    this.confirmDeleteButton = page.locator("//button[@class='btn normal-case btn-error']");
    this.cancelDeleteButton = page.locator("//button[@class='btn normal-case']");
    this.createUserButton = page.locator("//a[@class='btn normal-case']");
    this.createUserForm = page.getByRole('form', { name: 'Create User' });
    this.sortByNameHeader = page.getByRole('cell', { name: 'Name' });
    this.allUserCells = page.locator('table tbody tr td:nth-child(1)');
    this.confirmationModal = page.locator('div[role="dialog"]');

    // Edit scenario
    this.editButton=page.getByRole('button', { name: 'Edit' });
    this.updateUserButton=page.getByRole('button', { name: 'Update' });
    this.roleDropdown=page.getByPlaceholder('Select from options below');
    this.errormsg=page.getByText('The role field is required.');
    this.clearRoleButton = page.locator('.select > svg:nth-child(2)');

    // --- Pagination Locators ---
    this.nextButton = page.getByRole('button', { name: 'Next »' });
    this.previousButton = page.getByRole('button', { name: '« Previous' });
  }

  async goToBrowseUser(basePage) {
    await basePage.openUserMenu();
    await this.browseUserLink.click();
    await this.page.waitForURL('**/users');
  }

  async searchUser(name) {
    await this.searchBox.fill(name);
    await this.searchBox.press('Enter');
  }

  async sortByName() {
    await this.sortByNameHeader.click();
  }

  async getUserNames() {
    const names = await this.allUserCells.allTextContents();
    return names.map((n) => n.trim().replace(/\s+/g, ' '));
  }

  async assertUserVisible(name) {
    await this.userRow(name).waitFor({ state: 'visible', timeout: 5000 });
  }

  async createUser() {
    await this.createUserButton.click();
  }

  // --- Settings ---
  async settingIcon(userName) {
    const userRow = this.userRow(userName);
    const settingButton = userRow.getByRole('link', { name: 'Edit' });
    await settingButton.click();
  }

  //edit flow
  async editUserAndVerify() {
    await this.editButton.click();
    
  }

  //update edituser button
  async updateUser() {
    await this.updateUserButton.click();
  }


   async chooseRole() {
    await this.page.waitForTimeout(1000); // wait for dropdown to be interactable
    await this.roleDropdown.click();
    
     
  }

  async clearRole() {
    await this.page.waitForTimeout(1000);
    await this.clearRoleButton.click();
    await this.page.keyboard.press('Escape');
  }

    async updateRole(roleName) {
        await this.roleDropdown.click();
        const option = this.page.locator(`text=${roleName}`);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }

  async errormsgVisible() {
    await expect(this.errormsg).toBeVisible();
  }

  // --- Delete flow ---
  async openDeleteDialog(userRow) {
    const deleteButton = userRow.getByRole('button', { name: 'Delete' });
    await deleteButton.click();
  }

  async cancelDelete() {
    await this.cancelDeleteButton.click();
  }

  async confirmDelete() {
    await this.confirmDeleteButton.click();
  }

  async deleteUserAndVerify(userName) {
    const userRow = this.userRow(userName);
    await expect(userRow).toBeVisible();

    const deleteButton = userRow.getByRole('button', { name: 'Delete' });
    await deleteButton.click();
    await this.confirmDelete();

    await expect(this.confirmationModal).not.toBeVisible();
    await expect(userRow).toHaveCount(0);
  }

  async cancelDeleteAndVerify(userName) {
    const userRow = this.userRow(userName);
    await expect(userRow).toBeVisible();

    const deleteButton = userRow.getByRole('button', { name: 'Delete' });
    await deleteButton.click();
    await this.cancelDelete();

    await expect(this.confirmationModal).not.toBeVisible();
    await expect(userRow).toBeVisible();
  }

  // --- Pagination ---
  async goToNextPage() {
    if (await this.isNextButtonEnabled()) {
      await this.nextButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async goToPreviousPage() {
    if (await this.isPreviousButtonEnabled()) {
      await this.previousButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async goToLastPage(maxTries = 30) {
    let tries = 0;
    while (await this.isNextButtonEnabled() && tries < maxTries) {
      await this.nextButton.click();
      await this.page.waitForTimeout(500);
      tries++;
    }
    if (tries === maxTries) {
      console.warn("⚠️ Reached maxTries while trying to goToLastPage. Check dataset or locators.");
    }
  }

  async goToFirstPage(maxTries = 30) {
    let tries = 0;
    while (await this.isPreviousButtonEnabled() && tries < maxTries) {
      await this.previousButton.click();
      await this.page.waitForTimeout(500);
      tries++;
    }
    if (tries === maxTries) {
      console.warn("⚠️ Reached maxTries while trying to goToFirstPage. Check dataset or locators.");
    }
  }

  async isNextButtonEnabled() {
    return (await this.nextButton.isVisible()) && (await this.nextButton.isEnabled());
  }

  async isPreviousButtonEnabled() {
    return (await this.previousButton.isVisible()) && (await this.previousButton.isEnabled());
  }
}

export default BrowseUserPage;
