export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { prompt, platform, tone, lang } = req.body;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: lang === "fr" ? "Tu es un expert en marketing des réseaux sociaux. Rédige un post clair, engageant et professionnel." : "You are a social media marketing expert. Write a clear, engaging and professional post." },
          { role: "user", content: `Platform: ${platform}\nTone: ${tone}\nTopic: ${prompt}` }
        ],
        temperature: 0.8
      })
    });
    const data = await response.json();
    res.status(200).json({ text: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "AI generation failed" });
