const { default: puppeteer } = require("puppeteer");
const getWebsiteInformation = require("./getWebsiteInformation");
const PCR = require("puppeteer-chromium-resolver");

const getWebsiteData = async (value, url = "https://rozetka.com.ua/") => {
  try {
    const options = {};
    const stats = await PCR(options);
    const browser = await stats.puppeteer
      .launch({
        headless: false,
        args: ["--no-sandbox"],
        executablePath: stats.executablePath,
      })
      .catch(function (error) {
        console.log(error);
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
