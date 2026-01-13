export default async function handler(req, res) {
  let country = req.query.country || "Brazil";
  const fallbackCountry = "United States";

  try {
    const response = await fetch("https://trendly.p.rapidapi.com/top-realtime-search", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "trendly.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      },
      body: JSON.stringify({ country, lang: "en" }),
    });

    const data = await response.json();

    if (!data || Object.keys(data).length === 0 || data.message) {
      // tenta o fallback automaticamente
      const fallbackResponse = await fetch("https://trendly.p.rapidapi.com/top-realtime-search", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-rapidapi-host": "trendly.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        },
        body: JSON.stringify({ country: fallbackCountry, lang: "en" }),
      });

      const fallbackData = await fallbackResponse.json();

      return res.status(200).json({
        message: `Nenhum dado encontrado para ${country}. Mostrando resultados de ${fallbackCountry}.`,
        data: fallbackData,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Falha ao consultar a API Trendly Realtime.",
      details: error.message,
    });
  }
}
