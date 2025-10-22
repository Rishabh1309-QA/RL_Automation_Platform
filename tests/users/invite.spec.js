// tests/invite.spec.js
import { expect } from '@playwright/test';
import { test } from '../../fixtures.js';
import BasePage from '../../page/BasePage.js';
import InvitePage from '../../page/UsersPage/InvitePage.js';

test.describe('📩 Invite Management', () => {

    test('✅ Verify Invite page header is visible', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);

        await invitePage.navigateToInvitePage(basePage);
        await expect(invitePage.invitePageHeader).toBeVisible();
    });

    test('✅ Positive: Invite user with valid details and then delete', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);

        await invitePage.navigateToInvitePage(basePage);

        const uniqueEmail = `testUser${Date.now()}@rocketlearning.org`;
        console.log(`Creating and deleting user with email: ${uniqueEmail}`);

        await invitePage.fillEmail(uniqueEmail);
        await invitePage.selectRole('ContentAdmin');
        await invitePage.clickSendInvitation();

        await invitePage.verifyInviteVisible(uniqueEmail);
        console.log(`Verified invite for ${uniqueEmail} is visible.`);

        await invitePage.clickDelete(uniqueEmail);
        console.log(`Clicked delete for ${uniqueEmail}`);

        await invitePage.verifyInviteNotVisible(uniqueEmail);
    });

    test('✅ Positive: Invite user with role and state', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);

        await invitePage.navigateToInvitePage(basePage);
        const autoEmail = `testData${Date.now()}@rocketlearning.org`;;

        await invitePage.fillEmail(autoEmail);
        await invitePage.selectRole('ContentAdmin');
        await invitePage.selectState('Bihar');
        await invitePage.clickSendInvitation();
        await invitePage.verifyInviteVisible(autoEmail);
    });

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
        const email = `test${Date.now()}@rocketlearning.org`;

        await invitePage.fillEmail(email);
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

    test('🔍 Search for invited user in pending list', async ({ page, login }) => {
        const basePage = new BasePage(page);
        const invitePage = new InvitePage(page);

        await invitePage.navigateToInvitePage(basePage);
        const email = `testUser${Date.now()}@rocketlearning.org`;

        await invitePage.fillEmail(email);
        await invitePage.selectRole('ContentAdmin');
        await invitePage.clickSendInvitation();

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
