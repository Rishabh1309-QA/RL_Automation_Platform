import { expect } from '@playwright/test';

class CreateRolePage {
  constructor(page) {
    this.page = page;

    // --- Locators ---
    this.pageHeader = page.getByText('Create Role', { exact: true });
    this.roleNameInput = page.getByPlaceholder('Please enter role name'); 
    this.permissionsDropdown = page.getByText('Choose Permissions *');
    this.permissionOption = (name) => page.getByRole('option', { name });
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.roleNameError = page.locator("//html/body/main/div/div[1]/div/div/div[4]/div/div/form/div[1]/div[2]"); 
    // Permission Error
    this.permissionError = page.locator("//html/body/main/div/div[1]/div/div/div[4]/div/div/form/div[2]/div/div[3]");
    this.successToast = page.locator('div.font-bold', { hasText: 'New role created successfully.' });
    this.duplicateRoleNameError = page.locator('div.text-red-500', { hasText: 'The name has already been taken.' });
  }

  // --- Actions ---
  async enterRoleName(name) {
    await this.roleNameInput.fill(name);
  }

  async choosePermission(permissionName) {
  // Click to open the dropdown (this puts focus in search box automatically)
  await this.permissionsDropdown.click();

  // Now type in the permission name directly (search box is already active)
  await this.page.keyboard.type(permissionName);

  // Wait for option to appear and click
  const option = this.page.locator(`text=${permissionName}`);
  await option.waitFor({ state: 'visible', timeout: 5000 });
  await option.first().click();
}

/*async closeDropdown() {
  // click on body or some safe blank area
  await this.page.click('body', { position: { x: 0, y: 0 } });
}*/



async clickCreate() {
  await this.page.keyboard.press('Escape');
  await this.createButton.waitFor({ state: 'visible' });
  await this.createButton.click();
}



  async clickReset() {
    await this.resetButton.waitFor({ state: 'visible' });
    await this.resetButton.click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  // --- Assertions ---
  async assertOnCreateRolePage() {
    await expect(this.pageHeader).toBeVisible();
  }

  async assertRoleNameError(expectedText) {
  await expect(this.roleNameError).toContainText(expectedText);
}

async assertPermissionError(expectedText) {
  await expect(this.permissionError).toContainText(expectedText);
}


  
  async assertSuccessMessage(expectedText) {
  await this.successToast.waitFor({ state: 'visible', timeout: 10000 });
  await expect(this.successToast).toContainText(expectedText);
}

  async assertFieldsAreCleared() {
    await expect(this.roleNameInput).toHaveValue('');
    await expect(this.permissionsDropdown).toHaveText(/Choose permission/i);
  }
}

module.exports = CreateRolePage;
