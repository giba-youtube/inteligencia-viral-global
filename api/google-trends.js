export default async function handler(req, res) {
  // País padrão (pode ser alterado via query: ?country=BR)
  const country = req.query.country || "United States";

  try {
    // Faz a requisição para o endpoint correto
    const response = await fetch("https://trendly.p.rapidapi.com/topics", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "trendly.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY, // usa a chave salva na Vercel
      },
      body: JSON.stringify({
        keywords: ["YouTube", "TikTok", "Netflix"], // até 5 palavras
        start: "2025-12-01T00:00:00Z",              // início do período
        end: "2026-01-13T00:00:00Z",                // fim do período
        country: country,                           // país
        region: "",                                 // opcional
        category: "",                               // opcional
        gprop: "",                                  // web, news, images, etc. (ou vazio)
      }),
    });

    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      return res.status(200).json({
        message: `Nenhum dado encontrado para ${country}.`,
        suggestion: "Tente outro país ou amplie o intervalo de tempo.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao consultar Trendly /topics.",
      details: error.message,
    });
  }
}
