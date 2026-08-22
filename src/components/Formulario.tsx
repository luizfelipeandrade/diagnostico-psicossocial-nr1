import React from "react";
import { PERGUNTAS_NR1, ESCALA_LIKERT } from "../data/perguntasNR1";

interface FormularioProps {
  indiceAtual: number;
  respostas: Record<number, number>;
  onResponder: (perguntaId: number, valor: number) => void;
  onProxima: () => void;
  onAnterior: () => void;
}

export const FormularioDiagnostico: React.FC<FormularioProps> = ({
  indiceAtual,
  respostas,
  onResponder,
  onProxima,
  onAnterior,
}) => {
  const pergunta = PERGUNTAS_NR1[indiceAtual];
  const totalPerguntas = PERGUNTAS_NR1.length;

  return (
    <div className="card-diagnostico">
      <div className="progresso">
        <span>Domínio: {pergunta.dominio}</span>
        <span>
          Pergunta {indiceAtual + 1} de {totalPerguntas}
        </span>
      </div>

      <h3 className="pergunta-texto">{pergunta.texto}</h3>

      <div className="opcoes-likert">
        {ESCALA_LIKERT.map((opcao) => (
          <button
            key={opcao.valor}
            className={`btn-opcao ${respostas[pergunta.id] === opcao.valor ? "selecionado" : ""}`}
            onClick={() => onResponder(pergunta.id, opcao.valor)}
          >
            {opcao.rotulo}
          </button>
        ))}
      </div>

      <div className="botoes-navegacao">
        <button onClick={onAnterior} disabled={indiceAtual === 0}>
          Anterior
        </button>
        <button onClick={onProxima} disabled={!respostas[pergunta.id]}>
          {indiceAtual === totalPerguntas - 1 ? "Finalizar" : "Próxima"}
        </button>
      </div>
    </div>
  );
};

// Aliases para resolver conflitos de importação no App.tsx
export const Formulario = FormularioDiagnostico;
export default FormularioDiagnostico;
