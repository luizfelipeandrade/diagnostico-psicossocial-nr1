import type { ResultadoDominio } from "./calculoNR1";

export interface Item5W2H {
  id: string;
  dominioId: string;
  dominioNome: string;
  nivelRisco: "BAIXO" | "MODERADO" | "ALTO" | "CRITICO";

  // 5W2H
  what: string; // O que será feito?
  why: string; // Por que será feito?
  where: string; // Onde será executado?
  when: string; // Quando / Prazo?
  who: string; // Quem é o responsável?
  how: string; // Como será feito?
  howMuch: string; // Quanto custará?

  status: "Pendente" | "Em Andamento" | "Concluido";
}

/**
  Matriz de ações recomendadas por domínio e nível de risco para adequação à NR-1 / GRO
 */
export function gerarPlanoAcao5W2H(
  resultados: ResultadoDominio[],
  nomeEmpresa: string,
  nomeSetor: string,
): Item5W2H[] {
  const plano: Item5W2H[] = [];

  resultados.forEach((res) => {
    // Só gera ações para riscos que necessitem de intervenção (Moderado, Alto ou Crítico)
    if (res.nivelRisco === "BAIXO") return;

    let acao: Omit<
      Item5W2H,
      "id" | "dominioId" | "dominioNome" | "nivelRisco" | "status"
    >;

    const onde = `Setor ${nomeSetor} - ${nomeEmpresa}`;

    switch (res.id) {
      case "ritmo_carga":
        acao = {
          what: "Redesenho de processos e revisão do volume de demandas de trabalho.",
          why: "Mitigar sobrecarga quantitativa e reduzir episódios de estresse cronificado.",
          where: onde,
          when: res.nivelRisco === "CRITICO" ? "30 dias" : "60 dias",
          who: "Gestor do Setor / RH / Consultoria SST",
          how: "Realizar cronoanálise das tarefas, priorizar entregas e redefinir metas diárias/semanais.",
          howMuch: "Custo interno (Horas de alinhamento)",
        };
        break;

      case "autonomia":
        acao = {
          what: "Implementação de programa de autonomia operacional e delegação de decisões.",
          why: "Aumentar a margem de manobra do colaborador na execução do trabalho.",
          where: onde,
          when: "60 dias",
          who: "Liderança Direta",
          how: "Permitir flexibilidade na ordem das tarefas e criar comitê de sugestões de melhoria.",
          howMuch: "Sem custo direto",
        };
        break;

      case "suporte_lideranca":
        acao = {
          what: "Treinamento de Liderança Humanizada e Gestão de Riscos Psicossociais.",
          why: "Fortalecer a escuta ativa e o suporte gestor-equipe na prevenção do burnout.",
          where: onde,
          when: res.nivelRisco === "CRITICO" ? "15 dias" : "45 dias",
          who: "RH / Treinamento & Desenvolvimento / Consultor Externo",
          how: "Workshop prático de 8h sobre feedback construtivo, gestão de clima e apoio interpessoal.",
          howMuch: "R$ 1.500,00 - R$ 3.000,00",
        };
        break;

      case "relacoes_interpessoais":
        acao = {
          what: "Estabelecimento do Código de Conduta e Canal de Acolhimento Ético.",
          why: "Prevenir episódios de assédio moral, conflitos e deterioração do clima organizacional.",
          where: onde,
          when: "30 dias",
          who: "Comitê de Ética / CIPA / RH",
          how: "Elaborar canal confidencial de manifestações e promover palestras sobre comunicação não-violenta (CNV).",
          howMuch: "R$ 800,00 (Material / Palestra)",
        };
        break;

      case "reconhecimento":
        acao = {
          what: "Estruturação do Programa de Reconhecimento e Feedback Contínuo.",
          why: "Aumentar a percepção de valorização e engajamento profissional.",
          where: onde,
          when: "60 dias",
          who: "RH / Gestão de Pessoas",
          how: "Instituir reuniões quinzenais de 1-on-1 para alinhamento de expectativas e elogios formais.",
          howMuch: "Custo interno",
        };
        break;

      case "clareza_papel":
        acao = {
          what: "Mapeamento e Descrição Formal de Cargos e Responsabilidades (JDF).",
          why: "Eliminar ambiguidade de papéis e conflito de atribuições.",
          where: onde,
          when: "45 dias",
          who: "RH / Gestores de Setor",
          how: "Documentar e alinhar individualmente as entregas esperadas de cada função no setor.",
          howMuch: "Custo interno",
        };
        break;

      default:
        acao = {
          what: `Plano de contingência e monitoramento psicossocial para o domínio ${res.nome}.`,
          why: "Adequação aos requisitos do GRO/PGR (NR-1).",
          where: onde,
          when: "60 dias",
          who: "Equipe de SST",
          how: "Aplicação de checklist específico e rodada de conversa.",
          howMuch: "Custo interno",
        };
    }

    plano.push({
      id: Math.random().toString(36).substring(2, 9),
      dominioId: res.id,
      dominioNome: res.nome,
      nivelRisco: res.nivelRisco,
      status: "Pendente",
      ...acao,
    });
  });

  return plano;
}
