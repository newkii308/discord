# 🥇 Discord Gold Price Bot

บอท Discord แจ้งราคาทอง XAUUSD อัตโนมัติทุก 15 นาที

---

## โครงสร้างโปรเจกต์

```
gold-bot/
├── index.js                  ← จุดเริ่มต้นหลัก
├── .env                      ← ตั้งค่า (สร้างจาก .env.example)
├── .env.example              ← ตัวอย่าง env
├── package.json
├── services/
│   └── goldService.js        ← ดึงราคาทองจาก API
└── utils/
    └── sendGoldPrice.js      ← ส่ง Embed เข้า Discord
```

---

## วิธีติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า .env

```bash
cp .env.example .env
```

แก้ไขค่าใน `.env`:

```env
TOKEN=your_discord_bot_token
CHANNEL_ID=your_channel_id
GOLD_API_PROVIDER=mock        # mock | goldapi | metals
GOLD_API_KEY=                 # ใส่เฉพาะถ้าใช้ goldapi หรือ metals
INTERVAL_MINUTES=15
```

### 3. เปิดบอท

```bash
node index.js
```

หรือใช้ nodemon สำหรับ dev:

```bash
npm run dev
```

---

## Discord Developer Portal

1. ไปที่ https://discord.com/developers/applications
2. สร้าง Application ใหม่ → Bot
3. เปิด **MESSAGE CONTENT INTENT**
4. คัดลอก **TOKEN** มาใส่ใน `.env`
5. เชิญบอทเข้าเซิร์ฟเวอร์ด้วย Permission:
   - Send Messages
   - Read Messages / View Channels
   - Embed Links

**OAuth2 URL ตัวอย่าง:**
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2048&scope=bot
```

---

## Gold API Providers

| Provider | ฟรีแพลน | วิธีสมัคร |
|----------|---------|-----------|
| `mock`   | ✅ ไม่ต้องสมัคร | ข้อมูลจำลอง ใช้ทดสอบ |
| `goldapi` | ✅ มีแพลนฟรี | https://www.goldapi.io |
| `metals` | ✅ มีแพลนฟรี | https://metals-api.com |

---

## ตัวอย่างข้อความที่บอทส่ง

```
📈 ราคาทองล่าสุด

💰 XAUUSD    🕐 เวลา
$3,315.50    13:15 น.

📅 วันที่
วันศุกร์ 1 พ.ค. 2568

แหล่งข้อมูล: Gold API
```

---

## Roadmap (อนาคต)

- [ ] แจ้ง BTC / ETH
- [ ] ข่าวทอง / Crypto
- [ ] ระบบแจ้งเตือนราคา (Price Alert)
- [ ] Slash Commands
- [ ] Dashboard
- [ ] AI วิเคราะห์กราฟ
