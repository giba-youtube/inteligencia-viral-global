export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Parâmetro 'q' é obrigatório." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Cabeçalhos “humanos” pra enganar o Google
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36",
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
      "Referer": "https://trends.google.com.br/trends/explore",
    };

    // 1️⃣ Solicita os widgets da busca
    const exploreUrl = `https://trends.google.com/trends/api/explore?hl=pt-BR&tz=-180&req={"comparisonItem":[{"keyword":"${query}","geo":"BR","time":"now 7-d"}],"category":0,"property":""}`;
    const exploreResp = await fetch(exploreUrl, { headers });
    const exploreTxt = await exploreResp.text();

    if (!exploreTxt.includes("widgets"))
      throw new Error("A resposta do Google não contém widgets.");

    const exploreJson = JSON.parse(exploreTxt.replace(")]}',", ""));
    const widget = exploreJson.widgets.find((w) => w.id === "RELATED_QUERIES");
    if (!widget) throw new Error("Widget RELATED_QUERIES não encontrado.");

    const token = widget.token;
    const reqObj = widget.request;

    // 2️⃣ Consulta os termos relacionados
    const relatedUrl = `https://trends.google.com/trends/api/widgetdata/relatedsearches?hl=pt-BR&tz=-180&req=${encodeURIComponent(
      JSON.stringify(reqObj)
    )}&token=${token}`;

    const relResp = await fetch(relatedUrl, { headers });
    const relTxt = await relResp.text();

    if (!relTxt.startsWith(")]}',")) throw new Error("Google retornou HTML em vez de JSON.");
    const relJson = JSON.parse(relTxt.replace(")]}',", ""));

    const ranked = relJson.default.rankedList[0].rankedKeyword.map((r) => ({
      term: r.query,
      value: r.value[0],
    }));

    return new Response(
      JSON.stringify({ query, relatedQueries: ranked }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Falha ao consultar Google Trends.",
        details: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
