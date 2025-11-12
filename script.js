const API_KEY = "AIzaSyAf8yQTiE8jsTQIX3Gl6Y_UjUpK7ZVBzX0";
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

async function generateCode(idea) {
  try {
    const prompt = `Write full working code for: ${idea}. Return only code (no explanations or markdown).`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "Unknown API error");
    }

    const data = await response.json();
    let result = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    result = result.replace(/```[\s\S]*?```/g, "").trim();
    return result;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
}

// Frontend connections
document.getElementById("generateBtn").addEventListener("click", async () => {
  const idea = document.getElementById("ideaInput").value.trim();
  const output = document.getElementById("codeOutput");
  output.textContent = "Generating...";
  try {
    const code = await generateCode(idea);
    output.textContent = code;
  } catch (e) {
    output.textContent = "Error: " + e.message;
  }
});
