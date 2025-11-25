import { expect } from '@playwright/test';
import { test } from '../../fixtures';

const BasePage = require('../../page/BasePage');
const CreateQuestionPage = require('../../page/QuestionPage/CreateQuestionPage');
const EditQuestionPage = require('../../page/QuestionPage/EditQuestionPage');
//

test.describe('Edit Question Module', () => {
  let basePage;
let createQuestionPage;
 let editQuestionPage;
  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
  createQuestionPage = new CreateQuestionPage(page);
  await createQuestionPage.goToCreateQuestion();
   await createQuestionPage.fillQuestionDetails();
  await createQuestionPage.uploadMedia('white1.png');
  await createQuestionPage.enterQuestionAndOptions();
  await createQuestionPage.finishQuestionCreation();
   editQuestionPage = new EditQuestionPage(page);
   await editQuestionPage.openEditScreen();
  });
test('TC14 - Edit question Title successfully', async ({ page }) => {
  await editQuestionPage.editTitle('Automation test Question updated');
  await editQuestionPage.clickNext();
  await editQuestionPage.finishAndVerify();
 
});


test('TC15 - Edit question Difficulty successfully', async ({ page }) => {
  await editQuestionPage.editTitle('Automation test Question updated');
 
  await editQuestionPage.changeDifficulty();
  await editQuestionPage.finishAndVerify();
 
});

test('TC16 - Upload, Preview and Delete media in Edit Question screen', async ({ page }) => {
  await editQuestionPage.editTitle('Automation test Question updated');
  await editQuestionPage.clickNext();
  
  // Upload file
  await editQuestionPage.uploadMediaForQuestion('white1.png');

  // Preview media
  const previewPage = await editQuestionPage.openMediaPreview();
  expect(previewPage).not.toBeNull();

  // Delete the file
  await editQuestionPage.deleteMedia();

  // Verify success message
  await expect(editQuestionPage.deleteMediaToast).toBeVisible();
await editQuestionPage.clickBack();
  
});

test('TC17 - Verify language field is not editable in Edit Question screen', async ({ page }) => {
   await editQuestionPage.editTitle('Automation test Question updated');
  await editQuestionPage.clickNext(); 
  await editQuestionPage.verifyLanguageIsNotEditable();

});

test('TC18 - Add new option in Edit Question screen', async ({ page }) => {
   await editQuestionPage.editTitle('Automation test Question updated');
  await editQuestionPage.clickNext(); 
    await editQuestionPage.expandLanguageSection();
    await editQuestionPage.openOptionsTab();
    await editQuestionPage.addNewOption();
    await editQuestionPage.enterOption4('option 4');
  
    await editQuestionPage.finishAndVerify();
});

  
test.afterEach(async ({ page }) => {
  await editQuestionPage.openDeleteModal();
  await editQuestionPage.confirmDelete();
});
});