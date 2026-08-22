export interface PerguntasNR1 {
  id: number;
  dominio: string;
  texto: string;
}

export const PERGUNTAS_NR1: PerguntasNR1[] = [
  // Domínio 1 : Carga e Ritmo
  {
    id: 1,
    dominio: "Carga de Trabalho e Ritmo",
    texto:
      "Tenho tempo suficiente para realizar minhas tarefas diárias com qualidade e sem correria excessiva.",
  },
  {
    id: 2,
    dominio: "Carga de Trabalho e Ritmo",
    texto:
      "O volume de trabalho exigido da minha função é adequado e suportável.",
  },
  {
    id: 3,
    dominio: "Carga de Trabalho e Ritmo",
    texto:
      "Raramente preciso fazer horas extras ou levar trabalho para cumprir minhas metas.",
  },
  {
    id: 4,
    dominio: "Carga de Trabalho e Ritmo",
    texto:
      "O ritmo exigido no meu trabalho não gera esgotamento físico ou mental ao final da jornada.",
  },

  //Domínio 2: Autonomia e Clareza
  {
    id: 5,
    dominio: "Autonomia, Controle e Clareza",
    texto:
      "Possuo autonomia para decidir como organizar e executar minhas tarefas rotineiras.",
  },
  {
    id: 6,
    dominio: "Autonomia, Controle e Clareza",
    texto:
      "Tenho clareza sobre minhas responsabalidadades, metas e o que a empresa espera do meu desempenho.",
  },
  {
    id: 7,
    dominio: "Autonomia, Controle e Clareza",
    texto:
      "Tenho oportunidades de expressasr minhas ideias e propor melhorias nos processos do meu setor. ",
  },
  {
    id: 8,
    dominio: "Autonomia, Controle e Clareza",
    texto:
      "As mudanças nas minhas tarefas ou processos de trabalho são comunicadas com antecedência e clareza.",
  },

  //Domínio 3: Suporte Social e Liderança
  {
    id: 9,
    dominio: "Suporte Social e Liderança",
    texto:
      "Recebo o apoio e orientação necessários do meu gestor imediato para realizar meu trabalho.",
  },
  {
    id: 10,
    dominio: "Suporte Social e Liderança",
    texto:
      "O ambiente de trabalho no meu setor é respeitoso e livre de situações de assédio ou hostilidade.",
  },
  {
    id: 11,
    dominio: "Suporte Social e Liderança",
    texto:
      "Existe cooperação e bom trabalho em equipe entre meus colegas de trabalho.",
  },
  {
    id: 12,
    dominio: "Suporte Social e Liderança",
    texto:
      "Sinto que posso com a liderança sobre dificuldades ou problemas operacionais sem receio de retaliação.",
  },

  //Domínio 4: Reconhecimento e Justiça
  {
    id: 13,
    dominio: "Reconhecimento e Valorização",
    texto:
      "Sinto que meu esforço e dedicação ao trabalho são reconhecidos pela empresa/liderança.",
  },
  {
    id: 14,
    dominio: "Reconhecimento e Valorização",
    texto:
      "As oportunidades de crescimento, avaliação de desempenho e recomepnsas são distribuídos de forma justa no meu setor.",
  },
  {
    id: 15,
    dominio: "Reconhecimento e Valorização",
    texto: "Recebo feedback construtivo periodicamente sobre o meu trabalho.",
  },
  {
    id: 16,
    dominio: "Reconhecimento e Valorização",
    texto:
      "Considero as condições físicas, equipamentos e ferramentas disponibilizadas adequadas para realizar meu trabalho",
  },

  //Domínio 5: Saúde e Bem-Estar
  {
    id: 17,
    dominio: "Saúde, Equilíbrio e Bem-Estar",
    texto:
      "Consigo desligar das preocupações do trabalho nos meus momentos de folga e cescanso.",
  },
  {
    id: 18,
    dominio: "Saúde, Equilíbrio e Bem-Estar",
    texto:
      "As exigências do meu trabalho não afetam negativamente minha saúde física ou mental.",
  },
  {
    id: 19,
    dominio: "Saúde, Equilíbrio e Bem-Estar",
    texto:
      "A empresa demonstra preocupação genuína com o bem-estar e a saúde dos colaboradores.",
  },
  {
    id: 20,
    dominio: "Saúde, Equilíbrio e Bem-Estar",
    texto:
      "Sinto-me seguro e motivado para continuar trabalhando nesta empresa nos próximos anos.",
  },
];

export const ESCALA_LIKERT = [
  { valor: 1, rotulo: "1 - Discordo Totalmente" },
  { valor: 2, rotulo: "2 - Discordo" },
  { valor: 3, rotulo: "3 - Neutro" },
  { valor: 4, rotulo: "4 - Concordo" },
  { valor: 5, rotulo: "5 - Concordo Totalmente" },
];
