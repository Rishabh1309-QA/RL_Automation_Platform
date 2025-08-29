import { expect } from '@playwright/test';

class BrowseUserPage {
  constructor(page) {
    this.page = page;
    this.browseUserLink = page.getByRole('link', { name: 'Browse User' });
    this.searchBox = page.getByPlaceholder('Search... ');
    this.userRow = (name) => page.getByRole('row', { name: new RegExp(name, 'i') });
    this.confirmDeleteButton = page.locator("//button[@class='btn normal-case btn-error']");
    this.cancelDeleteButton = page.locator("//button[@class='btn normal-case']");
    this.createUserButton = page.getByRole('button', { name: 'Create User' });
    this.createUserForm = page.getByRole('form', { name: 'Create User' });
    // Updated locator for the Name column header
    this.sortByNameHeader = page.getByRole('cell', { name: 'Name' });
    
    // Updated locator for the all user names in the Name column
    this.allUserCells = page.locator('table tbody tr td:nth-child(1)');
    // New locator for the confirmation modal itself
    this.confirmationModal = page.locator('div[role="dialog"]');
  }

  async goToBrowseUser(basePage) {
    await basePage.openUserMenu();
    await this.browseUserLink.click();
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

  // --- This method is now more robust. It takes the user's name as an argument.
  async settingIcon(userName) {
    const userRow = this.userRow(userName);
    const settingButton = userRow.getByRole('link', { name: 'Edit' });
    await settingButton.click();
  }

  // --- Updated methods to be more robust.
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
  // --- End of updated methods

  /**
   * Encapsulates the entire delete and verification flow for a user.
   * This is a more robust method that combines a sequence of actions and waits.
   * @param {string} userName - The name of the user to delete.
   */
  async deleteUserAndVerify(userName) {
    // Find the specific user's row. We use a regex in getByRole to make it more flexible.
    const userRow = this.userRow(userName);

    // Wait for the user row to be visible before attempting to delete.
    await expect(userRow).toBeVisible();

    // Clicks the delete button that is *inside* this specific user's row.
    const deleteButton = userRow.getByRole('button', { name: 'Delete' });
    await deleteButton.click();
    
    // Confirms the deletion.
    await this.confirmDelete();

    // Wait for the confirmation modal to disappear. This is a reliable signal
    // that the action has been submitted.
    await expect(this.confirmationModal).not.toBeVisible();

    // Then, wait for the user's row to be removed from the DOM.
    await expect(userRow).toHaveCount(0);
  }

  /**
   * Encapsulates the entire cancel deletion and verification flow for a user.
   * This ensures the test is not flaky and works regardless of the user's position.
   * @param {string} userName - The name of the user to cancel deletion for.
   */
  async cancelDeleteAndVerify(userName) {
    const userRow = this.userRow(userName);

    await expect(userRow).toBeVisible();

    // Clicks the delete button in the specific user's row.
    const deleteButton = userRow.getByRole('button', { name: 'Delete' });
    await deleteButton.click();

    // Clicks the cancel button in the confirmation modal.
    await this.cancelDelete();

    // Verify the modal is not visible and the user's row is still visible.
    await expect(this.confirmationModal).not.toBeVisible();
    await expect(userRow).toBeVisible();
  }
}
module.exports = BrowseUserPage;