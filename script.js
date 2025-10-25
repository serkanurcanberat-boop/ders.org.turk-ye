document.getElementById("askBtn").addEventListener("click", async () => {
  const question = document.getElementById("question").value;
  const answerDiv = document.getElementById("answer");

  if (!question.trim()) {
    answerDiv.textContent = "Lütfen bir soru veya konu yaz!";
    return;
  }

  answerDiv.textContent = "Yapay zekâ düşünüyor...";

  // Geçici demo cevabı
  setTimeout(() => {
    answerDiv.textContent = `"${question}" konusu hakkında bilgi almak için AI sistemine bağlanılacak.`;
  }, 1500);
});
