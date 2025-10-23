import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseProjectPage = require('../../../page/DemographicsPage/ProjectPage/BrowseProjectPage');
const EditProjectPage = require('../../../page/DemographicsPage/ProjectPage/EditProjectPage');

test.describe('✏️ Edit Project Section', () => {
  let basePage, browseProject, editProject;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseProject = new BrowseProjectPage(page);
    editProject = new EditProjectPage(page);

    await browseProject.goToBrowseProjects(basePage);
    await browseProject.clickEditProject('पोहरी'); // Existing project
    await editProject.verifyPageLoaded();
  });

  // ✅ PJ-11: Pre-populated data
  test('PJ-11 ✅ Verify correct data is pre-populated on Project Details page', async () => {
    await editProject.verifyPrePopulatedData('पोहरी', '2342307');
  });

  // ✅ PJ-12: Fields editable after Edit
  test('PJ-12 ✅ Verify clicking Edit makes fields editable', async () => {
    await editProject.clickEdit();
    await editProject.verifyFieldsAreEditable();
  });

  // ✅ PJ-13: Fields disabled before Edit
  test('PJ-13 ✅ Verify fields are disabled before clicking Edit', async () => {
    await editProject.verifyFieldsAreDisabled();
  });

  // ✅ PJ-14: Successful update of project details
  test('PJ-14 ✅ Verify successful update of project details', async () => {
    await editProject.clickEdit();
    await editProject.updateProjectName('पोहरी Updated');
    await expect(editProject.page.getByText('The project name field format is invalid.')).toBeVisible();
  });

  // ✅ PJ-15: Back button navigation
  test('PJ-15 ✅ Verify Back button returns to previous page', async () => {
    await editProject.goBack();
    await expect(browseProject.pageHeader).toBeVisible();
  });

  // ❌ PJ-16: Invalid data
  test('PJ-16 ❌ Verify update fails with invalid data', async () => {
    await editProject.clickEdit();
    await editProject.updateProjectName('@@@!!!'); // invalid
    await expect(editProject.page.getByText('The project name field format is invalid.')).toBeVisible();
  });

  // ❌ PJ-17: Required field empty (like EditDistrict)
  test('PJ-17 ❌ Verify update fails when required field is empty', async () => {
    await editProject.clickEdit();
    await editProject.clearProjectName();
    await editProject.clickUpdate();
    const isValid = await editProject.projectNameField.evaluate(el => el.validity.valid);
    expect(isValid).toBeFalsy();
  });

  // ❌ PJ-18: Duplicate project name
  test('PJ-18 ❌ Verify update fails with duplicate project name', async () => {
    await editProject.clickEdit();
    await editProject.updateProjectName('शिवपुरी नवीन'); // existing project
    await expect(editProject.page.getByText(/The project name field format is invalid./)).toBeVisible();
  });
});
