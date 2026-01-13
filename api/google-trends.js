export default async function handler(req, res) {
  // ===== CONFIGURAÇÕES DO AGENTE =====
  const AGENT_VERSION = "3.0";
  const DEFAULT_COUNTRY = "global";
  const DEFAULT_LANGUAGE = "pt-BR";

  const country = req.query.country || DEFAULT_COUNTRY;
  const lang = req.query.lang || DEFAULT_LANGUAGE;

  // ===== MENSAGEM INICIAL =====
  const introMessage = {
    version: AGENT_VERSION,
    info: "Agente Inteligência Viral 3.0 - Monitor global de tendências e insights sociais.",
    status: "ativo",
    origem: "análise interna (modo offline)",
  };

  // ===== MOCK TEMPORÁRIO (simulação até reativar GoogleTrendsSearch) =====
  const simulatedTrends = [
    {
      rank: 1,
      topic: "Inteligência Artificial",
      category: "Tecnologia",
      impacto: "Alto",
      tendencia: "em alta",
      fontes: ["OpenAI", "Forbes", "TechCrunch"],
    },
    {
      rank: 2,
      topic: "ChatGPT 2026",
      category: "IA e Comunicação",
      impacto: "Alto",
      tendencia: "em expansão",
      fontes: ["Google News", "BBC", "NYTimes"],
    },
    {
      rank: 3,
      topic: "Sustentabilidade e Clima",
      category: "Sociedade",
      impacto: "Médio",
      tendencia: "constante",
      fontes: ["ONU", "Reuters", "BBC"],
    },
  ];

  // ===== SIMULAÇÃO DE LÓGICA DE ANÁLISE =====
  const insightsGerados = simulatedTrends.map((t) => ({
    topico: t.topic,
    status: t.tendencia,
    impacto: t.impacto,
    analise:
      t.impacto === "Alto"
        ? `🚀 O tema ${t.topic} está em forte ascensão global.`
        : `📊 O tema ${t.topic} mantém relevância estável.`,
    fontes: t.fontes,
  }));

  // ===== RESPOSTA FINAL =====
  return res.status(200).json({
    agente: introMessage,
    parametros: { country, lang },
    resultados: insightsGerados,
    observacao:
      "Esta versão roda em modo offline (sem GoogleTrendsSearch). A integração com RapidAPI pode ser reativada na v4.0.",
  });
}
