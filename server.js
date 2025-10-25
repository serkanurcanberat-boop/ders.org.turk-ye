// server.js
import express from "express";
import fetch from "node-fetch"; // node 18+ kullanıyorsan global fetch kullanılabilir
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors()); // istersen origin sınırla: cors({ origin: "https://serkanurcanberat-boop.github.io" })
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const body = req.body;

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
