export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Parâmetro 'q' obrigatório." });

  try {
    const response = await fetch(
      `https://trends.google.com/trends/api/explore?hl=pt-BR&tz=-180&req={"comparisonItem":[{"keyword":"${q}","geo":"BR","time":"now 7-d"}],"category":0,"property":""}`
    );

    const text = await response.text();
    const clean = text.replace(")]}',", "");

    const explore = JSON.parse(clean);
    const token = explore.widgets?.find(w => w.id === "RELATED_QUERIES")?.token;
    const request = explore.widgets?.find(w => w.id === "RELATED_QUERIES")?.request;

    if (!token || !request) throw new Error("Token não encontrado.");

    const trendsUrl = `https://trends.google.com/trends/api/widgetdata/relatedsearches?hl=pt-BR&tz=-180&req=${encodeURIComponent(
      JSON.stringify(request)
    )}&token=${token}&tz=-180`;

    const relatedResponse = await fetch(trendsUrl);
    const relatedText = await relatedResponse.text();
    const relatedClean = relatedText.replace(")]}',", "");
    const relatedData = JSON.parse(relatedClean);

    const ranked = relatedData.default?.rankedList?.[0]?.rankedKeyword || [];

    const relatedQueries = ranked.map(item => ({
      term: item.query,
      value: item.value[0],
    }));

    return res.status(200).json({ query: q, relatedQueries });
  } catch (err) {
    console.error("Erro ao consultar Google Trends:", err);
    return res.status(500).json({ error: "Erro ao consultar Google Trends." });
  }
}
