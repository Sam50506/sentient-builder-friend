const API_KEY = "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";
const API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

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
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful AI that generates full, working website code from user ideas." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    let result = data.choices?.[0]?.message?.content || "";

    // Remove markdown formatting like ```html or ```
    result = result.replace(/```[a-z]*\n?/g, "").replace(/```/g, "").trim();

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
    errorMessage.style.display = "block";
    return;
  }

  errorMessage.style.display = "none";
  outputSection.style.display = "none";
  loading.style.display = "block";
  generateBtn.disabled = true;

  try {
    const code = await generateCode(idea);
    output.textContent = code;
    outputSection.style.display = "block";
    outputSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (e) {
    errorText.textContent = "Failed to generate code: " + e.message;
    errorMessage.style.display = "block";
    console.error("Full error:", e);
  } finally {
    loading.style.display = "none";
    generateBtn.disabled = false;
  }
});

document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("ideaInput").value = "";
  document.getElementById("codeOutput").textContent = "";
  document.getElementById("outputSection").style.display = "none";
  document.getElementById("errorMessage").style.display = "none";
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

window.addEventListener("load", () => {
  document.getElementById("ideaInput").focus();
});
