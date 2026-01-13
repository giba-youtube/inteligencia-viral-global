import googleTrends from "google-trends-api";

export default async function handler(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Parâmetro 'q' obrigatório." });

    const results = await googleTrends.relatedQueries({
      keyword: q,
      hl: "pt-BR",
      geo: "BR",
      timeframe: "now 7-d",
      gprop: "youtube"
    });

    const parsed = JSON.parse(results);

    const relatedQueries = (parsed?.default?.rankedList?.[0]?.rankedKeyword || [])
      .slice(0, 10)
      .map(item => ({
        term: item.query,
        value: item.value[0]
      }));

    const relatedTopics = (parsed?.default?.rankedList?.[1]?.rankedKeyword || [])
      .slice(0, 10)
      .map(item => item.query);

    return res.status(200).json({
      query: q,
      relatedTopics,
      relatedQueries
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao consultar Google Trends." });
  }
}
