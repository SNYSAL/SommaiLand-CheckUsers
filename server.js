import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const DISCORD_API = `https://discord.com/api/v10`;

app.get('/api/stats', async (req, res) => {
  try {
    const response = await fetch(`${DISCORD_API}/guilds/${process.env.GUILD_ID}/members?limit=1000`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`
      }
    });

    if (!response.ok) throw new Error("Discord API error");

    const members = await response.json();
    const total = members.length;

    const civilianCount = members.filter(m =>
      m.roles.includes(process.env.CIVILIAN_ROLE_ID)
    ).length;

    res.json({
      everyone: total,
      civilian: civilianCount,
      companies: 3
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลจาก Discord" });
  }
});

app.get('/', (req, res) => {
  res.send("✅ Discord Stats Server พร้อมใช้งาน!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
