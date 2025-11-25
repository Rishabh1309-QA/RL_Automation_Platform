import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import BasePage from '../../page/BasePage';
import CreateActivityPage from '../../page/ActivityPage/CreateActivityPage';


test.describe('🎯 Create Activity Section', () => {
  let basePage, createActivityPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    createActivityPage = new CreateActivityPage(page);
    await createActivityPage.navigateToCreateActivity();  
   
  });

  test('✅ Verify user can create a new Activity', async () => {
  //const createActivityPage = new CreateActivityPage(page);

  // Navigate to Create Activity
  //await createActivityPage.navigateToCreateActivity();

  // Step 1: Basic Info
  await createActivityPage.fillBasicInfo('Activity 29/09', 'description');

  // Step 2: Learning Outcomes
//  await createActivityPage.fillLearningOutcomes();

  // Step 3: Vernacular
  await createActivityPage.fillVernacular('vernacularTitle', 'white1.png');

  // Step 4: Final Metadata
  await createActivityPage.fillFinalMetadata();

  // ✅ Final assertion (e.g., success toast, redirect, or activity visible in list)
  await expect(page.getByText('Activity created successfully')).toBeVisible();

  });
});
