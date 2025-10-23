const { expect } = require('@playwright/test');

class DistrictForm {
  constructor(page) {
    this.page = page;

    // --- FIELDS ---
    this.districtName = page.getByRole('textbox', { name: 'District Name *' });
    this.countryTextbox = page.getByRole('textbox', { name: 'Select Country *' });
    this.stateTextbox = page.getByRole('textbox', { name: 'Select State *' });

    // --- BUTTONS ---
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.updateButton = page.getByRole('button', { name: 'Update' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async selectDropdownOption(field, optionText) {
    await field.click();
    await this.page.getByText(optionText, { exact: false }).first().click();
    await field.press('Escape'); 
  }


async fillForm({ name, country, state }) {
    if (name !== undefined) await this.districtName.fill(name);

    if (country !== undefined) {
        
        await this.countryTextbox.fill(country);

        const countrySuggestion = this.page.getByText(`${country} (IND)`, { exact: true });

        await countrySuggestion.click();
    }
    
    if (state !== undefined) {
  
        await this.stateTextbox.waitFor({ state: 'visible', timeout: 15000 });
        
        
        await this.stateTextbox.fill(state);
        
       
        const stateSuggestion = this.page.getByText(state, { exact: true });
        await stateSuggestion.click();
    }
}

  async create() {
    await this.createButton.click();
  }

  async save() {
    await this.updateButton.click();
  }

  async reset() {
    await this.resetButton.click();
  }

  async back() {
    await this.backButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

async expectPrepopulatedValues({ name, country, state }) {

  if (name) await expect(this.districtName).toHaveValue(name);
  

  if (country) {
    const visibleCountry = this.page
      
      .getByText(country, { exact: false }) 
      .first();
    
    await expect(visibleCountry).toBeVisible();
  }

 
  if (state) {
    const visibleState = this.page
      .getByText(state, { exact: false }) 
      .first();
    await expect(visibleState).toBeVisible();
  }



  
  if (state) {
    const visibleState = this.page
      .getByText(state, { exact: false }) 
      .first();
    
    await expect(visibleState).toBeVisible(); 
  }
}

  async expectEmpty() {
    await expect(this.districtName).toHaveValue('');
  }
}

module.exports = DistrictForm;
