import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userMessage } = req.body;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://your-vercel-site.vercel.app", // opsional
      "X-Title": "GreenPoint Chatbot", // opsional
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-8b-instruct:free",
      messages: [
        {
          role: "system",
          content: "Acting as an AI Chatbot from the GreenPoint website, you are asked to answer questions from this user using the languages user use. You are only allowed to answer questions about plants. If the question is not about plants, say that you are not trained for that."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}
