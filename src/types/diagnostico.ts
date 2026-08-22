export interface PerguntasNR1 {
  id: number;
  dominio: string;
  texto: string;
}

export interface RespostaItem {
  perguntaId: number;
  valor: number; // Escala Likert de 1 a 5
}

export interface ResultadoDominio {
  dominio: string;
  media: number;
  percentual: number;
  classificacao: string;
  acaoRecomendada: string;
}

export interface DadosRelatorioPGR {
  nomeEmpresa?: string;
  setor: string;
  ghe?: string;
  totalRespondentes: number;
  resultados: ResultadoDominio[];
  dataAvaliacao: string;
}
