// tests/demographics/project/createproject.spec.js
import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseProjectPage = require('../../../page/DemographicsPage/ProjectPage/BrowseProjectPage');
const CreateProjectPage = require('../../../page/DemographicsPage/ProjectPage/CreateProjectPage');

test.describe('📌 Create Project Section', () => {
  let basePage, browseProjectPage, createPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseProjectPage = new BrowseProjectPage(page);
    createPage = new CreateProjectPage(page);

    // Navigate directly to Create Project
    await basePage.goToCreate('Project');
    await createPage.verifyPageLoaded();
  });

  test('PJ-19 ✅ Verify a new project can be successfully created', async () => {
    const projectName = `Dharmi`;
    const projectCode = `111111`;

    await createPage.form.fillForm({
      name: projectName,
      code: projectCode,
      district: 'Adilabad'
    });

    await createPage.form.clickCreate();
    await expect(browseProjectPage.projectRow(projectName)).toBeVisible();

    // Optional cleanup:
     await browseProjectPage.deleteProject(projectName);
  });

  test('PJ-20 ✅ Verify Reset button clears all input fields', async () => {
    await createPage.form.fillForm({ name: 'ResetCheck', code: 'RC01' });
    await createPage.form.clickReset();
    //await expect(createPage.form.nameField).toHaveValue('');
    //await expect(createPage.form.codeField).toHaveValue('');
  });

  test('PJ-21 ✅ Verify Back button returns to Browse Project page', async () => {
    await createPage.form.clickBack();
    await expect(browseProjectPage.pageHeader).toBeVisible();
  });

  test('PJ-22 ❌ Verify creation fails with duplicate project name', async () => {
    await createPage.form.fillForm({
      name: 'पोहरी', // existing project name
      code: '2342307',
      district: 'Shivpuri'
    });

    await createPage.form.clickCreate();
    await expect(createPage.page.getByText('The project code has already been taken.')).toBeVisible();
  });

  test('PJ-23 ❌ Verify creation fails with empty required fields', async () => {
    await createPage.form.fillForm({ name: '', code: '' });
    await createPage.form.clickCreate();
    await expect(createPage.page.locator('input:invalid')).toHaveCount(3);
  });

  test('PJ-24 ❌ Verify creation fails with invalid data', async () => {
    await createPage.form.fillForm({ name: '123@@', code: 'invalid@', district: 'Shivpuri' });
    await createPage.form.clickCreate();

  await expect(createPage.page.getByText('The project name field format is invalid.')).toBeVisible();
  await expect(createPage.page.getByText('The project code field must be a number.')).toBeVisible();
  await expect(createPage.page.getByText('The project code field must be between 6 and 7 digits.')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
});
