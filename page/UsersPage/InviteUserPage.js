

class InviteUserPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByText('Invite a user');
  }

    async getHeaderText() {
    return await this.title.textContent();
  }

}
module.exports = InviteUserPage;
