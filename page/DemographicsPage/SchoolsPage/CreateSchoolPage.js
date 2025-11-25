const { expect } = require('@playwright/test');

/**
 * Page Object Model for the Create School page.
 */
class CreateSchoolPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // Header
        this.pageHeader = page.locator('//*[@id="create-school"]/div/div[1]/div');

        // --- Form Fields ---
        this.schoolName = page.getByRole('textbox', { name: 'Name *' });
        this.udiseCode = page.getByPlaceholder('Enter school UDISE Code ');
        this.chooseType = page.locator('//*[@id="mary3c79903fcbc32ce83d16a3d57a8965a3type"]');
        this.selectDistrict = page.getByLabel('Select District *');
        this.selectBeatSector = page.getByLabel('Select Beat/Sector');
        this.activeToggle = page.getByText('Active').locator('input[type="checkbox"]');

        // --- Buttons ---
        this.createButton = page.getByRole('button', { name: 'Create' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.backButton = page.getByRole('button', { name: 'Back' });
    }

    async verifyPageLoaded() {
        await expect(this.pageHeader).toBeVisible({ timeout: 10000 });
    }

    // --- Individual Field Actions ---

    async enterSchoolName(name) {
        await this.schoolName.fill(name);
    }

    async enterUdiseCode(code) {
        await this.udiseCode.fill(code);
    }

    async selectType(type) {
        await this.chooseType.selectOption(type);
    }

    /**
     * Selects the District using type-and-select logic.
     */
    async setDistrict(district) {
        console.log(`🗺️ Selecting District: ${district}`);

        await this.selectDistrict.click();
        await this.selectDistrict.fill(district);

        const option = this.page.getByText(district, { exact: true });
        await expect(option).toBeVisible({ timeout: 15000 });
        await option.click();
    }

    /**
     * Selects the Beat/Sector using type-and-select logic.
     */
    async setBeatSector(beatSector) {
        console.log(`📍 Selecting Beat/Sector: ${beatSector}`);

        await this.selectBeatSector.click();
        await this.selectBeatSector.fill(beatSector);

        const option = this.page.getByText(beatSector, { exact: true });
        await expect(option).toBeVisible({ timeout: 15000 });
        await option.click();

        await this.page.press('Escape');
    }

    async setActivityStatus(active) {
        if (active) {
            await this.activeToggle.check();
        } else {
            await this.activeToggle.uncheck();
        }
    }

    // --- Form Wrapper ---

    get form() {
        return {
            /**
             * Fills the Create School form.
             */
            fillForm: async (data) => {
                if (data.name !== undefined) await this.enterSchoolName(data.name);
                if (data.code !== undefined) await this.enterUdiseCode(data.code);
                if (data.type !== undefined) await this.selectType(data.type);
                if (data.district !== undefined) await this.setDistrict(data.district);
                if (data.beatSector !== undefined) await this.setBeatSector(data.beatSector);
                if (data.active !== undefined) await this.setActivityStatus(data.active);
            },

            create: async () => {
                await this.createButton.click();
            },

            reset: async () => {
                await this.resetButton.click();
            },

            back: async () => {
                await this.backButton.click();
            },

            schoolName: this.schoolName,
            udiseCode: this.udiseCode,
        };
    }
}

module.exports = CreateSchoolPage;
