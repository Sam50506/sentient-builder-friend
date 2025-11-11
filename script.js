const API_KEY = "AIzaSyAf8yQTiE8jsTQIX3Gl6Y_UjUpK7ZVBzX0";
const API_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;
const ideaInput = document.getElementById("ideaInput");
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const loading = document.getElementById("loading");
const outputSection = document.getElementById("outputSection");
const codeOutput = document.getElementById("codeOutput");
const copyBtn = document.getElementById("copyBtn");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

generateBtn.addEventListener("click", generateCode);
clearBtn.addEventListener("click", clearAll);
copyBtn.addEventListener("click", copyCode);

// Allow Ctrl+Enter to trigger
ideaInput.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") generateCode();
});

async function generateCode() {
  const idea = ideaInput.value.trim();

  if (!idea) return showError("Please enter an idea first!");
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE")
    return showError("Please set your Gemini API key.");

  hideError();
  outputSection.classList.remove("active");
  loading.classList.add("active");
  generateBtn.disabled = true;

  try {
    const prompt = `Write full working code for this idea: "${idea}". 
    Return only the code — no explanations or markdown fences. 
    If it's a website, include HTML, CSS, and JavaScript together in one file.`;

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `API Error ${response.status}`);
    }

    const data = await response.json();
    const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = generated.replace(/```[\s\S]*?```/g, "").trim();

    displayCode(clean || "⚠️ No code generated. Try again.");
  } catch (err) {
    showError(`Failed to generate code: ${err.message}`);
  } finally {
    loading.classList.remove("active");
    generateBtn.disabled = false;
  }
}

function displayCode(code) {
  codeOutput.textContent = code;
  outputSection.classList.add("active");
  outputSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function copyCode() {
  navigator.clipboard
    .writeText(codeOutput.textContent)
    .then(() => {
      copyBtn.textContent = "Copied!";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy Code";
        copyBtn.classList.remove("copied");
      }, 2000);
    })
    .catch((err) => showError("Failed to copy code: " + err.message));
}

function clearAll() {
  ideaInput.value = "";
  codeOutput.textContent = "";
  outputSection.classList.remove("active");
  hideError();
  ideaInput.focus();
}

function showError(msg) {
  errorText.textContent = msg;
  errorMessage.classList.add("active");
  errorMessage.scrollIntoView({ behavior: "smooth" });
}

function hideError() {
  errorMessage.classList.remove("active");
}

window.addEventListener("load", () => ideaInput.focus());
