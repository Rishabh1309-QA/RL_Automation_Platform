const { expect } = require('@playwright/test');

class FilterDrawer {
  constructor(page) {
    this.page = page;
    
    // 🔹 Drawer Elements
    this.drawerTitle = page.getByRole('heading', { name: 'Filters' });
    this.closeButton = page.getByLabel('Close'); // Assuming the 'X' button is an accessible close button
    
    // 🔹 Filter Locators (Primary Filters)
    this.countryFilter = page.locator('div:has-text("Select Country")').getByRole('button'); // Targets the dropdown/input area
    this.stateFilter = page.locator('div:has-text("Select State")').getByRole('button');
    this.districtFilter = page.locator('div:has-text("Select Districts")').getByRole('button');
    
    // 🔹 Other Filter Locators
    this.productFilter = page.locator('div:has-text("Product")').getByRole('button');
    this.virtualNumberFilter = page.locator('div:has-text("Virtual Number")').getByRole('button');
    this.groupFilter = page.locator('div:has-text("Group")').getByRole('button');
    this.schoolFilter = page.locator('div:has-text("School")').getByRole('button');
    this.sectorFilter = page.locator('div:has-text("Sector")').getByRole('button');

    // Action buttons (if applicable)
    // Assuming filters apply on selection, but if there's a global 'Apply' button, it goes here.
  }

  // ---------------------------------
  // 🔹 Generic Actions
  // ---------------------------------
  
  async openDrawer(buttonLocator) {
    // This method is useful if the drawer is opened by different buttons on different pages
    await buttonLocator.click();
    await expect(this.drawerTitle).toBeVisible();
  }

  async closeDrawer() {
    await this.closeButton.click();
    // Optional: wait for the drawer to be hidden
  }

  // ---------------------------------
  // 🔹 Filter Interaction Methods
  // ---------------------------------

  /**
   * Selects an option from a filter dropdown (e.g., Country, State).
   * @param {Locator} filterLocator - The locator for the filter's input/dropdown area.
   * @param {string} optionName - The text of the option to select.
   */
  async selectOption(filterLocator, optionName) {
    await filterLocator.click();
    // Use an input locator if the dropdown is searchable, or directly click the text
    await this.page.getByText(optionName, { exact: true }).click();
  }

  /**
   * Selects a country from the filter dropdown.
   * @param {string} countryName - The name of the country to select.
   */
  async selectCountry(countryName) {
    await this.selectOption(this.countryFilter, countryName);
  }
  
  /**
   * Selects a state from the filter dropdown.
   * @param {string} stateName - The name of the state to select.
   */
  async selectState(stateName) {
    await this.selectOption(this.stateFilter, stateName);
  }

  /**
   * Selects a district from the filter dropdown.
   * @param {string} districtName - The name of the district to select.
   */
  async selectDistrict(districtName) {
    await this.selectOption(this.districtFilter, districtName);
  }

  // You can add more specific methods for other filters (Product, Group, etc.) as needed
}

module.exports = FilterDrawer;