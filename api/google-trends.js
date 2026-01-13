export default async function handler(req, res) {
  const country = req.query.country || "United States";

  try {
    const response = await fetch("https://trendly.p.rapidapi.com/realtime", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "trendly.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      },
      body: JSON.stringify({
        country,
        lang: "en",
      }),
    });

    const data = await response.json();

    if (!data || Object.keys(data).length === 0 || data.message) {
      return res.status(200).json({
        message: `Nenhum dado encontrado para ${country}.`,
        suggestion: "Tente outro país ou amplie o intervalo de tempo.",
        data,
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Falha ao consultar Trendly Realtime.",
      details: error.message,
    });
  }
}
