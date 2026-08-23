import React from "react";
import { PERGUNTAS_NR1 } from "../data/perguntasNR1";

interface FormularioProps {
  indiceAtual: number;
  respostas: Record<number, number>;
  onResponder: (perguntaId: number, valor: number) => void;
  onProxima: () => void;
  onAnterior: () => void;
}

export const Formulario: React.FC<FormularioProps> = ({
  indiceAtual,
  respostas,
  onResponder,
  onProxima,
  onAnterior,
}) => {
  const pergunta = PERGUNTAS_NR1[indiceAtual];
  const respostaSelecionada = respostas[pergunta.id];
  const progresso = Math.round(
    ((indiceAtual + 1) / PERGUNTAS_NR1.length) * 100,
  );

  const opcoes = [
    { valor: 1, rotulo: "1 - Discordo Totalmente (Situação Crítica)" },
    { valor: 2, rotulo: "2 - Discordo Parcialmente" },
    { valor: 3, rotulo: "3 - Neutro / Às Vezes" },
    { valor: 4, rotulo: "4 - Concordo Parcialmente" },
    { valor: 5, rotulo: "5 - Concordo Totalmente (Ambiente Protetor)" },
  ];

  return (
    <div className="card-container">
      {/* Barra de Progresso */}
      <div style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "var(--text-secondary)",
            marginBottom: "6px",
          }}
        >
          <span>
            Questão {indiceAtual + 1} de {PERGUNTAS_NR1.length}
          </span>
          <span>{progresso}% concluído</span>
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            backgroundColor: "var(--border-color)",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progresso}%`,
              height: "100%",
              backgroundColor: "var(--primary-color)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Domínio e Pergunta */}
      <span
        style={{
          fontSize: "12px",
          fontWeight: "bold",
          color: "var(--primary-color)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {pergunta.dominio}
      </span>
      <h3
        style={{ margin: "8px 0 20px 0", fontSize: "18px", lineHeight: "1.4" }}
      >
        {pergunta.texto}
      </h3>

      {/* Grupo de Respostas Likert */}
      <div className="likert-group">
        {opcoes.map((op) => {
          const selecionado = respostaSelecionada === op.valor;
          return (
            <button
              key={op.valor}
              type="button"
              className={`likert-option ${selecionado ? "active" : ""}`}
              onClick={() => onResponder(pergunta.id, op.valor)}
            >
              <span>{op.rotulo}</span>
              {selecionado && <span>✓</span>}
            </button>
          );
        })}
      </div>

      {/* Botões de Navegação */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "24px",
        }}
      >
        <button
          className="btn-secondary"
          onClick={onAnterior}
          disabled={indiceAtual === 0}
          style={{
            opacity: indiceAtual === 0 ? 0.5 : 1,
            cursor: indiceAtual === 0 ? "not-allowed" : "pointer",
          }}
        >
          Anterior
        </button>

        <button
          className="btn-primary"
          onClick={onProxima}
          disabled={!respostaSelecionada}
          style={{
            opacity: !respostaSelecionada ? 0.5 : 1,
            cursor: !respostaSelecionada ? "not-allowed" : "pointer",
          }}
        >
          {indiceAtual === PERGUNTAS_NR1.length - 1 ? "Finalizar" : "Próxima"}
        </button>
      </div>
    </div>
  );
};
