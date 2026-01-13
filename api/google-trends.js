export default async function handler(req, res) {
  const region = req.query.region || "US";
  const lang = req.query.lang || "en-US";

  try {
    const response = await fetch(
      `https://google-trends8.p.rapidapi.com/trendings?region_code=${region}&hl=${lang}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "google-trends8.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        },
      }
    );

    if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Falha ao consultar Google Trends.",
      details: error.message,
    });
  }
}
