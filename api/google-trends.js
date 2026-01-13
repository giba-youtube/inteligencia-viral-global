export default async function handler(req, res) {
  const region = req.query.region || "US"; // padrão EUA
  const lang = req.query.lang || "en-US"; // idioma padrão

  try {
    const response = await fetch(
      `https://google-trends13.p.rapidapi.com/trending?region_code=${region}&hl=${lang}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "google-trends13.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        },
      }
    );

    const data = await response.json();

    if (!data || data.status === "error") {
      return res.status(400).json({
        message: "Erro ao buscar dados do Google Trends.",
        details: data.message || "Verifique parâmetros region_code e hl.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno ao consultar a API do Google Trends.",
      details: error.message,
    });
  }
}
