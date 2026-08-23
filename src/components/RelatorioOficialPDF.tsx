import React from "react";

// Interface padronizada aceitando tanto português quanto inglês para evitar incompatibilidade
export interface Item5W2H {
  oQue?: string;
  what?: string;
  porQue?: string;
  why?: string;
  onde?: string;
  where?: string;
  quem?: string;
  who?: string;
  quando?: string;
  when?: string;
  como?: string;
  how?: string;
  quantoCusta?: string;
  howMuch?: string;
}

interface RelatorioOficialPDFProps {
  nomeEmpresa: string;
  cnpj: string;
  emailContato: string;
  nomeSetor: string;
  mediaGlobal: string;
  totalRespostas: number;
  planoAcao: Item5W2H[];
  onFechar: () => void;
}

export const RelatorioOficialPDF: React.FC<RelatorioOficialPDFProps> = ({
  nomeEmpresa,
  cnpj,
  emailContato,
  nomeSetor,
  mediaGlobal,
  totalRespostas,
  planoAcao,
  onFechar,
}) => {
  const handleImprimir = () => {
    window.print();
  };

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relatorio-modal-backdrop">
      {/* BARRA SUPERIOR DE AÇÕES (Invisível na Impressão) */}
      <div className="relatorio-actions-bar no-print">
        <span>📄 Relatório Técnico Oficial - NR-1 / GRO</span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleImprimir}
          >
            🖨️ Imprimir / Salvar como PDF
          </button>
          <button type="button" className="btn-secondary" onClick={onFechar}>
            Fechar
          </button>
        </div>
      </div>

      {/* FOLHA FORMATADA EM A4 */}
      <div className="relatorio-folha-a4">
        {/* CABEÇALHO */}
        <header className="relatorio-header">
          <div>
            <h1 style={{ margin: 0, fontSize: "18pt", color: "#1e293b" }}>
              RELATÓRIO TÉCNICO DE AVALIAÇÃO PSICOSSOCIAL
            </h1>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "10pt",
                color: "#64748b",
              }}
            >
              Gerenciamento de Riscos Ocupacionais (GRO / PGR) - Norma
              Regulamentadora NR-1
            </p>
          </div>
          <div
            style={{ textAlign: "right", fontSize: "9pt", color: "#64748b" }}
          >
            <strong>Data de Emissão:</strong> {dataAtual}
          </div>
        </header>

        <hr
          style={{
            border: "none",
            borderTop: "2px solid #0284c7",
            margin: "16px 0",
          }}
        />

        {/* 1. DADOS DA ORGANIZAÇÃO */}
        <section style={{ marginBottom: "16px" }}>
          <h2 className="relatorio-subtitulo">
            1. Identificação da Empresa e Setor
          </h2>
          <div className="relatorio-grid-2">
            <div>
              <strong>Empresa / Razão Social:</strong>{" "}
              {nomeEmpresa || "Empresa Demonstrativa S.A."}
            </div>
            <div>
              <strong>CNPJ:</strong> {cnpj || "00.000.000/0001-00"}
            </div>
            <div>
              <strong>Setor Avaliado:</strong> {nomeSetor}
            </div>
            <div>
              <strong>E-mail de Contato / SST:</strong>{" "}
              {emailContato || "sst@empresa.com.br"}
            </div>
          </div>
        </section>

        {/* 2. DIAGNÓSTICO */}
        <section style={{ marginBottom: "16px" }}>
          <h2 className="relatorio-subtitulo">
            2. Amostragem e Diagnóstico Consolidado
          </h2>
          <div className="relatorio-kpi-box">
            <div>
              <span
                style={{ fontSize: "9pt", color: "#475569", display: "block" }}
              >
                Amostra Coletada
              </span>
              <strong style={{ fontSize: "14pt", color: "#0284c7" }}>
                {totalRespostas} Respostas
              </strong>
            </div>
            <div
              style={{ borderLeft: "1px solid #cbd5e1", paddingLeft: "16px" }}
            >
              <span
                style={{ fontSize: "9pt", color: "#475569", display: "block" }}
              >
                Índice Médio Geral
              </span>
              <strong style={{ fontSize: "14pt", color: "#16a34a" }}>
                {mediaGlobal} / 5.0
              </strong>
            </div>
            <div
              style={{ borderLeft: "1px solid #cbd5e1", paddingLeft: "16px" }}
            >
              <span
                style={{ fontSize: "9pt", color: "#475569", display: "block" }}
              >
                Status LGPD
              </span>
              <strong style={{ fontSize: "12pt", color: "#2563eb" }}>
                Conforme (Anônimo)
              </strong>
            </div>
          </div>
        </section>

        {/* 3. PLANO DE AÇÃO 5W2H */}
        <section style={{ marginBottom: "16px" }}>
          <h2 className="relatorio-subtitulo">
            3. Matriz de Plano de Ação Preventivo (5W2H)
          </h2>
          <table className="relatorio-tabela-5w2h">
            <thead>
              <tr>
                <th>O quê? (What)</th>
                <th>Por quê? (Why)</th>
                <th>Onde? (Where)</th>
                <th>Quem? (Who)</th>
                <th>Quando? (When)</th>
                <th>Como? (How)</th>
                <th>Custo (How Much)</th>
              </tr>
            </thead>
            <tbody>
              {planoAcao && planoAcao.length > 0 ? (
                planoAcao.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{item.oQue || item.what || "-"}</strong>
                    </td>
                    <td>{item.porQue || item.why || "-"}</td>
                    <td>{item.onde || item.where || "Setor Operacional"}</td>
                    <td>{item.quem || item.who || "-"}</td>
                    <td>{item.quando || item.when || "-"}</td>
                    <td>{item.como || item.how || "-"}</td>
                    <td>
                      {item.quantoCusta ||
                        item.howMuch ||
                        "Sem Custo Adicional"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      color: "#64748b",
                      padding: "12px",
                    }}
                  >
                    Nenhum ponto crítico identificado. Manter monitoramento
                    contínuo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* ASSINATURAS */}
        <footer style={{ marginTop: "40px" }}>
          <div className="relatorio-assinaturas">
            <div className="linha-assinatura">
              <span>Engenharia / Técnico de Segurança do Trabalho</span>
            </div>
            <div className="linha-assinatura">
              <span>Gestão do Setor / Representante da Empresa</span>
            </div>
          </div>
          <p
            style={{
              fontSize: "8pt",
              color: "#94a3b8",
              textAlign: "center",
              marginTop: "24px",
            }}
          >
            Documento emitido em conformidade com as diretrizes do GRO/PGR
            (NR-1).
          </p>
        </footer>
      </div>
    </div>
  );
};
