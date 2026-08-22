// src/components/EtapaObjetivo.tsx
import type {
  DadosFinanceiros,
  ObjetivoFinanceiro,
} from "../types/diagnostico";

interface EtapaObjetivoProps {
  dados: Partial<DadosFinanceiros>;
  aoAtualizar: (campos: Partial<DadosFinanceiros>) => void;
}

const OPCOES_OBJETIVO: { valor: ObjetivoFinanceiro; rotulo: string }[] = [
  { valor: "quitar-dividas", rotulo: "Quitar dívidas" },
  { valor: "reserva-emergencia", rotulo: "Criar reserva de emergência" },
  { valor: "investir", rotulo: "Começar a investir" },
  { valor: "comprar-bem", rotulo: "Comprar um bem (carro, casa...)" },
  { valor: "aposentadoria", rotulo: "Planejar aposentadoria" },
];

export function EtapaObjetivo({ dados, aoAtualizar }: EtapaObjetivoProps) {
  return (
    <div className="etapa">
      <h2>Qual é seu principal objetivo?</h2>

      <label htmlFor="objetivoPrincipal">Objetivo</label>
      <select
        id="objetivoPrincipal"
        value={dados.objetivoPrincipal ?? ""}
        onChange={(e) =>
          aoAtualizar({
            objetivoPrincipal: e.target.value as ObjetivoFinanceiro,
          })
        }
      >
        <option value="" disabled>
          Selecione uma opção
        </option>
        {OPCOES_OBJETIVO.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>

      <label htmlFor="prazoObjetivo">Prazo desejado</label>
      <select
        id="prazoObjetivo"
        value={dados.prazoObjetivo ?? ""}
        onChange={(e) => aoAtualizar({ prazoObjetivo: e.target.value })}
      >
        <option value="" disabled>
          Selecione uma opção
        </option>
        <option value="curto">Curto prazo (até 1 ano)</option>
        <option value="medio">Médio prazo (1 a 5 anos)</option>
        <option value="longo">Longo prazo (mais de 5 anos)</option>
      </select>
    </div>
  );
}
