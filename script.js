const askBtn = document.getElementById("askBtn");
const questionInput = document.getElementById("question");
const answerDiv = document.getElementById("answer");

askBtn.addEventListener("click", async () => {
  const question = questionInput.value.trim();
  if (!question) {
    answerDiv.textContent = "Lütfen bir soru yaz!";
    return;
  }

  answerDiv.textContent = "Yapay zekâ düşünüyor...";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ↓ Buraya kendi anahtarını tek satırda ve tek boşlukla yaz:
        // "Authorization": "Bearer sk-XXXXXXXXXXXXXXXXXXXXXXXX"
        ""Authorization": "Bearer sk-REPLACE_WITH_SERVER_SIDE_KEY"

      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Sen bir ders anlatıcısın. Öğrencilere açık, sade ve öğretici şekilde yanıt ver." },
          { role: "user", content: question }
        ],
        max_tokens: 500
      })
    });

    // Eğer istek 200 değilse JSON.parse hata verebilir, önce status kontrolü yapalım
    if (!response.ok) {
      const errText = await response.text();
      answerDiv.textContent = `Sunucu hatası: ${response.status} - ${errText}`;
      return;
    }

    const data = await response.json();
    answerDiv.textContent = data.choices?.[0]?.message?.content || "Yanıt boş geldi.";
  } catch (err) {
    answerDiv.textContent = "Bağlantı hatası: " + err.message;
  }
});
