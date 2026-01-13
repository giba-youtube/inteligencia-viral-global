export default async function handler(req, res) {
  const country = req.query.country || "United States";

  try {
    const response = await fetch("https://trendly.p.rapidapi.com/hot-trending", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "trendly.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      },
      body: JSON.stringify({
        country: country,
        lang: "en",
      }),
    });

    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      return res.status(200).json({
        message: `Nenhum dado encontrado para ${country}.`,
        suggestion: "Tente outro país ou amplie o intervalo de tempo.",
      });
    }

    return res.status(200).json({
      country,
      results: data,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao consultar Trendly /hot-trending.",
      details: error.message,
    });
  }
}
