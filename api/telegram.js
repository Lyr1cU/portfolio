const ALLOWED_ORIGINS = [
  "https://lyr1cu.github.io",
  "http://localhost:8080",
  "http://127.0.0.1:8080"
];

function setCors(req, res) {
  const origin = req.headers.origin || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function clean(value, max) {
  return String(value || "")
    .trim()
    .slice(0, max);
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: "not_configured" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ ok: false, error: "invalid_json" });
    }
  }

  if (body && body.website) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, 100);
  const contact = clean(body.contact, 100);
  const business = clean(body.business, 150);
  const message = clean(body.message, 2000);
  const lang = clean(body.lang, 5);

  if (!name || !contact) {
    return res.status(400).json({ ok: false, error: "missing_fields" });
  }

  const sentAt = new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" });
  const lines = [
    "📩 Заявка з Artem.dev",
    "",
    `👤 Ім'я: ${name}`,
    `📞 Контакт: ${contact}`
  ];

  if (business) lines.push(`🏪 Бізнес: ${business}`);
  if (message) lines.push("", `💬 Повідомлення:\n${message}`);
  if (lang) lines.push("", `🌐 Мова: ${lang}`);
  lines.push("", `🕐 ${sentAt}`);

  const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n")
    })
  });

  const tgData = await tgRes.json();
  if (!tgData.ok) {
    console.error("Telegram API error:", tgData);
    return res.status(502).json({ ok: false, error: "telegram_failed" });
  }

  return res.status(200).json({ ok: true });
};
