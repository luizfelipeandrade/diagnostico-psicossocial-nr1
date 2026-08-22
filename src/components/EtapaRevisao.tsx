// src/components/EtapaRevisao.tsx
import type { DadosFinanceiros } from "../types/diagnostico";

interface EtapaRevisaoProps {
  dados: Partial<DadosFinanceiros>;
}

export function EtapaRevisao({ dados }: EtapaRevisaoProps) {
  return (
    <div className="etapa">
      <h2>Revise seus dados</h2>
      <p className="etapa-descricao">
        Confira antes de gerar seu diagnóstico com IA.
      </p>

      <ul className="lista-revisao">
        <li>Renda mensal: R$ {dados.rendaMensal ?? 0}</li>
        <li>Gastos fixos: R$ {dados.gastosFixos ?? 0}</li>
        <li>Gastos variáveis: R$ {dados.gastosVariaveis ?? 0}</li>
        <li>Dívidas: R$ {dados.dividas ?? 0}</li>
        <li>Reserva de emergência: R$ {dados.reservaEmergencia ?? 0}</li>
        <li>Objetivo: {dados.objetivoPrincipal ?? "não informado"}</li>
        <li>Prazo: {dados.prazoObjetivo ?? "não informado"}</li>
      </ul>
    </div>
  );
}
