import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Yardımcı: basit demo cevap üreten fonksiyon
function demoAnswer(question) {
  return {
    choices: [
      {
        message: {
          content: `📗 (DEMO) '${question}' konusu hakkında:
Bu bir demo cevaptır — gerçek OpenAI erişimi yok. Kısa özet: ${question} hakkında temel bir açıklama yapılır.`
        }
      }
    ]
  };
}

app.post("/api/chat", async (req, res) => {
  const question = req.body.question || "";
  console.log("Gelen soru:", question);

  // Eğer API KEY yoksa doğrudan demo döndür
  if (!process.env.OPENAI_API_KEY) {
    console.log("API anahtarı bulunamadı — demo döndürülüyor.");
    return res.json(demoAnswer(question));
  }

  // Eğer anahtar varsa gerçek OpenAI isteğini yap (hata durumunda demo döner)
  try {
    const fetch = global.fetch || (await import("node-fetch")).default;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Sen bir ders anlatıcısın." },
          { role: "user", content: question },
        ],
        max_tokens: 500
      }),
    });

    const data = await response.json();

    // Eğer OpenAI hata dönerse demo döndür
    if (!response.ok || data.error) {
      console.warn("OpenAI hatası:", data);
      return res.json(demoAnswer(question));
    }

    return res.json(data);
  } catch (err) {
    console.error("Sunucu hatası:", err);
    return re
