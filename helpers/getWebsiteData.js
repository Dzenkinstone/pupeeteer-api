const { default: puppeteer } = require("puppeteer");
const getWebsiteInformation = require("./getWebsiteInformation");
const PCR = require("puppeteer-chromium-resolver");

const getWebsiteData = async (value, url = "https://rozetka.com.ua/") => {
  try {
    const options = {
      // the chromium revision to use
      // default is puppeteer.PUPPETEER_REVISIONS.chromium
      revision: "",

      // additional path to detect local chromium copy (separate with a comma if multiple paths)
      detectionPath: "",

      // custom path to download chromium to local, require dir permission: 0o777
      // default is user home dir
      downloadPath: "",

      // the folder name for chromium snapshots (maybe there are multiple versions)
      folderName: ".chromium-browser-snapshots",

      // the stats file name, cache stats info for latest installation
      statsName: ".pcr-stats.json",

      // default hosts are ['https://storage.googleapis.com', 'https://npmmirror.com/mirrors']
      hosts: ["https://rozetka.com.ua/"],

      cacheRevisions: 2,
      retry: 3,
      silent: false,
    };
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
