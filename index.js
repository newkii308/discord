require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { getGoldPrice } = require("./services/goldService");
const { sendGoldPrice } = require("./utils/sendGoldPrice");

// ============================================================
// index.js — จุดเริ่มต้นหลักของ Gold Price Bot
// ============================================================

// ─────────────────────────────────────────────────────────────
// ตรวจสอบ Environment Variables ที่จำเป็น
// ─────────────────────────────────────────────────────────────
const REQUIRED_ENV = ["TOKEN", "CHANNEL_ID"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ ขาด environment variable: ${missing.join(", ")}`);
  console.error("   กรุณาตั้งค่าใน .env ก่อนเปิดบอท");
  process.exit(1);
}

const INTERVAL_MINUTES = parseInt(process.env.INTERVAL_MINUTES || "15", 10);
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

// ─────────────────────────────────────────────────────────────
// สร้าง Discord Client
// ─────────────────────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

// ─────────────────────────────────────────────────────────────
// ฟังก์ชันหลัก: ดึงราคาทอง → ส่ง Discord
// ─────────────────────────────────────────────────────────────
async function postGoldPrice() {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);

    if (!channel || !channel.isTextBased()) {
      console.error("❌ ไม่พบ channel หรือ channel ไม่ใช่ text channel");
      return;
    }

    console.log("🔍 กำลังดึงราคาทอง...");
    const goldData = await getGoldPrice();

    console.log(`💰 XAUUSD: $${goldData.price} (${goldData.source})`);
    await sendGoldPrice(channel, goldData);
    console.log(`✅ ส่งราคาทองเข้า Discord สำเร็จ — ${new Date().toLocaleTimeString("th-TH")}`);

  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error.message);
  }
}

// ─────────────────────────────────────────────────────────────
// เมื่อบอท Login สำเร็จ
// ─────────────────────────────────────────────────────────────
client.once("ready", async () => {
  console.log("─────────────────────────────────────");
  console.log(`🤖 Bot พร้อมใช้งาน: ${client.user.tag}`);
  console.log(`📢 Channel ID    : ${process.env.CHANNEL_ID}`);
  console.log(`⏱  แจ้งราคาทุก  : ${INTERVAL_MINUTES} นาที`);
  console.log(`🌐 API Provider  : ${process.env.GOLD_API_PROVIDER || "mock"}`);
  console.log("─────────────────────────────────────");

  // ส่งราคาทันทีเมื่อเปิดบอท
  await postGoldPrice();

  // ตั้ง Timer แจ้งราคาทุก N นาที
  setInterval(postGoldPrice, INTERVAL_MS);
});

// ─────────────────────────────────────────────────────────────
// Error Handling
// ─────────────────────────────────────────────────────────────
client.on("error", (error) => {
  console.error("❌ Discord Client Error:", error.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});

// ─────────────────────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────────────────────
console.log("🚀 กำลังเชื่อมต่อ Discord...");
client.login(process.env.TOKEN);
