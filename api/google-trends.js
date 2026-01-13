export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Parâmetro 'q' obrigatório." });
  }

  try {
    // 🔥 Nova estratégia: usar proxy aberto que converte resposta Trends em JSON
    const url = `https://trends-api-proxy.vercel.app/api/trends?q=${encodeURIComponent(q)}&geo=BR`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.relatedQueries) {
      throw new Error("Resposta inválida do proxy Trends.");
    }

    // 🔄 Normaliza estrutura de resposta
    const relatedQueries = data.relatedQueries.map((item) => ({
      term: item.query,
      value: item.value,
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
