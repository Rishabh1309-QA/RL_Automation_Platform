class BasePage {
  constructor(page) {
    this.page = page;
    this.userMenuButton = page.locator('summary').filter({ hasText: 'Users' }); // adjust name
  }

  async openUserMenu() {
    await this.userMenuButton.click();
  }
}

module.exports = BasePage;
