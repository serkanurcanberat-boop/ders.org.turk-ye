import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("."));

// === ANA API ROTASI ===
app.post("/api/chat", async (req, res) => {
  const question = req.body.question;
  console.log("Kullanıcı sordu:", question);

  // Eğer API key yoksa veya kota doluysa sahte yanıt gönder
  if (!process.env.OPENAI_API_KEY) {
    console.log("❌ API anahtarı bulunamadı, demo yanıt dönülüyor...");
    return res.json({
      choices: [
        {
          message: {
            content: `📘 (DEMO) '${question}' konusu hakkında:
Bu sadece test amaçlı oluşturulmuş bir örnek cevaptır.
Gerçek OpenAI yanıtı şu anda devre dışı.`,
          },
        },
      ],
    });
  }

  try {
    // Gerçek API isteği
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
      }),
    });

    const data = await response.json();

    // Eğer kota hatası dönerse mock cevap
    if (data.error?.message?.includes("quota")) {
      console.log("⚠️ Kota hatası, demo yanıt gönderiliyor...");
      return res.json({
        choices: [
          {
            message: {
              content: `📗 (DEMO) '${question}' konusu hakkında:
Şu anda OpenAI bağlantısı kullanılamıyor. Bu örnek cevaptır.`,
            },
          },
        ],
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Hata:", err);
    res.json({
      choices: [
        {
          message: {
            content: `⚠️ Sunucu hatası oluştu: ${err.message}`,
          },
        },
      ],
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda çalışıyor...`));
