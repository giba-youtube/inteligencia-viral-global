export default async function handler(req, res) {
  // Pega o país da query (ou padrão "US")
  const country = req.query.country || "US";

  try {
    const response = await fetch("https://trendly.p.rapidapi.com/related-topics", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "trendly.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      },
      body: JSON.stringify({
        keywords: ["YouTube", "TikTok", "Netflix"], // palavras para analisar
        country, // país no formato ISO-2, ex: "US", "BR", "IN"
        lang: "en", // idioma
        start: "2025-12-01T00:00:00Z", // data inicial
        end: "2026-01-13T00:00:00Z", // data final
      }),
    });

    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      return res.status(200).json({
        message: `Nenhum dado encontrado para ${country}.`,
        suggestion: "Tente outro país, palavras diferentes ou amplie o intervalo de tempo.",
        usedParams: { country },
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao consultar Trendly /related-topics.",
      details: error.message,
    });
  }
}
