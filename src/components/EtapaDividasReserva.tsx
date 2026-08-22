// src/components/EtapaDividasReserva.tsx
import type { DadosFinanceiros } from "../types/diagnostico";

interface EtapaDividasReservaProps {
  dados: Partial<DadosFinanceiros>;
  aoAtualizar: (campos: Partial<DadosFinanceiros>) => void;
}

export function EtapaDividasReserva({
  dados,
  aoAtualizar,
}: EtapaDividasReservaProps) {
  return (
    <div className="etapa">
      <h2>Agora, dívidas e reserva de emergência</h2>
      <p className="etapa-descricao">
        Isso nos ajuda a entender sua segurança financeira atual.
      </p>

      <label htmlFor="dividas">Total de dívidas atuais (R$)</label>
      <input
        id="dividas"
        type="number"
        min={0}
        value={dados.dividas ?? ""}
        onChange={(e) => {
          const valor = e.target.value;
          aoAtualizar({ dividas: valor === "" ? undefined : Number(valor) });
        }}
        placeholder="0 se não tiver dívidas"
      />

      <label htmlFor="reservaEmergencia">
        Reserva de emergência atual (R$)
      </label>
      <input
        id="reservaEmergencia"
        type="number"
        min={0}
        value={dados.reservaEmergencia ?? ""}
        onChange={(e) => {
          const valor = e.target.value;
          aoAtualizar({
            reservaEmergencia: valor === "" ? undefined : Number(valor),
          });
        }}
        placeholder="0 se ainda não tiver"
      />
    </div>
  );
}
