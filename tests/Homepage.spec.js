
const {test,expect}=require('@playwright/test');

test('Homepage',async({page})=>{
 
  await page.goto('https://demoblaze.com/index.html');

// Get and log the page title
const pageTitle = await page.title();
console.log('PageTitle: ', pageTitle);

// Assertion on title
await expect(page).toHaveTitle('STORE');

// Get and log the page URL
const pageUrl = page.url(); // this can be sync
console.log('pageUrl: ', pageUrl);

// Assertion on URL
await expect(page).toHaveURL('https://demoblaze.com/index.html');




// Close the page
await page.close();

})