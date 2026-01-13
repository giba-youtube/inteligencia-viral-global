export default async function handler(req, res) {
  // Se nenhum país for informado na URL, busca globalmente
  const country = req.query.country || "US";

  try {
    // Faz a requisição para o endpoint correto da Trendly API
    const response = await fetch("https://trendly.p.rapidapi.com/realtime", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "trendly.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY, // variável configurada na Vercel
      },
      body: JSON.stringify({
        country,
        lang: "en",
      }),
    });

    const data = await response.json();

    // Caso não tenha resultados, envia uma mensagem amigável
    if (!data || Object.keys(data).length === 0 || data.msg || data.message) {
      return res.status(200).json({
        message: `Nenhum dado encontrado para ${country}.`,
        suggestion: "Tente outro país ou amplie o intervalo de tempo.",
        data,
      });
    }

    // Se tiver dados, retorna o JSON original da Trendly
    return res.status(200).json(data);
  } catch (error) {
    // Captura e mostra qualquer erro que ocorrer
    return res.status(500).json({
      error: "Falha ao consultar Trendly Realtime.",
      details: error.message,
    });
  }
}
