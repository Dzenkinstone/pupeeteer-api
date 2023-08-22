const { default: puppeteer } = require("puppeteer");
const getWebsiteInformation = require("./getWebsiteInformation");
const PCR = require("puppeteer-chromium-resolver");

const getWebsiteData = async (value, url = "https://rozetka.com.ua/") => {
  try {
    const PCR = require("puppeteer-chromium-resolver");
    const puppeteer = require("puppeteer");
    const stats = await PCR({});
    process.env.PUPPETEER_EXECUTABLE_PATH = stats.executablePath;

    const browser = await puppeteer.launch({
      executablePath: stats.executablePath,
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto(url);

    if (url === "https://rozetka.com.ua/") {
      await page.type(
        '.search-form .search-form__inner .search-form__input-wrapper input[type="text"]',
        value
      );

      await Promise.all([
        page.click(".search-form__submit"),
        page.waitForNavigation(),
      ]);

      const responce = await getWebsiteInformation(browser, page);

      await browser.close();

      return responce;
    }

    const getInformation = await getWebsiteInformation(browser, page);

    if (!getInformation.pagination) {
      await browser.close();
      return "Немає результатів";
    }

    return getInformation;
  } catch (error) {
    console.log("getWebsiteData", error.message);
  }
};

module.exports = getWebsiteData;
