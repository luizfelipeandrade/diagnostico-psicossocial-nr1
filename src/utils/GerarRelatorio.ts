import type { ResultadoDominio } from "../types/diagnostico";

export interface RelatorioCompleto {
  dataAvaliacao: string;
  setor: string;
  resultados: ResultadoDominio[];
  dadosPowerBI: Array<{
    DataAvaliacao: string;
    Setor: string;
    Dominio: string;
    MediaObtida: number;
    PercentualSatisfacao: number;
    ClassificacaoRisco: string;
    AcaoRecomendada: string;
  }>;
}

export function gerarRelatorioPGR(
  setor: string,
  resultados: ResultadoDominio[],
): RelatorioCompleto {
  const dataHoje = new Date().toLocaleDateString("pt-BR");

  // Formatação dos dados estruturados para Power BI (JSON/CSV)
  const dadosPowerBI = resultados.map((r: ResultadoDominio) => ({
    DataAvaliacao: new Date().toISOString(),
    Setor: setor,
    Dominio: r.dominio,
    MediaObtida: r.media,
    PercentualSatisfacao: r.percentual,
    ClassificacaoRisco: r.classificacao,
    AcaoRecomendada: r.acaoRecomendada,
  }));

  return {
    dataAvaliacao: dataHoje,
    setor,
    resultados,
    dadosPowerBI,
  };
}
