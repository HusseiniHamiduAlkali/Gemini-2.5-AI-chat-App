import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "API Key not configured" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // UPDATED: Using the specific 2.5 model your key is enabled for
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

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
    return res.status(500).json({ error: "Failed to fetch response" });
  }
}
