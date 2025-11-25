import { expect } from '@playwright/test';
import { test } from '../../fixtures';
const BasePage = require('../../page/BasePage');
import CreateQuestionPage from '../../page/QuestionPage/CreateQuestionPage';


test.describe('Create Question Module', () => {
  let basePage;
  let createQuestionPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    createQuestionPage = new CreateQuestionPage(page);
    await createQuestionPage.goToCreateQuestion();
  });

  test('TC11 - Create and Delete question successfully', async ({ page }) => {
    await createQuestionPage.fillQuestionDetails();
    await createQuestionPage.uploadMedia('white1.png');
    await createQuestionPage.enterQuestionAndOptions();
    await createQuestionPage.finishQuestionCreation();
    // Verify saved toast
    await createQuestionPage.verifySaveSuccess();

    // Delete the question
    await createQuestionPage.openDeleteModal();
    await createQuestionPage.confirmDelete();

    // Verify deletion
    await createQuestionPage.verifyDeleteSuccess();
  });

  test('TC12 - Verify Title is required validation', async ({ page }) => {
    await createQuestionPage.titleEmptyAndClickNext();
    await createQuestionPage.verifyTitleIsRequired();
  });

  test("TC13 - Verify user can add more languages", async ({ page }) => {
    await createQuestionPage.clickNext();
    await createQuestionPage.clickAddMoreLanguage();
    await createQuestionPage.verifyLanguage2Visible();
  });
});