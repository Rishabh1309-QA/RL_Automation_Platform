import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseProjectPage = require('../../../page/DemographicsPage/ProjectPage/BrowseProjectPage');

test.describe('📍 Browse Projects Section', () => {
  let basePage, browseProject;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseProject = new BrowseProjectPage(page);
    await browseProject.goToBrowseProjects(basePage);
  });

  test('PJ-01 ✅ Verify successful navigation to Browse Projects page', async () => {
    await expect(browseProject.pageHeader).toBeVisible();
  });

  test('PJ-02 ✅ Verify correct data display in the projects table', async () => {
    await expect(browseProject.projectTable).toBeVisible();
    const rowCount = await browseProject.projectTable.locator('tr').count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('PJ-03 ✅ Verify search functionality with valid project name', async () => {
    await browseProject.searchProject('पोहरी');
    await expect(browseProject.projectTable).toContainText('पोहरी');
  });

  test('PJ-04 ✅ Verify navigation to Edit Project page', async () => {
    await browseProject.clickEditProject('पोहरी');
    await expect(browseProject.page.getByText('Project Details')).toBeVisible();
  });

  test('PJ-05 ✅ Verify navigation to Create Project page', async () => {
    await browseProject.clickAddProject();
    await expect(browseProject.page.getByText('Create Project')).toBeVisible();
  });

  /* Sorting skipped temporarily 
  test('PJ-06 ✅ Verify sorting functionality for Project column', async () => {
    await browseProject.verifyProjectSorting();
  });
  */

test('PJ-07 ✅ Verify filter functionality (State + District)', async () => {
  await browseProject.openFilters();

  // India is already selected by default
  await browseProject.selectState('Madhya Pradesh');
 // await browseProject.page.waitForTimeout(10000);
  await browseProject.selectDistrict('Shivpuri');
  await browseProject.search();

  await expect(browseProject.projectTable).toContainText('Shivpuri');
});

  test('PJ-08 ✅ Verify filter reset functionality', async () => {
    await browseProject.openFilters();
    
    await browseProject.selectState('Madhya Pradesh');
    await browseProject.selectDistrict('Shivpuri');

    await browseProject.resetFilters();
  });

  test('PJ-09 ✅ Verify search functionality with non-existent project', async () => {
    await browseProject.searchProject('XYZ12345');
    await expect(browseProject.projectTable).not.toContainText('XYZ12345');
  });

  test('PJ-10 ✅ Verify project is not deleted when delete is cancelled', async () => {
    await browseProject.cancelDeleteProject('पोहरी');
  });
});
