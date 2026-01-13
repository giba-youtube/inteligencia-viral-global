export default async function handler(req, res) {
  // Permite personalização via query string
  const country = req.query.country || "United States";
  const period = parseInt(req.query.period || "90"); // dias
  const keywords = req.query.keywords
    ? req.query.keywords.split(",")
    : ["YouTube", "TikTok", "Netflix"];

  // Calcula intervalo de tempo
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - period);

  try {
    const response = await fetch("https://trendly.p.rapidapi.com/topics", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "trendly.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      },
      body: JSON.stringify({
        keywords,
        start: start.toISOString(),
        end: end.toISOString(),
        country,
        region: "",
        category: "",
        gprop: "",
      }),
    });

    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      return res.status(200).json({
        message: "Nenhum dado encontrado para o período.",
        usedParams: { country, period, keywords },
        suggestion: "Tente outro país, palavras ou um intervalo maior.",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Falha ao consultar a API Trendly.",
      details: error.message,
    });
  }
}
