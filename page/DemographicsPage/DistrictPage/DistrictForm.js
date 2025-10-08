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

  // 🔹 Generic method to select dropdown option and close with ESC
  async selectDropdownOption(field, optionText) {
    await field.click();
    await this.page.getByText(optionText, { exact: false }).first().click();
    await field.press('Escape'); // Close dropdown safely
  }

  // 🔹 Fill form with ESC close (as per your recorder)
 // C:\Users\Rl_Automation\page\DemographicsPage\DistrictPage\DistrictForm.js

async fillForm({ name, country, state }) {
    if (name !== undefined) await this.districtName.fill(name);

    if (country !== undefined) {
        // Step 1: Fill the country textbox
        await this.countryTextbox.fill(country);
        
        // Assuming the suggested value appears immediately below the input.
        // Step 2: Wait for and click the suggestion based on the text (e.g., 'India (IND)')
        const countrySuggestion = this.page.getByText(`${country} (IND)`, { exact: true });
        
        // Wait for the suggestion to be visible and then click it.
        // This confirms the value and triggers the loading of the State field.
        await countrySuggestion.click();
    }
    
    if (state !== undefined) {
        // Step 3: Wait for the State Textbox to be available/visible before filling
        await this.stateTextbox.waitFor({ state: 'visible', timeout: 15000 });
        
        // Step 4: Fill the state textbox (similar select process as country, if needed)
        await this.stateTextbox.fill(state);
        
        // Step 5: Wait for and click the state suggestion (assuming the suggestion text is just the state name)
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

  // 🔹 Verify pre-populated data robustly
 // 🔹 Verify pre-populated data robustly
async expectPrepopulatedValues({ name, country, state }) {
  // 1. District Name: Standard text input check
  if (name) await expect(this.districtName).toHaveValue(name);
  
  // 2. Country: Check for the visible text element (e.g., 'India (IND)' within a wrapper)
  if (country) {
    const visibleCountry = this.page
      // Use getByText with partial match to find the visible value (e.g., 'India (IND) Search')
      .getByText(country, { exact: false }) 
      .first();
    // A simple visible check is sufficient
    await expect(visibleCountry).toBeVisible();
  }

  // 3. State: Check for the visible text element
  if (state) {
    const visibleState = this.page
      .getByText(state, { exact: false }) 
      .first();
    await expect(visibleState).toBeVisible();
  }



  // 3. Verify State value by checking for the visible text element.
  if (state) {
    const visibleState = this.page
      .getByText(state, { exact: false }) // Use the text, allow partial match
      .first();
    // Use .toBeVisible() to confirm the pre-populated value is displayed.
    await expect(visibleState).toBeVisible(); 
  }
}

  async expectEmpty() {
    await expect(this.districtName).toHaveValue('');
  }
}

module.exports = DistrictForm;
