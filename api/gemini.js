// api/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Check for correct HTTP method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 2. Parse the incoming message
  const { message } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "API Key not configured on Vercel" });
  }

  try {
    // 3. Connect to Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Note: Using standard 1.5-flash model. 
    // If you specifically need a newer experimental model, update the string below.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Generate content
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // 5. Send success response
    return res.status(200).json({
      candidates: [
        {
          content: {
            parts: [{ text: text }]
          }
        }
      ]
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "Failed to fetch response from AI" });
  }
}
