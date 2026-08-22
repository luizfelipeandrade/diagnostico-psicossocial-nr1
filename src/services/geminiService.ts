// src/services/geminiService.ts
import type { DadosFinanceiros, DiagnosticoIA } from "../types/diagnostico";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function montarPrompt(dados: DadosFinanceiros): string {
  return `
Você é um educador financeiro. Analise os dados abaixo e gere um diagnóstico.

Dados financeiros:
- Renda mensal: R$ ${dados.rendaMensal}
- Gastos fixos: R$ ${dados.gastosFixos}
- Gastos variáveis: R$ ${dados.gastosVariaveis}
- Dívidas: R$ ${dados.dividas}
- Reserva de emergência: R$ ${dados.reservaEmergencia}
- Objetivo principal: ${dados.objetivoPrincipal}
- Prazo do objetivo: ${dados.prazoObjetivo}

Responda APENAS em formato JSON válido, sem markdown, seguindo exatamente esta estrutura:
{
  "diagnostico": "um parágrafo resumindo a situação financeira atual",
  "pontosFortes": ["ponto 1", "ponto 2"],
  "pontosAtencao": ["ponto 1", "ponto 2"],
  "recomendacoes": ["recomendação 1", "recomendação 2", "recomendação 3"],
  "proximosPassos": ["passo 1", "passo 2", "passo 3"]
}

Use linguagem acessível, sem jargões técnicos. Seja específico com os números fornecidos.
`.trim();
}

export async function gerarDiagnostico(
  dados: DadosFinanceiros,
): Promise<DiagnosticoIA> {
  if (!API_KEY) {
    throw new Error(
      "Chave da API do Gemini não configurada. Verifique o arquivo .env",
    );
  }

  const resposta = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: montarPrompt(dados) }] }],
    }),
  });

  if (!resposta.ok) {
    throw new Error(`Erro na API do Gemini: ${resposta.status}`);
  }

  const json = await resposta.json();
  const textoResposta: string | undefined =
    json.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textoResposta) {
    throw new Error("A API não retornou um diagnóstico válido.");
  }

  const textoLimpo = textoResposta
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(textoLimpo) as DiagnosticoIA;
  } catch {
    throw new Error("Não foi possível interpretar a resposta da IA.");
  }
}
