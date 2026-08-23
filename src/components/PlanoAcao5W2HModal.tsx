import React, { useState } from "react";
import type { Item5W2H } from "../utils/planoAcao5W2H";

interface PlanoAcao5W2HModalProps {
  planoInicial: Item5W2H[];
  nomeSetor: string;
  onFechar: () => void;
}

export const PlanoAcao5W2HModal: React.FC<PlanoAcao5W2HModalProps> = ({
  planoInicial,
  nomeSetor,
  onFechar,
}) => {
  const [itens, setItens] = useState<Item5W2H[]>(planoInicial);

  const handleStatusChange = (id: string, novoStatus: Item5W2H["status"]) => {
    setItens((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: novoStatus } : item,
      ),
    );
  };

  const getBadgeRisco = (risco: Item5W2H["nivelRisco"]) => {
    switch (risco) {
      case "CRITICO":
        return { bg: "#ef4444", text: "#fff", label: "CRÍTICO" };
      case "ALTO":
        return { bg: "#f97316", text: "#fff", label: "ALTO" };
      case "MODERADO":
        return { bg: "#eab308", text: "#000", label: "MODERADO" };
      default:
        return { bg: "#22c55e", text: "#fff", label: "BAIXO" };
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // ← Alterado de 'justify' para 'justifyContent'
        zIndex: 1100,
        padding: "20px",
      }}
    >
      <div
        className="card-container"
        style={{
          maxWidth: "1000px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "20px" }}>
              📋 Plano de Ação 5W2H (GRO / PGR)
            </h2>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              Ações recomendadas para controle de riscos psicossociais no setor:{" "}
              <strong>{nomeSetor}</strong>
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={onFechar}
            style={{ padding: "6px 12px" }}
          >
            ✕ Fechar
          </button>
        </div>

        {itens.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              border: "1px dashed var(--border-color)",
              borderRadius: "8px",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>🎉</div>
            <strong style={{ display: "block", color: "#22c55e" }}>
              Nenhum Risco Crítico ou Moderado Detectado!
            </strong>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                margin: "8px 0 0 0",
              }}
            >
              Este setor apresenta níveis de risco dentro dos parâmetros
              aceitáveis. Não há necessidade imediata de plano de ação
              preventivo no GRO.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {itens.map((item) => {
              const badge = getBadgeRisco(item.nivelRisco);
              return (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    padding: "16px",
                    backgroundColor: "var(--option-bg)",
                  }}
                >
                  {/* Cabeçalho do Card */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <strong style={{ fontSize: "16px" }}>
                        {item.dominioNome}
                      </strong>
                      <span
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.text,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Selector de Status */}
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(
                          item.id,
                          e.target.value as Item5W2H["status"],
                        )
                      }
                      className="input-field"
                      style={{
                        width: "auto",
                        padding: "4px 8px",
                        fontSize: "12px",
                      }}
                    >
                      <option value="Pendente">⏳ Pendente</option>
                      <option value="Em Andamento">🔄 Em Andamento</option>
                      <option value="Concluido">✅ Concluído</option>
                    </select>
                  </div>

                  {/* Grid 5W2H */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "12px",
                      fontSize: "13px",
                    }}
                  >
                    <div>
                      <strong>🎯 What (O que fazer):</strong>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.what}
                      </p>
                    </div>
                    <div>
                      <strong>💡 Why (Por que fazer):</strong>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.why}
                      </p>
                    </div>
                    <div>
                      <strong>⚙️ How (Como fazer):</strong>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.how}
                      </p>
                    </div>
                    <div>
                      <strong>👤 Who (Responsável):</strong>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.who}
                      </p>
                    </div>
                    <div>
                      <strong>📅 When (Prazo):</strong>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.when}
                      </p>
                    </div>
                    <div>
                      <strong>💰 How Much (Custo estimado):</strong>
                      <p
                        style={{
                          margin: "2px 0 0 0",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.howMuch}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
