document.getElementById("askBtn").addEventListener("click", async () => {
  const question = document.getElementById("question").value.trim();
  const answerDiv = document.getElementById("answer");

  if (!question) {
    answerDiv.textContent = "Lütfen bir konu veya soru yaz.";
    return;
  }

  answerDiv.textContent = "Yapay zekâ düşünüyor...";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ⚠️ Burada kendi OpenAI API anahtarını gir!
        "Authorization": "Bearer sk-...Kr4A"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Sen bir ders anlatıcısın. Öğrencilere açık, sade ve öğretici şekilde yanıt ver." },
          { role: "user", content: question }
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      answerDiv.textContent = "Bir hata oluştu: " + data.error.message;
    } else {
      answerDiv.textContent = data.choices[0].message.content;
    }

  } catch (error) {
    answerDiv.textContent = "Bağlantı hatası: " + error.message;
  }
});
