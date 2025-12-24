const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

/*
  IMPORTANT:
  - Do NOT hardcode your API key
  - On Vercel, add it as:
    GEMINI_API_KEY = your_key_here
*/
const API_KEY = import.meta?.env?.VITE_GEMINI_API_KEY || "";
const MODEL = "gemini-2.5-flash";

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender === "user" ? "user-msg" : "ai-msg";
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";
  sendBtn.disabled = true;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    addMessage(reply, "ai");
  } catch (error) {
    addMessage("⚠️ Error connecting to Gemini API.", "ai");
    console.error(error);
  } finally {
    sendBtn.disabled = false;
  }
}
