import React, { useState } from "react";
import type { DadosEmpresa, Setor } from "../types/empresa";
import {
  obterRespostasPorSetor,
  type RespostaSetor,
} from "../utils/armazenamento";
import { processarResultadosNR1 } from "../utils/calculoNR1";
import { gerarPlanoAcao5W2H, type Item5W2H } from "../utils/planoAcao5W2H";
import { PlanoAcao5W2HModal } from "./PlanoAcao5W2HModal";

export const PainelEmpresa: React.FC = () => {
  const [empresa, setEmpresa] = useState<
    DadosEmpresa & { emailContato: string }
  >({
    nomeEmpresa: "",
    cnpj: "",
    emailContato: "",
    setores: [],
  });
  const [novoSetor, setNovoSetor] = useState("");
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [qrCodeSetor, setQrCodeSetor] = useState<Setor | null>(null);
  const [setorSelecionadoRelatorio, setSetorSelecionadoRelatorio] =
    useState<Setor | null>(null);
  const [respostasDoSetor, setRespostasDoSetor] = useState<RespostaSetor[]>([]);

  // Estados do Plano de Ação 5W2H
  const [planoAcaoAtual, setPlanoAcaoAtual] = useState<Item5W2H[] | null>(null);
  const [mostrarModalPlano, setMostrarModalPlano] = useState(false);

  const MINIMO_RESPOSTAS_LGPD = 5;

  const formatarCNPJ = (value: string) => {
    const apenasNumeros = value.replace(/\D/g, "").slice(0, 14);
    return apenasNumeros
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmpresa((prev) => ({ ...prev, cnpj: formatarCNPJ(e.target.value) }));
  };

  const handleAdicionarSetor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoSetor.trim()) return;

    const idSetor = Math.random().toString(36).substring(2, 8);
    const urlBase = window.location.origin;
    const itemSetor: Setor = {
      id: idSetor,
      nome: novoSetor,
      linkAnonimo: `${urlBase}/pesquisa?setor=${idSetor}&empresa=${encodeURIComponent(empresa.nomeEmpresa || "empresa")}`,
    };

    setEmpresa((prev) => ({
      ...prev,
      setores: [...prev.setores, itemSetor],
    }));
    setNovoSetor("");
  };

  const handleCopiarLink = (setor: Setor) => {
    navigator.clipboard.writeText(setor.linkAnonimo);
    setCopiadoId(setor.id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const handleAbrirRelatorio = (setor: Setor) => {
    setSetorSelecionadoRelatorio(setor);
    const res = obterRespostasPorSetor(setor.id);
    setRespostasDoSetor(res);
  };

  const calcularMediaGlobalSetor = () => {
    if (respostasDoSetor.length === 0) return "3.2 (Simulação)";
    let somaGeral = 0;

    respostasDoSetor.forEach((r) => {
      const dominios = processarResultadosNR1(r.respostas);
      const mediaResposta =
        dominios.reduce((acc, d) => acc + d.pontuacao, 0) / dominios.length;
      somaGeral += mediaResposta;
    });

    return (somaGeral / respostasDoSetor.length).toFixed(1);
  };

  const handleGerarPlano5W2H = () => {
    if (!setorSelecionadoRelatorio) return;

    // Respostas reais ou simuladas para demonstração
    const ultimasRespostas =
      respostasDoSetor.length > 0
        ? respostasDoSetor[respostasDoSetor.length - 1].respostas
        : {
            1: 4,
            2: 3,
            3: 5,
            4: 2,
            5: 4,
            6: 3,
            7: 4,
            8: 3,
            9: 4,
            10: 2,
            11: 3,
            12: 2,
            13: 4,
            14: 3,
            15: 4,
          };

    const dominios = processarResultadosNR1(ultimasRespostas);
    const plano = gerarPlanoAcao5W2H(
      dominios,
      empresa.nomeEmpresa || "Empresa Demonstrativa",
      setorSelecionadoRelatorio.nome,
    );
    setPlanoAcaoAtual(plano);
    setMostrarModalPlano(true);
  };

  return (
    <div
      style={{
        maxWidth: "750px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* 1. DADOS DA EMPRESA E E-MAIL */}
      <div className="card-container">
        <h2 style={{ margin: "0 0 16px 0", fontSize: "20px" }}>
          1. Configuração da Organização
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <input
            className="input-field"
            type="text"
            placeholder="Razão Social / Nome Fantasia"
            value={empresa.nomeEmpresa}
            onChange={(e) =>
              setEmpresa({ ...empresa, nomeEmpresa: e.target.value })
            }
          />
          <input
            className="input-field"
            type="text"
            placeholder="CNPJ (00.000.000/0000-00)"
            value={empresa.cnpj}
            onChange={handleCNPJChange}
            maxLength={18}
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              display: "block",
              marginBottom: "4px",
              color: "var(--text-secondary)",
            }}
          >
            E-MAIL DO GESTOR / SST (Envio consolidado após quórum mínimo)
          </label>
          <input
            className="input-field"
            type="email"
            placeholder="exemplo: sst@suaempresa.com.br"
            value={empresa.emailContato}
            onChange={(e) =>
              setEmpresa({ ...empresa, emailContato: e.target.value })
            }
          />
        </div>
      </div>

      {/* 2. GERAÇÃO DE LINKS E PAINEL LGPD */}
      <div className="card-container">
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>
            2. Links Anônimos e Monitoramento LGPD
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: "13px",
              color: "var(--text-secondary)",
            }}
          >
            Em produção, exige no mínimo{" "}
            <strong>{MINIMO_RESPOSTAS_LGPD} respostas</strong> para proteção de
            anonimato.
          </p>
        </div>

        <form
          onSubmit={handleAdicionarSetor}
          style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
        >
          <input
            className="input-field"
            type="text"
            placeholder="Nome do Setor (Ex: Operacional, Vendas, RH)"
            value={novoSetor}
            onChange={(e) => setNovoSetor(e.target.value)}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ whiteSpace: "nowrap" }}
          >
            + Gerar Link
          </button>
        </form>

        {empresa.setores.length > 0 ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {empresa.setores.map((s) => {
              const totalRespostas = obterRespostasPorSetor(s.id).length;

              return (
                <div
                  key={s.id}
                  style={{
                    padding: "16px",
                    borderRadius: "10px",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--option-bg)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "16px", display: "block" }}>
                        {s.nome}
                      </strong>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Status LGPD: {totalRespostas} / {MINIMO_RESPOSTAS_LGPD}{" "}
                        respostas
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleAbrirRelatorio(s)}
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        📊 Ver Diagnóstico
                      </button>

                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setQrCodeSetor(s)}
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        📱 QR Code
                      </button>

                      <a
                        href={s.linkAnonimo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          textDecoration: "none",
                          textAlign: "center",
                        }}
                      >
                        ▶ Simular Resposta
                      </a>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <input
                      className="input-field"
                      type="text"
                      readOnly
                      value={s.linkAnonimo}
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        background: "var(--bg-card)",
                      }}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleCopiarLink(s)}
                      style={{
                        whiteSpace: "nowrap",
                        padding: "8px 14px",
                        fontSize: "12px",
                        backgroundColor:
                          copiadoId === s.id ? "#22c55e" : undefined,
                        color: copiadoId === s.id ? "#ffffff" : undefined,
                        borderColor: copiadoId === s.id ? "#22c55e" : undefined,
                      }}
                    >
                      {copiadoId === s.id ? "✓ Copiado!" : "Copiar Link"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "30px",
              border: "1px dashed var(--border-color)",
              borderRadius: "8px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              Nenhum setor cadastrado ainda. Digite o nome de um setor acima
              para gerar o primeiro link.
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE DIAGNÓSTICO DE DEMONSTRAÇÃO */}
      {setorSelecionadoRelatorio && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="card-container"
            style={{ maxWidth: "500px", width: "100%", padding: "24px" }}
          >
            <h3 style={{ margin: "0 0 4px 0" }}>
              Diagnóstico de Setor: {setorSelecionadoRelatorio.nome}
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                margin: "0 0 16px 0",
              }}
            >
              Mapeamento de Riscos Psicossociais (NR-1)
            </p>

            {respostasDoSetor.length < MINIMO_RESPOSTAS_LGPD && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #f59e0b",
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  marginBottom: "16px",
                }}
              >
                <strong
                  style={{
                    fontSize: "13px",
                    color: "#f59e0b",
                    display: "block",
                    marginBottom: "2px",
                  }}
                >
                  ⚠️ Modo de Teste / Demonstração Ativo
                </strong>
                <p
                  style={{
                    fontSize: "12px",
                    margin: 0,
                    color: "var(--text-secondary)",
                    lineHeight: "1.4",
                  }}
                >
                  Registradas {respostasDoSetor.length} de{" "}
                  {MINIMO_RESPOSTAS_LGPD} respostas. Em produção haveria trava
                  de quórum LGPD, mas os recursos abaixo estão liberados para
                  apresentação.
                </p>
              </div>
            )}

            <div
              style={{
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <strong
                style={{
                  color: "#22c55e",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                ✓ Relatório Disponível para Visualização
              </strong>
              <p style={{ fontSize: "14px", margin: "4px 0" }}>
                <strong>Média Consolidada do Setor:</strong>{" "}
                {calcularMediaGlobalSetor()} / 5.0
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  margin: "8px 0 0 0",
                }}
              >
                Classificação geral baseada nos critérios e matrizes de risco da
                NR-1 / COPSOQ.
              </p>

              <button
                type="button"
                className="btn-primary"
                onClick={handleGerarPlano5W2H}
                style={{ marginTop: "16px", width: "100%", padding: "10px" }}
              >
                📋 Gerar Plano de Ação 5W2H (GRO/PGR)
              </button>
            </div>

            <button
              className="btn-secondary"
              onClick={() => setSetorSelecionadoRelatorio(null)}
              style={{ marginTop: "20px", width: "100%" }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* MODAL SIMULADOR DE QR CODE */}
      {qrCodeSetor && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="card-container"
            style={{
              maxWidth: "350px",
              width: "100%",
              textAlign: "center",
              padding: "24px",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>QR Code do Setor</h3>
            <p
              style={{
                margin: "0 0 16px 0",
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}
            >
              {qrCodeSetor.nome} - {empresa.nomeEmpresa || "Empresa"}
            </p>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrCodeSetor.linkAnonimo)}`}
              alt="QR Code do Setor"
              style={{
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                padding: "8px",
                background: "#fff",
              }}
            />

            <button
              className="btn-secondary"
              onClick={() => setQrCodeSetor(null)}
              style={{ marginTop: "16px", width: "100%" }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DO PLANO DE AÇÃO 5W2H */}
      {mostrarModalPlano && planoAcaoAtual && setorSelecionadoRelatorio && (
        <PlanoAcao5W2HModal
          planoInicial={planoAcaoAtual}
          nomeSetor={setorSelecionadoRelatorio.nome}
          onFechar={() => setMostrarModalPlano(false)}
        />
      )}
    </div>
  );
};
