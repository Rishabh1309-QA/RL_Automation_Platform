class LogoutPage {
  constructor(page) {
    this.page = page;
    this.profileMenu =  page.locator('//button[@class="btn normal-case btn btn-circle btn-outline"]');
    this.logoutButton = page.locator('//html/body/div[1]/div/div[2]/details/ul/div/li[2]/a');
  }

  
  async logout() {
    await this.profileMenu.click();
    await this.logoutButton.click();
  }
}

module.exports = LogoutPage;