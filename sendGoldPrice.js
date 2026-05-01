const { EmbedBuilder } = require("discord.js");

// ============================================================
// sendGoldPrice.js
// หน้าที่: รับข้อมูลราคาทอง → สร้าง Embed → ส่งเข้า Discord
// ============================================================

/**
 * จัดรูปแบบตัวเลขราคา เช่น 3315.50 → "3,315.50"
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * จัดรูปแบบเวลาเป็น HH:MM (เวลาไทย UTC+7)
 * @param {Date} date
 * @returns {string}
 */
function formatTime(date) {
  return date.toLocaleTimeString("th-TH", {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * จัดรูปแบบวันที่ เช่น "วันศุกร์ 1 พ.ค. 2568"
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return date.toLocaleDateString("th-TH", {
    timeZone: "Asia/Bangkok",
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * ส่งข้อความราคาทองเข้า Discord channel
 * @param {import("discord.js").TextChannel} channel - Discord channel object
 * @param {{ price: number, currency: string, timestamp: Date, source: string }} goldData
 */
async function sendGoldPrice(channel, goldData) {
  const { price, currency, timestamp, source } = goldData;

  const timeStr = formatTime(timestamp);
  const dateStr = formatDate(timestamp);
  const priceStr = formatPrice(price);

  // สร้าง Discord Embed
  const embed = new EmbedBuilder()
    .setColor(0xFFD700) // สีทอง
    .setTitle("📈 ราคาทองล่าสุด")
    .addFields(
      {
        name: "💰 XAUUSD",
        value: `**$${priceStr}** ${currency}/oz`,
        inline: true,
      },
      {
        name: "🕐 เวลา",
        value: `${timeStr} น.`,
        inline: true,
      },
      {
        name: "📅 วันที่",
        value: dateStr,
        inline: false,
      }
    )
    .setFooter({ text: `แหล่งข้อมูล: ${source}` })
    .setTimestamp(timestamp);

  await channel.send({ embeds: [embed] });
}

module.exports = { sendGoldPrice };
