document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const input = document.querySelector("textarea");
  const output = document.querySelector("#output");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const question = input.value.trim();
    if (!question) return;

    output.textContent = "Yanıt yükleniyor... ⏳";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      // Cevabı doğru formatta yakala
      if (!response.ok) {
        throw new Error(`Sunucu hatası: ${response.status}`);
      }

      const data = await response.json();

      console.log("Gelen yanıt:", data); // kontrol için

      // Eğer demo cevapsa onu göster
      if (data.choices && data.choices[0]?.message?.content) {
        output.textContent = data.choices[0].message.content;
      } else if (data.error) {
        output.textContent = `⚠️ Hata: ${data.error.message || "Bilinmeyen hata"}`;
      } else {
        output.textContent = "Bir hata oluştu (boş yanıt).";
      }
    } catch (err) {
      console.error("İstek hatası:", err);
      output.textContent = "Sunucuya bağlanılamadı ❌";
    }
  });
});
