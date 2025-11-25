class UsersPage {
  constructor(page) {
    this.page = page;
    this.page.locator('summary').filter({ hasText: 'Users' });
    this.browseUsersLink = page.getByRole('link', { name: 'Browse User' });
    this.inviteUsersLink = page.getByRole('link', { name: 'Invite' });
    this.rolesLink = page.getByRole('link', { name: 'Roles' });
    this.permissionsLink = page.getByRole('link', { name: 'Permissions' });
  }

  async gotoBrowseUsers() {
    await this.usersMenu.click();
    await this.browseUsersLink.click();
  }
}

module.exports = UsersPage;
