export default async function handler(req, res) {
  const country = req.query.country || "United States";

  // Calcula as datas automaticamente
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30); // últimos 30 dias

  try {
    const response = await fetch("https://trendly.p.rapidapi.com/topics", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "trendly.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY, // variável configurada na Vercel
      },
      body: JSON.stringify({
        keywords: ["YouTube", "TikTok", "Netflix"],
        start: start.toISOString(),
        end: end.toISOString(),
        country,
        region: "",
        category: "",
        gprop: "",
      }),
    });

    const data = await response.json();

    // Se a API não retornar dados úteis
    if (!data || Object.keys(data).length === 0) {
      return res.status(200).json({
        message: "Nenhum dado encontrado para o período especificado.",
        suggestion:
          "Tente outro país ou intervalo de datas maior (ex: 90 dias).",
      });
    }

    // Retorna os dados normalmente
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Falha ao consultar a API Trendly.",
      details: error.message,
    });
  }
}
