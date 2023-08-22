const getWebsiteData = require("../helpers/getWebsiteData");

const getPageInformation = async (req, res, next) => {
  const value = req.query.value || null;
  const url = req.query.url || "https://rozetka.com.ua/";
  const data = await getWebsiteData(value, url);

  res.json(200, data);
};

module.exports = {
  getPageInformation,
};
