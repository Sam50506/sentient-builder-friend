Builder Friend – Sentient AI Code Generator (Groq)

Builder Friend is a simple AI-powered tool that converts user ideas into complete, production-ready code.
It uses Groq’s LLaMA 3.1 model for fast and accurate code generation.

---

Features

- Generates full HTML, CSS and JavaScript code based on user input
- Clean UI that works on both mobile and desktop
- Copy-to-clipboard functionality
- Loading and error handling

API key is kept hidden by routing requests through a secure backend/proxy

---

How It Works

1. User enters an idea
2. The frontend sends the request to a secure proxy (API key is not exposed)
3. The proxy forwards the request to Groq API
4. Groq returns the generated code
5. The code is displayed in the output box

---

Tech Stack

- Groq LLaMA 3.1 (model)
- HTML
- CSS
- JavaScript
- GitHub Pages (frontend hosting)
- Backend proxy (used to hide API key)

---

Project Structure

index.html
style.css
script.js
README.md

Backend/proxy is hosted separately to keep the API key safe.


---

Usage

1. Open the web app
2. Type your idea in the text box
3. Click “Generate Code”
4. The generated code will appear in the output section
5. Use the copy button to copy the output

---

Security

Your Groq API key is not stored in the frontend.
All requests are routed through a proxy so the key stays hidden and protected.

---

Purpose

Builder Friend is created to help the Sentient community quickly prototype ideas and generate working code without needing advanced development knowledge.
