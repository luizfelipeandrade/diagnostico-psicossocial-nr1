// src/components/TelaResultado.tsx
import type { DiagnosticoIA } from "../types/diagnostico";

interface TelaResultadoProps {
  diagnostico: DiagnosticoIA;
  aoReiniciar: () => void;
}

export function TelaResultado({
  diagnostico,
  aoReiniciar,
}: TelaResultadoProps) {
  return (
    <div className="formulario-container resultado">
      <h2>Seu diagnóstico financeiro</h2>
      <p className="diagnostico-texto">{diagnostico.diagnostico}</p>

      <SecaoLista
        titulo="Pontos fortes"
        itens={diagnostico.pontosFortes}
        tipo="positivo"
      />
      <SecaoLista
        titulo="Pontos de atenção"
        itens={diagnostico.pontosAtencao}
        tipo="atencao"
      />
      <SecaoLista
        titulo="Recomendações"
        itens={diagnostico.recomendacoes}
        tipo="neutro"
      />
      <SecaoLista
        titulo="Próximos passos"
        itens={diagnostico.proximosPassos}
        tipo="neutro"
      />

      <button type="button" className="botao-reiniciar" onClick={aoReiniciar}>
        Fazer nova simulação
      </button>
    </div>
  );
}

interface SecaoListaProps {
  titulo: string;
  itens: string[];
  tipo: "positivo" | "atencao" | "neutro";
}

function SecaoLista({ titulo, itens, tipo }: SecaoListaProps) {
  if (!itens || itens.length === 0) return null;

  return (
    <div className={`secao-resultado secao-${tipo}`}>
      <h3>{titulo}</h3>
      <ul>
        {itens.map((item, indice) => (
          <li key={indice}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
