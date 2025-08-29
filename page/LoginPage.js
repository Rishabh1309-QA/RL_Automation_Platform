const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByText('These credentials do not match our records.', { exact: true });
    this.validationMessage = (text) => page.getByText(text, { exact: true });

    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Your Password?' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.sendPasswordResetLink = page.locator("//button[@type='submit']");
    this.alertMessage = page.getByText('We have emailed your password reset link.', { exact: true });
    this.errorAlert = page.getByText("We can't find a user with that email address.", { exact: true });
  }

  async goto() {
    await this.page.goto('https://v2.dev.lilyogis.in/login', { waitUntil: 'domcontentloaded' });
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertErrorText(expectedText) {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    await expect(this.errorMessage).toHaveText(expectedText);
  }

  async assertValidationText(expectedText) {
    await expect(this.validationMessage(expectedText)).toBeVisible({ timeout: 5000 });
  }

async clickForgotPassword() {
  await this.forgotPasswordLink.waitFor({ state: 'visible', timeout: 5000 });
  await this.forgotPasswordLink.click();
}

async fillForgotEmail(email) {
  await this.emailInput.waitFor({ state: 'visible', timeout: 5000 });
  await this.emailInput.click();
  await this.emailInput.fill(email);
}

async clickSendReset() {
  await this.sendPasswordResetLink.waitFor({ state: 'visible', timeout: 5000 });
  await this.sendPasswordResetLink.click();
}

async verifyPasswordResetMessage() {
  const messageLocator = this.page.locator("text=We have emailed your password reset link");
  await expect(messageLocator).toBeVisible({ timeout: 10000 });
}

 async verifyErrorAlert() {
  const errorLocator = this.page.locator("text=We can't find a user with that email address."); // adjust selector
  await expect(errorLocator).toBeVisible({ timeout: 10000 }); // wait for visibility
// await expect(errorLocator).toHaveText(
  //  "We can't find a user with that email address.",
    //{ timeout: 10000 } // wait until text matches
  
}


}

module.exports = LoginPage;
