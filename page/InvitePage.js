// page/InvitePage.js
import { expect } from '@playwright/test';

export default class InvitePage {
    constructor(page) {
        this.page = page;
        this.invitePageHeader = page.getByText('Invite a user');
        this.emailInput = page.getByRole('textbox', { name: 'Email address *' });
        this.roleDropdown = page.getByText('Choose Role *');
        this.stateDropdown = page.getByText('Select State');
        this.districtInput = page.getByText('Select District');
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.sendButton = page.getByRole('button', { name: 'Send Invitation' });
        this.pendingSearch = page.getByRole('textbox', { name: 'Search...' });
    }

    // --- Navigation Methods ---
    async navigateToInvitePage(basePage) {
        await basePage.openUserMenu();
        await this.page.getByRole('link', { name: 'Invite' }).click();
        await expect(this.invitePageHeader).toBeVisible();
    }

    // --- Action Methods ---
    async fillEmail(email) {
        await this.emailInput.fill(email);
    }

    async selectRole(roleName) {
        await this.roleDropdown.click();
        const option = this.page.locator(`text=${roleName}`);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }

    async selectState(stateName) {
        await this.stateDropdown.click();
        const option = this.page.locator(`text=${stateName}`);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click();
    }
    
    async fillDistrict(districtName) {
        await this.districtInput.fill(districtName);
    }

    async clickSendInvitation() {
        await this.sendButton.click();
    }

    async clickReset() {
        await this.resetButton.click();
    }

    async searchForPendingInvite(email) {
        await this.pendingSearch.fill(email);
    }
    
    // --- Assertion Methods ---
    async verifyInviteVisible(email) {
        const row = this.page.locator(`tr:has-text("${email}")`);
        await expect(row).toBeVisible();
    }

    async verifyErrorMessage(message) {
        await expect(this.page.locator(`text=${message}`)).toBeVisible();
    }

    async verifyInputIsEmpty(inputLocator) {
        await expect(inputLocator).toHaveValue('');
    }
}