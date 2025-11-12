const API_KEY = "AIzaSyAf8yQTiE8jsTQIX3Gl6Y_UjUpK7ZVBzX0";
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

async function generateCode(idea) {
  try {
    const prompt = `Generate complete, production-ready code for: ${idea}

Requirements:
- Output ONLY the code, no explanations
- For web projects: single HTML file with embedded CSS and JavaScript
- Make it fully functional and responsive
- Add brief comments where helpful`;

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        }
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    let result = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Remove markdown code blocks if present
    result = result.replace(/```html\n?/g, '').replace(/```javascript\n?/g, '').replace(/```css\n?/g, '').replace(/```\n?/g, '').trim();
    
    return result;
  } catch (err) {
    console.error("Generation error:", err);
    throw err;
  }
}

document.getElementById("generateBtn").addEventListener("click", async () => {
  const idea = document.getElementById("ideaInput").value.trim();
  const output = document.getElementById("codeOutput");
  const loading = document.getElementById("loading");
  const outputSection = document.getElementById("outputSection");
  const errorMessage = document.getElementById("errorMessage");
  const errorText = document.getElementById("errorText");
  const generateBtn = document.getElementById("generateBtn");

  if (!idea) {
    errorText.textContent = "Please enter an idea first!";
    errorMessage.classList.add("active");
    return;
  }

  errorMessage.classList.remove("active");
  outputSection.classList.remove("active");
  loading.classList.add("active");
  generateBtn.disabled = true;

  try {
    const code = await generateCode(idea);
    output.textContent = code;
    outputSection.classList.add("active");
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (e) {
    errorText.textContent = "Failed to generate code: " + e.message;
    errorMessage.classList.add("active");
    console.error("Full error:", e);
  } finally {
    loading.classList.remove("active");
    generateBtn.disabled = false;
  }
});

document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("ideaInput").value = "";
  document.getElementById("codeOutput").textContent = "";
  document.getElementById("outputSection").classList.remove("active");
  document.getElementById("errorMessage").classList.remove("active");
  document.getElementById("ideaInput").focus();
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const code = document.getElementById("codeOutput").textContent;
  const copyBtn = document.getElementById("copyBtn");
  
  navigator.clipboard.writeText(code).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    copyBtn.classList.add("copied");
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.classList.remove("copied");
    }, 2000);
  }).catch(err => {
    alert("Failed to copy: " + err.message);
  });
});

window.addEventListener('load', () => {
  document.getElementById('ideaInput').focus();
});
