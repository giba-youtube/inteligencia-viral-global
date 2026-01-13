export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Parâmetro 'q' obrigatório." });
  }

  try {
    // Chamada direta à API pública do Google Trends
    const response = await fetch(
      `https://trends.google.com/trends/api/widgetdata/relatedsearches?hl=pt-BR&tz=-180&req={"restriction":{"type":"COUNTRY","geo":{"country":"BR"},"keyword":"${q}","time":"now 7-d"},"keywordType":"QUERY","metric":["TOP","RISING"],"trendinessSettings":{"compareTime":"now 7-d","time":"now 7-d"},"requestOptions":{"property":"","backend":"IZG","category":0}}&token=APP6_UEAAAAAZcKJPB7iEpwhQibcTuxQv08ymZKp3_dC`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept": "application/json",
        },
      }
    );

    const text = await response.text();
    const clean = text.replace(")]}',", ""); // remove prefixo de segurança
    const data = JSON.parse(clean);

    const ranked = data.default.rankedList?.[0]?.rankedKeyword || [];
    const relatedQueries = ranked.slice(0, 10).map(item => ({
      term: item.query,
      value: item.value[0],
    }));

    return res.status(200).json({
      query: q,
      relatedQueries,
    });
  } catch (err) {
    console.error("Erro ao consultar Trends:", err);
    return res.status(500).json({ error: "Erro ao consultar Google Trends." });
  }
}
