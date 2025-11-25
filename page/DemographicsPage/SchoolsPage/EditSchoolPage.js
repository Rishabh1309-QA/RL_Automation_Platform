const { expect } = require('@playwright/test');

class EditSchoolPage {
  constructor(page) {
    this.page = page;

    // ======== CORE LOCATORS ========
    this.pageHeader = page.locator('//*[@id="school-details"]/div/div[1]/div');

    this.nameInput = page.getByLabel('Name *');
    this.udiseInput = page.getByLabel('UDISE Code *');

    // Dynamic selects (custom dropdowns)
    this.schoolTypeContainer = page.locator('div').filter({ hasText: 'Choose type' });
    this.districtContainer = page.locator('div').filter({ hasText: 'Select District' });

    // Buttons
     this.editButton = page.getByRole('button', { name: 'Edit' });
    this.updateButton = page.getByRole('button', { name: 'Update' });
    this.backButton = page.getByRole('button', { name: 'Back' });

    // Sections (plain divs)
   // Sections (scoped by container, not purely role)
    this.launchesSectionContainer = page.locator('div').filter({ hasText: 'Launches' }).first();
    this.moderatorsSectionContainer = page.locator('div').filter({ hasText: 'Moderators' }).first();
    this.groupsSectionContainer = page.locator('div').filter({ hasText: 'Groups' }).first();


    // Toast messages
    this.toast = page.locator('.toast').last();
  }

  // ======== ACTIONS ========

  async clickEdit() {
    await expect(this.editButton).toBeEnabled({ timeout: 15000 });
    await this.editButton.click();

    // Verify edit mode by checking that name input becomes editable
    await expect(this.nameInput).not.toHaveAttribute('disabled', 'disabled');
  }

  async clickSave() {
    await expect(this.updateButton).toBeEnabled();
    await this.updateButton.click();
  }

  async clickBack() {
    await this.page.waitForTimeout(5000);
     // slight delay to ensure stability
    
    await this.backButton.click();
}

  async updateSchoolName(newName) {
    await expect(this.nameInput).not.toHaveAttribute('disabled');
    await this.nameInput.fill(newName);
  }

  // ======== VALIDATIONS ========

  async validateInitialData({ name, udise, type, district }) {
    await expect(this.nameInput).toHaveValue(name);
    await expect(this.udiseInput).toHaveValue(udise);

    // Look for selected type/district tags
    await expect(this.schoolTypeContainer.getByText(type)).toBeVisible({ timeout: 8000 });
    await expect(this.districtContainer.getByText(district)).toBeVisible({ timeout: 8000 });
  }

 async verifyPrePopulatedData() {
  console.log("🔎 Capturing pre-filled school details...");

  // Capture only Name and UDISE values
  const nameValue = await this.nameInput.inputValue();
  const udiseValue = await this.udiseInput.inputValue();

  console.log(`📋 Pre-filled values detected:
    Name = ${nameValue},
    UDISE = ${udiseValue}`);

  // Validate that both values are non-empty
  await expect(this.nameInput).not.toHaveValue('');
  await expect(this.udiseInput).not.toHaveValue('');

  console.log("✅ Name and UDISE pre-populated data captured and validated successfully.");
}


 async verifyFieldsReadOnly() {
  console.log("🔒 Verifying that important fields are read-only...");
  await expect(this.nameInput).toBeDisabled();
  await expect(this.udiseInput).toBeDisabled();
  await expect(this.editButton).toBeVisible();
  console.log("✅ All key fields verified as read-only.");
}


  async verifyFieldsEditable() {
    await expect(this.nameInput).not.toHaveAttribute('disabled', 'disabled');
    await expect(this.udiseInput).toHaveAttribute('disabled', 'disabled'); // stays locked
  }
// ===================== Validate Table Sections =====================
async validateLaunchesTableData() {
  console.log("📋 Validating Launches section...");
  await expect(this.launchesSectionContainer).toBeVisible();
  const launchesText = this.launchesSectionContainer.getByText('No records found.').first();
  await expect(launchesText).toBeVisible();
}

async validateModeratorsTableData() {
  console.log("📋 Validating Moderators section...");
  await expect(this.moderatorsSectionContainer).toBeVisible();
  const moderatorsText = this.moderatorsSectionContainer.getByText('No records found.').first();
  await expect(moderatorsText).toBeVisible();
}

async validateGroupsTableData() {
  console.log("📋 Validating Groups section...");
  await expect(this.groupsSectionContainer).toBeVisible();
  const groupsText = this.groupsSectionContainer.getByText('No records found.').first();
  await expect(groupsText).toBeVisible();
}

  async expectSuccessToast(messagePart) {
    await expect(this.toast).toContainText(messagePart, { timeout: 8000 });
  }
}

module.exports = EditSchoolPage;
