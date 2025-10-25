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

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content || "Bir hata oluştu.";
      output.textContent = answer;
    } catch (err) {
      output.textContent = "Sunucuya bağlanılamadı ❌";
    }
  });
});
