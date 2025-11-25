import { expect } from '@playwright/test';
import { test } from '../../fixtures';
//import BrowseQuestionPage from '../../page/QuestionPage/BrowseQuestionPage';
const BasePage = require('../../page/BasePage');
const BrowseQuestionPage = require('../../page/QuestionPage/BrowseQuestionPage').default;
const CreateQuestionPage = require('../../page/QuestionPage/CreateQuestionPage');


test.describe('Question Module', () => {
  let basePage;
  let createQuestionPage;
  let browseQuestionsPage;
  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    await page.waitForTimeout(5000);
    browseQuestionsPage = new BrowseQuestionPage(page);
    await browseQuestionsPage.navigateToBrowseQuestions();

  });

  test('TC01 -Verify Questions page interactions', async ({ page }) => {

    await browseQuestionsPage.interactWithQuestions();
    await browseQuestionsPage.applyAndResetFilters();
    await browseQuestionsPage.clickTableHeaders();
    await browseQuestionsPage.goBackToQuestions();
  });

  test('TC02 - Verify Browse Questions redirection', async ({ page }) => {
    await browseQuestionsPage.interactWithQuestions();
  });


  test('TC03- Verify pagination on Questions List', async ({ page }) => {
    await browseQuestionsPage.clickNextPagination();
    await browseQuestionsPage.clickPreviousPagination();
  });

  test('TC04- Verify Search by language ', async ({ page }) => {
    await browseQuestionsPage.searchByLang("Hindi");
  });

  test('TC05- Verify Question Filters modal & Reset', async ({ page }) => {
    await browseQuestionsPage.applyAndResetFilters();
  });

  test('TC06 - Verify navigation between Browse Questions and Create Question page', async ({ page }) => {
    await browseQuestionsPage.createQuestion();
    await browseQuestionsPage.navigateBack();
  });
  test('TC07- Verify table header sorting clicks', async ({ page }) => {
    await browseQuestionsPage.clickTableHeaders();
  });

  test('TC08- Verify navigation to default state of Browse question page ', async ({ page }) => {
    await browseQuestionsPage.goBackToQuestions();
  });

  //filter

  test("TC09 -Apply filter by Difficulty and Language", async ({ page }) => {
    // Apply Filters
    await browseQuestionsPage.openFilter();
    await browseQuestionsPage.selectDifficulty();
    await browseQuestionsPage.selectLanguage();
    await browseQuestionsPage.applyFilter();

  });

  test('TC10 - Search By Question title and expand question', async ({ page }) => {

    createQuestionPage = new CreateQuestionPage(page);
    await browseQuestionsPage.createQuestion();
    await createQuestionPage.fillQuestionDetails();
    await createQuestionPage.uploadMedia('white1.png');
    await createQuestionPage.enterQuestionAndOptions();
    await createQuestionPage.finishQuestionCreation();
    await browseQuestionsPage.searchByQuestionTitle('Automation test Question');
    await browseQuestionsPage.expandRow();

    await createQuestionPage.openDeleteModal();
    await createQuestionPage.confirmDelete();
  });

});