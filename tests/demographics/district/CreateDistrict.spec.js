import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseDistrictPage = require('../../../page/DemographicsPage/DistrictPage/BrowseDistrictPage');
const CreateDistrictPage = require('../../../page/DemographicsPage/DistrictPage/CreateDistrictPage');

test.describe('➕ Create District Section', () => {
  let basePage, browsePage, createPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browsePage = new BrowseDistrictPage(page);
    createPage = new CreateDistrictPage(page);
    await basePage.goToCreateDistrict();
  });

  test('CD-01 ✅ Create new district successfully', async () => {
   await createPage.form.fillForm({
        name: 'New Test District', 
        country: 'India', 
        state: 'Rajasthan (RJ)' // Example state, use your actual test data
    });

    await createPage.form.create();
    

    //await createPage.form.fillForm({ name, country: 'India', state: 'Punjab' });
    //await createPage.form.create();

    // verify appears
    await expect(browsePage.districtRow( 'New Test District')).toBeVisible();

    // cleanup
    await browsePage.deleteDistrict('New Test District');
  });

  test('CD-02 ✅ Reset clears inputs', async () => {
    await createPage.form.fillForm({ name: 'Temp', country: 'India', state: 'Rajasthan (RJ)' });
    await createPage.form.reset();
    await createPage.form.expectEmpty();
  });

  test('CD-03 ✅ Back returns to browse', async () => {
    await createPage.form.back();
    await expect(browsePage.pageHeader).toBeVisible();
  });

  test('CD-04 ❌ Creation fails with duplicate district in same state', async () => {
    // assuming 'Test Punjabi' exists in Punjab already
    await createPage.form.fillForm({ name: 'Test Punjabi', country: 'India', state: 'Punjab (PB)' });
    await createPage.form.create();
    await expect(createPage.page.getByText('The district name has already been taken.')).toBeVisible();
  });

  test('CD-05 ❌ Creation fails with empty required field', async () => {
    await createPage.form.fillForm({});
    await createPage.form.create();
    // expect invalid inputs - presence of invalid inputs or validation message
    await expect(createPage.page.locator('input:invalid')).toHaveCount(2);
  });

  test('CD-06 ❌ Creation fails with invalid data', async () => {
    await createPage.form.fillForm({ name: '123@###', country: 'India', state: 'Punjab (PB)' });
    await createPage.form.create();
     await expect(createPage.page.getByText('The district name field format is invalid.')).toBeVisible();
  //await expect(createPage.page.getByText('The country code field must be 3 characters.')).toBeVisible();
 // await expect(createPage.page.getByText('The country code field must be uppercase.')).toBeVisible();
  });

test('CD-07 ✅ Dependent dropdowns: country -> state', async ({ page }) => {
    await createPage.form.fillForm({ country: 'India' });
    
    const stateFieldLocator = page.getByRole('textbox', { name: 'Select State *' });
    await stateFieldLocator.click();
    
    // The locator that resolves to 4 elements (Maharashtra, Haryana x2, Punjab)
    const stateOptionsLocator = page.getByText(/Maharashtra.*|Punjab.*|Haryana.*/);

    // FIX: Apply .first() to the locator to bypass strict mode violation, 
    // asserting that at least one of the desired options is visible.
    await expect(stateOptionsLocator.first()).toBeVisible(); 
});
});
