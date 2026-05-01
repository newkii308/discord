const axios = require("axios");

async function fetchMock() {
  const base = 3300;
  const fluctuation = (Math.random() - 0.5) * 40;
  const price = Math.round((base + fluctuation) * 100) / 100;
  return {
    price,
    currency: "USD",
    timestamp: new Date(),
    source: "Mock (ข้อมูลจำลอง)",
  };
}

async function getGoldPrice() {
  return fetchMock();
}

module.exports = { getGoldPrice };
