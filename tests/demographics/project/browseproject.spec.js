import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseProjectPage = require('../../../page/DemographicsPage/ProjectPage/BrowseProjectPage');
const FilterDrawer = require('../../../page/components/FilterDrawer');

test.describe('📍 Browse Projects Section', () => {
  let basePage, browseProject, filterDrawer;

  test.beforeEach(async ({ page,login }) => {
    basePage = new BasePage(page);
    browseProject = new BrowseProjectPage(page);
    filterDrawer = new FilterDrawer(page);

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
    await browseProject.searchProject('पोहरी'); // example project name
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

 /* test('PJ-06 ✅ Verify sorting functionality for Project column', async () => {
    await browseProject.verifyProjectSorting();
  });*/

  test('PJ-07 ✅ Verify filter functionality (Country, State, District)', async () => {
    await filterDrawer.open();
    await filterDrawer.selectCountry('India');
    await filterDrawer.selectState('Punjab');
    await filterDrawer.selectDistrict('Shivpuri');
    await filterDrawer.search();

    await expect(browseProject.projectTable).toContainText('Shivpuri');
  });

  test('PJ-08 ✅ Verify filter reset functionality', async () => {
    await filterDrawer.open();
    await filterDrawer.selectCountry('India');
    await filterDrawer.selectState('Punjab');
    await filterDrawer.selectDistrict('Shivpuri');
    await filterDrawer.reset();
  });

  test('PJ-09 ✅ Verify search functionality with non-existent project', async () => {
    await browseProject.searchProject('XYZ12345');
    await expect(browseProject.projectTable).not.toContainText('XYZ12345');
  });

  test('PJ-10 ✅ Verify project is not deleted when delete is cancelled', async () => {
    await browseProject.cancelDeleteProject('पोहरी');
  });
});
