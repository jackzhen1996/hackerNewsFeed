const puppeteer = require('puppeteer');

describe('End to End test', ()=>{
  test('Checks for element existence and click events', async () => {
    let browser = await puppeteer.launch({
      headless: true,
      devtools: true,
      slowMo: 250
    });
    let page = await browser.newPage();

    page.emulate({
      viewport : {
        width: 500,
        height: 900
      },
      userAgent: ''
    });

    await page.goto('http://localhost:3000');
    // checks if h4 tag exists
    await page.waitForSelector('h4', {text:'Hello, Jack!'});
    // checks if feeds are coming in
    await page.waitForSelector('.feedBlockContainer');
    // click to expand comment
    await page.click('.expandComments');
    // comment containers should show up
    await page.waitForSelector('.commentContainer');
    browser.close();
  },20000);

});