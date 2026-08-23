export interface ResultadoDominio {
  id: string;
  nome: string;
  pontuacao: number;
  nivelRisco: "BAIXO" | "MODERADO" | "ALTO" | "CRITICO";
}

export interface MapeamentoPergunta {
  id: number;
  dominioId: string;
  dominioNome: string;
  inverter?: boolean; // Caso a pergunta tenha pontuação invertida
}

// Mapeamento padrão dos domínios da NR-1 / COPSOQ
export const DOMINIOS_NR1: Record<string, string> = {
  ritmo_carga: "Ritmo e Carga de Trabalho",
  autonomia: "Autonomia e Controle",
  suporte_lideranca: "Suporte da Liderança",
  relacoes_interpessoais: "Relações Interpessoais e Clima",
  reconhecimento: "Reconhecimento e Valorização",
  clareza_papel: "Clareza de Papel e Expectativas",
};

/**
 * Calcula a média por domínio e classifica o nível de risco de acordo com os critérios da NR-1
 */
export function processarResultadosNR1(
  respostas: Record<number, number>,
): ResultadoDominio[] {
  // Estrutura para acumular soma e quantidade por domínio
  const acumulador: Record<
    string,
    { soma: number; qtd: number; nome: string }
  > = {
    ritmo_carga: { soma: 0, qtd: 0, nome: DOMINIOS_NR1.ritmo_carga },
    autonomia: { soma: 0, qtd: 0, nome: DOMINIOS_NR1.autonomia },
    suporte_lideranca: {
      soma: 0,
      qtd: 0,
      nome: DOMINIOS_NR1.suporte_lideranca,
    },
    relacoes_interpessoais: {
      soma: 0,
      qtd: 0,
      nome: DOMINIOS_NR1.relacoes_interpessoais,
    },
    reconhecimento: { soma: 0, qtd: 0, nome: DOMINIOS_NR1.reconhecimento },
    clareza_papel: { soma: 0, qtd: 0, nome: DOMINIOS_NR1.clareza_papel },
  };

  // Mapeamento simples das perguntas para cada domínio (assume blocos sequenciais ou distribuição uniforme)
  Object.entries(respostas).forEach(([perguntaIdStr, valor]) => {
    const pId = Number(perguntaIdStr);
    let dominioKey = "ritmo_carga";

    // Regra de atribuição por id da pergunta
    if (pId >= 1 && pId <= 3) dominioKey = "ritmo_carga";
    else if (pId >= 4 && pId <= 6) dominioKey = "autonomia";
    else if (pId >= 7 && pId <= 9) dominioKey = "suporte_lideranca";
    else if (pId >= 10 && pId <= 12) dominioKey = "relacoes_interpessoais";
    else if (pId >= 13 && pId <= 15) dominioKey = "reconhecimento";
    else dominioKey = "clareza_papel";

    if (acumulador[dominioKey]) {
      acumulador[dominioKey].soma += valor;
      acumulador[dominioKey].qtd += 1;
    }
  });

  // Calcula médias e define os níveis de risco
  return Object.entries(acumulador).map(([id, dados]) => {
    const media =
      dados.qtd > 0 ? Number((dados.soma / dados.qtd).toFixed(1)) : 0;
    let nivelRisco: ResultadoDominio["nivelRisco"] = "BAIXO";

    // Classificação de Risco (Escala Likert 1 a 5)
    if (media >= 4.0) {
      nivelRisco = "CRITICO";
    } else if (media >= 3.2) {
      nivelRisco = "ALTO";
    } else if (media >= 2.5) {
      nivelRisco = "MODERADO";
    } else {
      nivelRisco = "BAIXO";
    }

    return {
      id,
      nome: dados.nome,
      pontuacao: media,
      nivelRisco,
    };
  });
}
