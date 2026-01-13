export default async function handler(req, res) {
  const region = req.query.region || "BR"; // Região padrão: Brasil
  const lang = req.query.lang || "pt-BR";

  try {
    const response = await fetch(
      `https://google-trends8.p.rapidapi.com/trendings?region_code=${region}&hl=${lang}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "google-trends8.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY, // sua chave da RapidAPI
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();

    // Validação básica
    if (!data || !data.trendingSearchesDays) {
      throw new Error("Resposta inesperada da API RapidAPI");
    }

    // Extrai as tendências principais do dia
    const trends = data.trendingSearchesDays[0].trendingSearches.map((t) => ({
      title: t.title.query,
      traffic: t.formattedTraffic,
      articles: t.articles?.map((a) => ({
        title: a.title,
        url: a.url,
        source: a.source,
      })),
    }));

    res.status(200).json({
      region,
      count: trends.length,
      trends,
    });
  } catch (error) {
    res.status(500).json({
      error: "Falha ao consultar Google Trends.",
      details: error.message,
    });
  }
}
