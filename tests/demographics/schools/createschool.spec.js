import { expect } from '@playwright/test';
import { test } from '../../../fixtures';

// Page Object Imports
const BasePage = require('../../../page/BasePage');
const BrowseSchoolPage = require('../../../page/DemographicsPage/SchoolsPage/BrowseSchoolPage');
const CreateSchoolPage = require('../../../page/DemographicsPage/SchoolsPage/CreateSchoolPage');

// Test Data Constants
const SCHOOL_NAME_PREFIX = 'TestSchool_';
const UDISE_CODE_PREFIX = '9999';

test.describe('📌 Create School Section', () => {
    let basePage, browseSchoolPage, createPage;

    test.beforeEach(async ({ page, login }) => {
        basePage = new BasePage(page);
        browseSchoolPage = new BrowseSchoolPage(page);
        createPage = new CreateSchoolPage(page);

        await basePage.goToCreateSchool();
        await createPage.verifyPageLoaded();
    });

    // ✅ SC-01: Create new School successfully
    test('SC-01 ✅ Verify a new School can be successfully created', async () => {
        test.setTimeout(60000);

        const uniqueId = new Date().getTime().toString().slice(-6);
        const schoolName = `${SCHOOL_NAME_PREFIX}${uniqueId}`;
        const udiseCode = `${UDISE_CODE_PREFIX}${uniqueId}`;

        const schoolType = 'PS';
        const districtName = 'Adilabad';

        await createPage.form.fillForm({
            name: schoolName,
            code: udiseCode,
            type: schoolType,
            district: districtName
        });

        await createPage.form.create();
    });

    // ✅ SC-02: Reset button clears all fields
    test('SC-02 ✅ Verify Reset button clears all input fields', async () => {
        await createPage.form.fillForm({
            name: 'ResetCheckSchool',
            code: '900000001',
            district: 'Adilabad'
        });

        await createPage.form.reset();

        await expect(createPage.form.schoolName).toHaveValue('');
        await expect(createPage.form.udiseCode).toHaveValue('');
    });

    // ✅ SC-03: Back button navigation
    test('SC-03 ✅ Verify Back button returns to Browse Schools page', async () => {
        await createPage.form.back();
        await expect(browseSchoolPage.pageHeader).toBeVisible({ timeout: 10000 });
    });

    // ❌ SC-04: Duplicate UDISE Code validation
    test('SC-04 ❌ Verify creation fails with duplicate UDISE Code', async () => {
        const existingUdiseCode = '9999999991';

        await createPage.form.fillForm({
            name: 'New School Attempt',
            code: existingUdiseCode,
            type: 'PS',
            district: 'Adilabad'
        });

        await createPage.form.create();

        await expect(
            createPage.page.getByText(/This UDISE Code already exists./i)
        ).toBeVisible({ timeout: 10000 });
    });

    // ❌ SC-05: Required fields validation
    test('SC-05 ❌ Verify creation fails when required fields are empty', async () => {
        await createPage.form.fillForm({
            name: '',
            code: '',
            type: ''
        });

        await createPage.form.create();

        await expect(
            createPage.page.getByText(/School name is required./i)
        ).toBeVisible({ timeout: 10000 });
    });

    // ❌ SC-06: Invalid data validation
    test('SC-06 ❌ Verify creation fails with invalid data formats', async () => {
        await createPage.form.fillForm({
            name: 'Invalid$$Name',
            code: '12345',
            district: 'Adilabad'
        });

        await createPage.form.create();

        await expect(
            createPage.page.getByText(
                'UDISE Code must be of 10 or 11 digits and contain numbers only.'
            )
        ).toBeVisible({ timeout: 10000 });
    });

    test.afterEach(async () => {
        // Optional cleanup
    });
});
