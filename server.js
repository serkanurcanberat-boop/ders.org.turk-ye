import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public")); // 🔹 Değişiklik 1: static klasörü public yaptık

app.post("/api/chat", async (req, res) => {
  const question = req.body.question;

  try {
    console.log("Kullanıcı sordu:", question); // 🔹 Log eklendi

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
    console.log("API yanıtı:", data); // 🔹 Yanıt logu
    res.json(data);
  } catch (err) {
    console.error("Hata:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda çalışıyor...`));
