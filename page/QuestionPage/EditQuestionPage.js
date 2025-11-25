import { expect } from '@playwright/test';
import path from 'path';

class EditQuestionPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.browseQuestions = page.getByRole('link', { name: 'Browse Questions' });
    this.select7thRow = page.locator("//tr[td[normalize-space()='Automation test Question']]//a[@data-tip='Edit']").first();

    this.nextBtn = page.getByRole('button', { name: 'Next' });
    this.prevBtn = page.getByRole('button', { name: 'Previous' });
    this.editBtn = page.getByRole('button', { name: 'Edit' });

    this.titleInput = page.getByRole('textbox', { name: 'Title *' });

    this.difficultyDropdown = page.getByText('Difficult Select difficulty');
    this.veryDifficult = page.getByText('Very Difficult');

   //Add more languges
   this.addMoreLanguageBtn = page.getByRole('button').filter({ hasText: 'Add more language' });
   this.languageCollapse = page.locator('.collapse-title', { hasText: 'Language:' });
//page.locator("//div[@class='flex items-center' and normalize-space()='Language:']");

   this.langDropdown = page.locator('#lang-1');
 this.finishBtn = page.getByRole('button', { name: 'Finish' });
        this.editBtn = page.getByRole('button', { name: 'Edit' });
        this.nextBtn = page.getByRole('button', { name: 'Next' });

        this.assameseLangLabel = page.getByText('Language: Assamese (অসমীয়া)');
        this.removeLanguageCheckbox = page.getByRole('checkbox', { name: 'Remove Language' });

        // Options
        this.optionsTab = page.getByRole('tab', { name: 'Options' }).nth(1);
        this.option1 = page.locator('[id="questiondivid-1\\.0"]').getByRole('textbox', { name: 'Enter option' });
        this.option2 = page.locator('[id="questiondivid-1\\.1"]').getByRole('textbox', { name: 'Enter option' });
        this.option3 = page.locator('[id="questiondivid-1\\.2"]').getByRole('textbox', { name: 'Enter option' });
        this.correctAnswerCheckbox = page.locator('[id="questiondivid-1\\.0"]').getByRole('checkbox', { name: 'Correct Answer' });
    
    this.updatedToast = page.getByText('Question details updated');
    this.backBtn = page.locator('//*[@id="question-details"]/div/div[2]/button[2]/span[2]');
 
  this.uploadMediaInput = page.getByRole('textbox', { name: 'Upload image/video' });
    this.previewLink = page.getByRole('link', { name: 'Preview' });
    this.deleteMediaBtn = page.locator('#qMediaDelete-0');
    this.confirmDeleteDialog = page.getByRole('main').getByRole('dialog');
    this.deleteConfirmBtn = this.confirmDeleteDialog.getByRole('button', { name: 'Delete' });

    // TOASTS
    this.deleteMediaToast = page.getByText('File removed successfully.');
 
 
    //delete locators
    this.deleteBtn = page.locator(
      `tr:has(td:has-text("Automation test Question updated")) [data-tip="Delete"]`
    ).first();

    // Confirmation modal delete button
    this.confirmDeleteBtn = page.getByRole('dialog').getByRole('button', { name: 'Delete' });

  
 // Selected Language Text Element
        this.selectedLanguage =page.locator("(//div[contains(@class,'tabs-bordered')]//div[contains(@class,'tab-content')]//div)[1]");

   this.expandSection = page.locator('.text-xl > div');
        this.optionsTab = page.getByRole('tab', { name: 'Options' });
        //this.addMoreOptionButton = page.getByRole('button', { name: 'Add 1 more option' });
this.addMoreOptionBtn = page.locator('#optionButton-0');

        // Dynamic option 4 input
        this.option4Textbox = page.locator('[id="questiondivid-0\\.3"]').getByRole('textbox', { name: 'Enter option' });
    this.removeOptionCheckbox = page.getByRole('checkbox', { name: 'Remove Option 4' });


 
        // Tabs
        this.optionsTab = page.getByRole('tab', { name: 'Options' });

        // Buttons
        this.addMoreOptionBtn = page.getByRole('button', { name: 'Add 1 more option' });
        this.finishBtn = page.getByRole('button', { name: 'Finish' });
        this.editBtn = page.getByRole('button', { name: 'Edit' });
        this.nextBtn = page.getByRole('button', { name: 'Next' });

        // Messages
        this.updateSuccessMsg = page.getByText('Question details updated');

        // Dynamic Locators
        this.optionInput = (id) =>
            page.locator(`[id="questiondivid-0\\.${id}"]`).getByRole('textbox', { name: 'Enter option' });

       


  }

  // Actions

  async openEditScreen() {
    await this.select7thRow.click();
  }

  async navigatePages() {
    await this.nextBtn.click();
    await this.prevBtn.click();
  }

  async editTitle(newTitle) {
    await this.editBtn.click();
    await this.titleInput.fill(newTitle);
  }

  async changeDifficulty() {
    await this.difficultyDropdown.click();
    await this.veryDifficult.click();
    await this.nextBtn.click();
  }
async clickNext() {
   await expect(this.nextBtn).toBeEnabled();
  await this.nextBtn.click();

} 

  async addLanguage() {
    await this.addMoreLanguageBtn.click();
    await this.languageCollapse.click();
    await this.langDropdown.click();
    await this.assameseLang.click();
    await this.translationTitle.fill('Question 2');
  }

  async uploadMedia(filePath) {
    
    await this.mediaUpload.setInputFiles(filePath);
  }

  async fillOptions() {
    await this.optionsTab.click();
    await this.option1.fill('option 1');
    await this.option2.fill('option 2');
    await this.option3.fill('option 3');

    await this.correct1.check();
    await this.correct2.check();
  }

  async finishAndVerify() {
    await this.finishBtn.click();
    await this.updatedToast.waitFor();
    await this.backBtn.click();
  }

async uploadMediaForQuestion(fileName) {
   await this.languageCollapse.click();
    const filePath =  path.join(__dirname, '../../tests/uploadFiles', fileName);
     await this.uploadMediaInput.setInputFiles(filePath);
  }

  async openMediaPreview() {
    const popupPromise = this.page.waitForEvent('popup');
  await this.previewLink.click();
    return await popupPromise; // returns preview window
  }

  async deleteMedia() {
    await this.deleteMediaBtn.click();
    await this.page.getByText('Are you sure you want to delete this file ? This action can not be undone.').waitFor();
    await this.deleteConfirmBtn.click();
  }

  async verifyLanguageIsNotEditable() {
       await this.languageCollapse.click();
        await this.selectedLanguage.click();
    await this.finishBtn.click();
    await this.backBtn.click();
      }

       async expandLanguageSection() {
        await this.expandSection.click();
    }

    async openOptionsTab() {
        await this.optionsTab.click();
    }

    async addNewOption() {
        await this.addMoreOptionBtn.click();
    }

    async enterOption4(text) {
       // await this.option4Textbox.click();
        await this.option4Textbox.fill(text);
       //  await this.finishBtn.click();
    }
   
    
  
    async openDeleteModal() {
    await this.deleteBtn.click();
  }

  async confirmDelete() {
    await this.confirmDeleteBtn.click();
  }


  

    async goToOptionsTab() {
        await this.optionsTab.click();
    }

   

    async clickFinish() {
        await this.finishBtn.waitFor({ state: 'visible' });
        await this.finishBtn.click();
    }

    async clickNext() {
        await this.nextBtn.click();
    }

    async clickEdit() {
        await this.editBtn.click();
    }

    async clickBack() {
        await this.backBtn.click();
    }
}
module.exports = EditQuestionPage;