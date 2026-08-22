import type { DadosFinanceiros, EstadoFormulario } from "../types/diagnostico";
import { usePersistencia } from "./usePersistencia";

const TOTAL_ETAPAS = 4;

export function useFormularioFinanceiro() {
  const [estado, setEstado] = usePersistencia<EstadoFormulario>(
    "educador-financeiro:formulario",
    { etapaAtual: 1, dados: {}, concluido: false },
  );

  function atualizarDados(CamposNovos: Partial<DadosFinanceiros>) {
    setEstado((prev) => ({
      ...prev,
      dados: { ...prev.dados, ...CamposNovos },
    }));
  }

  function proximaEtapa() {
    setEstado((prev) => {
      const ehUltimaEtapa = prev.etapaAtual >= TOTAL_ETAPAS;
      return {
        ...prev,
        etapaAtual: ehUltimaEtapa ? prev.etapaAtual : prev.etapaAtual + 1,
        concluido: ehUltimaEtapa,
      };
    });
  }

  function etapaAnterior() {
    setEstado((prev) => ({
      ...prev,
      etapaAtual: Math.max(1, prev.etapaAtual - 1),
    }));
  }
  function reiniciar() {
    setEstado({ etapaAtual: 1, dados: {}, concluido: false });
  }
  return {
    estado,
    totalEtapas: TOTAL_ETAPAS,
    atualizarDados,
    proximaEtapa,
    etapaAnterior,
    reiniciar,
  };
}
