export default async function handler(req, res) {
  try {
    const apiKey = process.env.YT_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "YT_API_KEY não configurada." });

    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Parâmetro 'q' obrigatório." });

    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("maxResults", "10");
    url.searchParams.set("q", q);

    const response = await fetch(url.toString());
    const data = await response.json();

    const results = (data.items || []).map(item => ({
      videoId: item.id?.videoId || null,
      title: item.snippet?.title || null,
      channel: item.snippet?.channelTitle || null,
      publishedAt: item.snippet?.publishedAt || null,
      thumbnail: item.snippet?.thumbnails?.high?.url
    }));

    res.status(200).json({
      query: q,
      totalResults: results.length,
      results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
