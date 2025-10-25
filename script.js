import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("."));

// POST isteği
app.post("/api/chat", async (req, res) => {
  const question = req.body.question;
  console.log("Gelen istek:", question); // gelen soruyu görmek için

  try {
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

    // Eğer OpenAI düzgün yanıt dönerse sadece cevabı gönderelim:
    if (data.choices && data.choices.length > 0) {
      res.json({ answer: data.choices[0].message.content });
    } else {
      console.error("API yanıtı hatalı:", data);
      res.status(500).json({ error: "OpenAI yanıtı geçersiz." });
    }
  } catch (err) {
    console.error("Sunucu hatası:", err);
    res.status(500).json({ error: err.message });
  }
});

// PORT ayarı
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor...`));
