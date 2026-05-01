const axios = require("axios");

// ============================================================
// goldService.js
// หน้าที่: ดึงราคาทอง XAUUSD จาก API ที่เลือก
// รองรับ: goldapi | metals | mock
// ============================================================

/**
 * @typedef {Object} GoldPrice
 * @property {number} price     - ราคา XAUUSD (USD per troy oz)
 * @property {string} currency  - สกุลเงิน
 * @property {Date}   timestamp - เวลาที่ได้ข้อมูล
 * @property {string} source    - แหล่งที่มา
 */

// ─────────────────────────────────────────────────────────────
// Provider: Gold API (https://www.goldapi.io)
// ─────────────────────────────────────────────────────────────
async function fetchFromGoldApi() {
  const apiKey = process.env.GOLD_API_KEY;
  if (!apiKey) throw new Error("GOLD_API_KEY is required for goldapi provider");

  const response = await axios.get("https://www.goldapi.io/api/XAU/USD", {
    headers: {
      "x-access-token": apiKey,
      "Content-Type": "application/json",
    },
    timeout: 10_000,
  });

  const data = response.data;
  return {
    price: data.price,
    currency: "USD",
    timestamp: new Date(data.timestamp * 1000),
    source: "Gold API",
  };
}

// ─────────────────────────────────────────────────────────────
// Provider: Metals API (https://metals-api.com)
// ─────────────────────────────────────────────────────────────
async function fetchFromMetalsApi() {
  const apiKey = process.env.GOLD_API_KEY;
  if (!apiKey) throw new Error("GOLD_API_KEY is required for metals provider");

  const response = await axios.get("https://metals-api.com/api/latest", {
    params: {
      access_key: apiKey,
      base: "USD",
      symbols: "XAU",
    },
    timeout: 10_000,
  });

  const data = response.data;
  if (!data.success) throw new Error(`Metals API error: ${data.error?.info}`);

  // rates.XAU = จำนวน oz ที่ได้จาก 1 USD → กลับด้านเพื่อได้ราคา USD/oz
  const price = 1 / data.rates["XAU"];
  return {
    price: Math.round(price * 100) / 100,
    currency: "USD",
    timestamp: new Date(data.timestamp * 1000),
    source: "Metals API",
  };
}

// ─────────────────────────────────────────────────────────────
// Provider: Mock (ใช้ทดสอบโดยไม่ต้อง API key)
// ─────────────────────────────────────────────────────────────
function fetchMock() {
  // จำลองราคาขึ้นลงเล็กน้อยรอบ $3,300
  const base = 3300;
  const fluctuation = (Math.random() - 0.5) * 40; // ±$20
  const price = Math.round((base + fluctuation) * 100) / 100;

  return {
    price,
    currency: "USD",
    timestamp: new Date(),
    source: "Mock (ข้อมูลจำลอง)",
  };
}

// ─────────────────────────────────────────────────────────────
// ฟังก์ชันหลัก: เลือก provider จาก env แล้วดึงราคา
// ─────────────────────────────────────────────────────────────
async function getGoldPrice() {
  const provider = (process.env.GOLD_API_PROVIDER || "mock").toLowerCase();

  switch (provider) {
    case "goldapi":
      return await fetchFromGoldApi();
    case "metals":
      return await fetchFromMetalsApi();
    case "mock":
      return fetchMock();
    default:
      throw new Error(`Unknown GOLD_API_PROVIDER: "${provider}". ใช้ได้: goldapi | metals | mock`);
  }
}

module.exports = { getGoldPrice };
