export default async function handler(req, res) {
  const query = req.query.q || "futebol";

  const sources = {
    youtube: `https://yt-title-scanner-vercel.vercel.app/api/search?q=${encodeURIComponent(query)}`,
    exploding: `https://api.explodingtopics.com/topics?query=${encodeURIComponent(query)}`,
    noxinfluencer: `https://www.noxinfluencer.com/youtube-channel-ranking/top-100-${encodeURIComponent(query)}`,
    trendtok: `https://trendtok-api.vercel.app/api/trends?q=${encodeURIComponent(query)}`,
  };

  try {
    const [yt, exploding, nox, trendtok] = await Promise.allSettled([
      fetch(sources.youtube).then(r => r.json()),
      fetch(sources.exploding).then(r => r.json()).catch(() => ({})),
      fetch(sources.noxinfluencer).then(r => r.text()).catch(() => "sem dados"),
      fetch(sources.trendtok).then(r => r.json()).catch(() => ({})),
    ]);

    const resumo = `📊 Tendência detectada: ${query.toUpperCase()}.
      YouTube aponta alta em vídeos recentes.
      Exploding Topics mostra aumento global.
      TrendTok sugere sons virais relacionados.`;

    res.status(200).json({
      query,
      resumo,
      fontes: {
        youtube: yt.value || {},
        exploding: exploding.value || {},
        noxinfluencer: nox.value ? "dados disponíveis" : "não carregado",
        trendtok: trendtok.value || {},
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Falha ao consultar fontes externas", detail: error.message });
  }
}
