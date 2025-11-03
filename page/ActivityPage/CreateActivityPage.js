import { expect } from '@playwright/test';

class CreateActivityPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.contentMenu = page.getByText('Content', { exact: true });
    this.activitiesMenu = page.getByText('Activities', { exact: true });
    this.createActivityLink = page.getByRole('link', { name: 'Create Activity' });

    // Step 1: Basic Info
    this.activityTypeDropdown = page.locator('.select').first();
    this.activityTypeOption = page.locator('.py-3').first();
    this.titleInput = page.getByRole('textbox', { name: 'Activity Title *' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Activity Description *' });
    this.levelDropdown = page.locator('div:nth-child(4) > div > .select').first();
    this.levelOption = page.getByText('Level 2');
    this.masteryDropdown = page.locator('div:nth-child(5) > div > .select').first();
    this.masteryOption = page.locator('[id*="Mastery"]').first();
    this.responseDropdown = page.locator('div:nth-child(6) > div > .select').first();
    this.responseOption = page.getByText('Respond with text');
    this.durationDropdown = page.locator('div:nth-child(7) > div > .select');
    this.durationOption = page.getByText('Short activity - under 7 mins');
    this.materialDropdown = page.locator('div:nth-child(9) > div > .select');
    this.materialOption = page.getByText('No material required');
    this.categoryDropdown = page.locator('div:nth-child(10) > div > .select');
    this.categoryOption = page.getByText('Socio dramatic play');
    this.themeDropdown = page.locator('div:nth-child(11) > div > .select');
    this.themeOption = page.getByText('Fruits and vegetables');
    this.nextButton = page.getByRole('button', { name: 'Next' });

    // Step 2: Learning outcomes
    this.learningDomainContainer = page.locator('div.select[placeholder="Select Learning Domain"]');
    this.learningDomainInput = page.locator('input[id^="mary"][x-ref="searchInput"]');
    this.learningDomainOption = page.locator('div[role="option"]', { hasText: 'Assessment and Evaluation' });

    this.subDomain = page.locator('input[placeholder="Select Sub Domain(s)"]');
    this.learningOutcome = page.locator('input[placeholder="Select Outcome(s) first"]');
    this.learningModule = page.locator('input[placeholder="Select Learning Module(s)"]');
    this.learningCompetency = page.locator('input[placeholder="Select Learning Competency(ies)"]');
    this.teachingMethod = page.locator('input[placeholder="Select Teaching Method(s)"]');

    // Step 3: Vernacular
    this.languageDropdown = page.locator('.relative > div > div > .select').first();
    this.languageOption = page.getByText('Hindi');
    this.vernacularTitleInput = page.getByRole('textbox', { name: 'Vernacular Title *' });
    this.fileUpload = page.locator('input[type="file"]').first();

    // Step 4: Final metadata
    this.dubbedDropdown = page.locator('div:nth-child(6) > div > div > .select');
    this.dubbedOption = page.getByText('Dubbed').first();
    this.typeDropdown = page.locator('div:nth-child(7) > div > div > .select');
    this.typeOption = page.getByText('Video', { exact: true });
    this.genderDropdown = page.locator('div:nth-child(8) > div > div > .select');
    this.genderOption = page.getByText('Female').first();
    this.genderDropdown2 = page.locator('div:nth-child(9) > div > div > .select');
    this.genderOption2 = page.getByText('Male', { exact: true }).nth(1);
    this.religionDropdown = page.locator('div:nth-child(11) > div > div > .select');
    this.religionOption = page.getByText('Muslim');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  // Navigation
  async navigateToCreateActivity() {
    await this.contentMenu.click();
    await this.activitiesMenu.click();
    await this.createActivityLink.click();
  }

  // Step 1
  async fillBasicInfo(title, description) {
    await this.activityTypeDropdown.click();
    await this.activityTypeOption.click();
    await this.titleInput.fill(title);
    await this.descriptionInput.fill(description);
    await this.levelDropdown.click();
    await this.levelOption.click();
   /* await this.masteryDropdown.click();
    await this.masteryOption.click();
    await this.responseDropdown.click();
    await this.responseOption.click();
    await this.durationDropdown.click();
    await this.durationOption.click();
    await this.materialDropdown.click();
    await this.materialOption.click();
    await this.categoryDropdown.click();
    await this.categoryOption.click();
    await this.themeDropdown.click();
    await this.themeOption.click();*/
     await this.page.waitForTimeout(3000);
    await this.nextButton.click();
      await this.page.waitForTimeout(3000);
    await this.nextButton.click();
  }

  // Step 2
  async selectLearningDomain() {
    await this.learningDomainContainer.click();
    await this.learningDomainInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.learningDomainInput.fill('Assessment and Evaluation');
    await this.learningDomainOption.waitFor({ state: 'visible', timeout: 10000 });
    await this.learningDomainOption.click();
    await this.nextButton.click();
  }

  async fillLearningOutcomes() {
    await this.nextButton.click();
  }

  // Step 3
  async fillVernacular(title) {
      // Wait until dropdown is ready
    await this.languageDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await this.languageDropdown.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);

    // Click dropdown and select language
    await this.languageDropdown.click();
    await this.languageOption.waitFor({ state: 'visible', timeout: 5000 });
    await this.languageOption.click();

    // Fill title
    await this.vernacularTitleInput.fill(title);
    await this.page.waitForTimeout(10000);
    const filePath = 'C:\Users\aaa\Downloads\RL_Automation_Platform-RL_Automation_Platform (1)\RL_Automation_Platform-RL_Automation_Platform\tests//uploadFiles//white1.png';
    await this.fileUpload.setInputFiles(filePath);
        await this.page.waitForTimeout(10000);

    await this.nextButton.click();
  }

  // Step 4
  async fillFinalMetadata() {
    await this.dubbedDropdown.click();
    await this.dubbedOption.click();
    await this.typeDropdown.click();
    await this.typeOption.click();
    await this.genderDropdown.click();
    await this.genderOption.click();
    await this.genderDropdown2.click();
    await this.genderOption2.click();
    await this.religionDropdown.click();
    await this.religionOption.click();
    await this.finishButton.click();
  }
}

export default CreateActivityPage;
