export default async function handler(req, res) {
  const query = req.query.q || "futebol";

  try {
    // Endpoint alternativo do Google Trends
    const response = await fetch(
      `https://trends.google.com/trends/api/explore?hl=pt-BR&tz=-180&req={"comparisonItem":[{"keyword":"${query}","geo":"BR","time":"now 7-d"}],"category":0,"property":""}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );

    const text = await response.text();

    // Remove o prefixo “)]}',” do JSON do Google Trends
    const jsonText = text.replace(")]}',", "").trim();
    const data = JSON.parse(jsonText);

    if (!data.widgets) {
      throw new Error("A resposta do Google não contém widgets válidos.");
    }

    // Filtra o primeiro widget de interesse
    const widget = data.widgets.find(
      (w) => w.request && w.request.comparisonItem
    );

    res.status(200).json({
      query,
      widgets: data.widgets.length,
      requestType: widget?.title || "Sem título",
    });
  } catch (error) {
    res.status(500).json({
      error: "Falha ao consultar Google Trends.",
      details: error.message,
    });
  }
}
