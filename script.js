const API_KEY = "AIzaSyAf8yQTiE8jsTQIX3Gl6Y_UjUpK7ZVBzX0";

async function generateCode(idea) {
  // Test with the simplest working model first
  const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
  
  try {
    console.log("Testing API connection...");
    console.log("Endpoint:", API_ENDPOINT);
    
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: idea }]
        }]
      })
    });

    console.log("Response status:", response.status);
    
    const data = await response.json();
    console.log("Full response:", data);

    if (!response.ok) {
      throw new Error(data.error?.message || JSON.stringify(data));
    }

    let result = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    result = result.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
    
    return result;
  } catch (err) {
    console.error("Error details:", err);
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
