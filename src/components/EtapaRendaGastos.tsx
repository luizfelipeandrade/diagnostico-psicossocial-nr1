// src/components/EtapaRendaGastos.tsx
import type { DadosFinanceiros } from "../types/diagnostico";

interface EtapaRendaGastosProps {
  dados: Partial<DadosFinanceiros>;
  aoAtualizar: (campos: Partial<DadosFinanceiros>) => void;
}

export function EtapaRendaGastos({
  dados,
  aoAtualizar,
}: EtapaRendaGastosProps) {
  return (
    <div className="etapa">
      <h2>Vamos começar pela sua renda e gastos</h2>
      <p className="etapa-descricao">
        Esses números formam a base do diagnóstico.
      </p>

      <label htmlFor="rendaMensal">Renda mensal (R$)</label>
      <input
        id="rendaMensal"
        type="number"
        min={0}
        value={dados.rendaMensal ?? ""}
        onChange={(e) => {
          const valor = e.target.value;
          aoAtualizar({
            rendaMensal: valor === "" ? undefined : Number(valor),
          });
        }}
        placeholder="Ex: 3500"
      />

      <label htmlFor="gastosFixos">Gastos fixos mensais (R$)</label>
      <input
        id="gastosFixos"
        type="number"
        min={0}
        value={dados.gastosFixos ?? ""}
        onChange={(e) => {
          const valor = e.target.value;
          aoAtualizar({
            gastosFixos: valor === "" ? undefined : Number(valor),
          });
        }}
        placeholder="Aluguel, contas, etc."
      />

      <label htmlFor="gastosVariaveis">Gastos variáveis mensais (R$)</label>
      <input
        id="gastosVariaveis"
        type="number"
        min={0}
        value={dados.gastosVariaveis ?? ""}
        onChange={(e) => {
          const valor = e.target.value;
          aoAtualizar({
            gastosVariaveis: valor === "" ? undefined : Number(valor),
          });
        }}
        placeholder="Lazer, compras, etc."
      />
    </div>
  );
}
