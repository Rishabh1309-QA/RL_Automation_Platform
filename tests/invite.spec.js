// tests/invite.spec.js
import { expect } from '@playwright/test';
import { test } from '../fixtures.js';
import BasePage from '../page/BasePage.js';
import InvitePage from '../page/InvitePage.js';

test.describe('📩 Invite Management', () => {

    test('✅ Verify Invite page header is visible', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);

        await invitePage.navigateToInvitePage(basePage);
        await expect(invitePage.invitePageHeader).toBeVisible();
    });

    // --- Positive Test Cases ---
    test('✅ Positive: Invite user with valid details', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);

        await invitePage.navigateToInvitePage(basePage);
        const email = `testUser@rocketlearning.org`;
        await invitePage.fillEmail(email);
        await invitePage.selectRole('ContentAdmin');
        await invitePage.clickSendInvitation();
        await invitePage.verifyInviteVisible(email);
    });

    test('✅ Positive: Invite user with role and state', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);
        
        await invitePage.navigateToInvitePage(basePage);
        const email = 'testUser@rocketlearning.org';
        await invitePage.fillEmail(email);
        await invitePage.selectRole('ContentAdmin');
        await invitePage.selectState('Bihar');
        await invitePage.clickSendInvitation();
        await invitePage.verifyInviteVisible(email);
    });

    // --- Negative Test Cases ---
    test('❌ Negative: Show error when email is missing', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);

        await invitePage.navigateToInvitePage(basePage);
        await invitePage.fillEmail('');
    
        await invitePage.clickSendInvitation();
        await invitePage.verifyErrorMessage('The email field is required.');
    });

    test('❌ Negative: Show error when role is missing', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);

        await invitePage.navigateToInvitePage(basePage);
        const email = `test123@rocketlearning.org`;
        await invitePage.fillEmail(email);
        // Corrected: Removed selectRole method call
        await invitePage.clickSendInvitation();
        await invitePage.verifyErrorMessage('The role field is required.');
    });

    test('❌ Negative: Show error when email is invalid', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);

        await invitePage.navigateToInvitePage(basePage);
        await invitePage.fillEmail('invalidEmail');
        await invitePage.selectRole('ContentAdmin');
        await invitePage.clickSendInvitation();
        await invitePage.verifyErrorMessage('The email field must be a valid email address.');
    });

    // --- Functional Test Cases ---
    test('🔍 Search for invited user in pending list', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);

        await invitePage.navigateToInvitePage(basePage);
        const email = `testRishav@rocketlearning.org`;
        // First, invite a user to have someone to search for
        await invitePage.fillEmail(email);
        await invitePage.selectRole('ContentAdmin');
        await invitePage.clickSendInvitation();

        // Now, search for them
        await invitePage.searchForPendingInvite(email);
        await invitePage.verifyInviteVisible(email);
    });

    test('♻️ Reset button clears form fields', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);

        await invitePage.navigateToInvitePage(basePage);
        await invitePage.fillEmail('testuser@rocketlearning.org');
        await invitePage.selectRole('PlatformAdmin');
        await invitePage.clickReset();
        await invitePage.verifyInputIsEmpty(invitePage.emailInput);
    });
});