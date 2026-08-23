import React, { useState, useEffect, useRef } from "react";

// Interfaces
export interface Empresa {
  nomeEmpresa: string;
  cnpj: string;
  emailContato: string;
  logoUrl?: string;
}

export interface Setor {
  id: string;
  nome: string;
}

export interface RespostaQuestionario {
  id: string;
  setorId: string;
  dataEnvio: string;
  respostas: Record<string, number>;
}

export interface Pergunta {
  id: string;
  categoria: string;
  texto: string;
  etapaNum: number;
}

const OPCOES_RESPOSTA = [
  { valor: 1, label: "1. Discordo Totalmente", emoji: "😡" },
  { valor: 2, label: "2. Discordo Parcialmente", emoji: "🙁" },
  { valor: 3, label: "3. Neutro / Regular", emoji: "😐" },
  { valor: 4, label: "4. Concordo Parcialmente", emoji: "🙂" },
  { valor: 5, label: "5. Concordo Totalmente", emoji: "😍" },
];

const PERGUNTAS_DIAGNOSTICO: Pergunta[] = [
  {
    id: "q1",
    etapaNum: 1,
    categoria: "Demandas de Trabalho",
    texto:
      "O volume de trabalho exigido na sua rotina é adequado para o seu expediente?",
  },
  {
    id: "q2",
    etapaNum: 1,
    categoria: "Demandas de Trabalho",
    texto:
      "Você considera os prazos estabelecidos para a entrega das suas tarefas razoáveis?",
  },
  {
    id: "q3",
    etapaNum: 1,
    categoria: "Demandas de Trabalho",
    texto: "Você precisa realizar horas extras não planejadas com frequência?",
  },
  {
    id: "q4",
    etapaNum: 1,
    categoria: "Demandas de Trabalho",
    texto:
      "O nível de exigência ou pressão psicológica no seu dia a dia é tolerável?",
  },

  {
    id: "q5",
    etapaNum: 2,
    categoria: "Autonomia e Controle",
    texto:
      "Você tem autonomia para decidir a ordem ou a forma de realizar suas atividades?",
  },
  {
    id: "q6",
    etapaNum: 2,
    categoria: "Autonomia e Controle",
    texto:
      "Suas opiniões e sugestões são levadas em consideração pela gestão do setor?",
  },
  {
    id: "q7",
    etapaNum: 2,
    categoria: "Autonomia e Controle",
    texto:
      "Você consegue fazer as pausas necessárias durante a jornada para descanso?",
  },
  {
    id: "q8",
    etapaNum: 2,
    categoria: "Autonomia e Controle",
    texto:
      "Suas habilidades técnicas são devidamente aproveitadas no seu cargo?",
  },

  {
    id: "q9",
    etapaNum: 3,
    categoria: "Suporte da Gestão",
    texto:
      "Sua liderança está disponível para orientar e apoiar quando surgem problemas?",
  },
  {
    id: "q10",
    etapaNum: 3,
    categoria: "Suporte da Gestão",
    texto:
      "Você recebe feedbacks claros e construtivos sobre o seu desempenho?",
  },
  {
    id: "q11",
    etapaNum: 3,
    categoria: "Suporte da Gestão",
    texto:
      "A gestão demonstra preocupação com o bem-estar e a saúde mental da equipe?",
  },
  {
    id: "q12",
    etapaNum: 3,
    categoria: "Suporte da Gestão",
    texto: "As metas informadas pela liderança são realistas e alcançáveis?",
  },

  {
    id: "q13",
    etapaNum: 4,
    categoria: "Clima & Relacionamentos",
    texto:
      "O ambiente de trabalho é respeitoso, sem situações de assédio ou desrespeito?",
  },
  {
    id: "q14",
    etapaNum: 4,
    categoria: "Clima & Relacionamentos",
    texto:
      "Existe cooperação e bom trabalho em equipe entre os colegas do seu setor?",
  },
  {
    id: "q15",
    etapaNum: 4,
    categoria: "Clima & Relacionamentos",
    texto: "A comunicação entre os colaboradores e a empresa é transparente?",
  },
  {
    id: "q16",
    etapaNum: 4,
    categoria: "Clima & Relacionamentos",
    texto:
      "Você se sente valorizado e reconhecido pelo esforço dedicado ao trabalho?",
  },

  {
    id: "q17",
    etapaNum: 5,
    categoria: "Papel & Mudanças",
    texto:
      "Suas responsabilidades e deveres no trabalho são bem definidos e claros?",
  },
  {
    id: "q18",
    etapaNum: 5,
    categoria: "Papel & Mudanças",
    texto:
      "Você recebe treinamento suficiente para operar os sistemas ou realizar funções?",
  },
  {
    id: "q19",
    etapaNum: 5,
    categoria: "Papel & Mudanças",
    texto:
      "Quando ocorrem mudanças no setor, a empresa orienta a equipe previamente?",
  },
  {
    id: "q20",
    etapaNum: 5,
    categoria: "Papel & Mudanças",
    texto:
      "No geral, você considera seu ambiente de trabalho seguro e saudável?",
  },
];

const ETAPAS_INFO = [
  { num: 1, titulo: "1. Demandas & Carga de Trabalho" },
  { num: 2, titulo: "2. Autonomia & Controle" },
  { num: 3, titulo: "3. Suporte da Gestão" },
  { num: 4, titulo: "4. Clima & Relacionamentos" },
  { num: 5, titulo: "5. Papel & Conclusão" },
];

const mascararCNPJ = (valor: string) => {
  const apenasNumeros = valor.replace(/\D/g, "").slice(0, 14);
  return apenasNumeros
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

export const App: React.FC = () => {
  const [modoEscuro, setModoEscuro] = useState<boolean>(() => {
    return localStorage.getItem("app_tema") === "dark";
  });

  const [empresa, setEmpresa] = useState<Empresa>(() => {
    const dadosSalvos = localStorage.getItem("app_empresa_dados");
    return dadosSalvos
      ? JSON.parse(dadosSalvos)
      : { nomeEmpresa: "", cnpj: "", emailContato: "", logoUrl: "" };
  });

  const [setores, setSetores] = useState<Setor[]>(() => {
    const setoresSalvos = localStorage.getItem("app_setores");
    return setoresSalvos ? JSON.parse(setoresSalvos) : [];
  });

  const [respostasSetores, setRespostasSetores] = useState<
    Record<string, RespostaQuestionario[]>
  >(() => {
    const respostasSalvas = localStorage.getItem("app_respostas_setores");
    return respostasSalvas ? JSON.parse(respostasSalvas) : {};
  });

  const [setorRespondendoId, setSetorRespondendoId] = useState<string | null>(
    null,
  );
  const [etapaFormulario, setEtapaFormulario] = useState<number>(1);
  const [respostasFormulario, setRespostasFormulario] = useState<
    Record<string, number>
  >({});
  const [formEnviado, setFormEnviado] = useState<boolean>(false);
  const [setorQrCodeAtivo, setSetorQrCodeAtivo] = useState<Setor | null>(null);
  const [baixandoQr, setBaixandoQr] = useState<boolean>(false);

  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    localStorage.setItem("app_tema", modoEscuro ? "dark" : "light");
  }, [modoEscuro]);

  useEffect(() => {
    localStorage.setItem("app_empresa_dados", JSON.stringify(empresa));
  }, [empresa]);

  useEffect(() => {
    localStorage.setItem("app_setores", JSON.stringify(setores));
  }, [setores]);

  useEffect(() => {
    localStorage.setItem(
      "app_respostas_setores",
      JSON.stringify(respostasSetores),
    );
  }, [respostasSetores]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const setorParam = params.get("responderSetor");
    if (setorParam) {
      setSetorRespondendoId(setorParam);
    }
  }, []);

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmpresa({ ...empresa, cnpj: mascararCNPJ(e.target.value) });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmpresa((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdicionarSetor = (nomeSetor: string) => {
    if (!nomeSetor.trim()) return;
    const novoSetor: Setor = {
      id: "setor_" + Date.now(),
      nome: nomeSetor.trim(),
    };
    setSetores((prev) => [...prev, novoSetor]);
  };

  const selecionarOpcao = (perguntaId: string, valor: number) => {
    setRespostasFormulario((prev) => ({ ...prev, [perguntaId]: valor }));
  };

  const validarEtapaAtual = (): boolean => {
    const perguntasDaEtapa = PERGUNTAS_DIAGNOSTICO.filter(
      (p) => p.etapaNum === etapaFormulario,
    );
    for (const p of perguntasDaEtapa) {
      if (!respostasFormulario[p.id]) {
        alert(
          "⚠️ Por favor, responda todas as perguntas desta etapa antes de prosseguir.",
        );
        return false;
      }
    }
    return true;
  };

  const handleAvancarEtapa = () => {
    if (validarEtapaAtual()) {
      setEtapaFormulario((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleVoltarEtapa = () => {
    setEtapaFormulario((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalizarEEnviar = () => {
    if (!validarEtapaAtual() || !setorRespondendoId) return;

    const novaResposta: RespostaQuestionario = {
      id: "resp_" + Date.now(),
      setorId: setorRespondendoId,
      dataEnvio: new Date().toISOString(),
      respostas: respostasFormulario,
    };

    setRespostasSetores((prev) => {
      const listaAtual = prev[setorRespondendoId] || [];
      return { ...prev, [setorRespondendoId]: [...listaAtual, novaResposta] };
    });

    setFormEnviado(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const calcularMediaSetor = (setorId: string): string => {
    const respostas = respostasSetores[setorId] || [];
    if (respostas.length === 0) return "0.0";

    let somaTotal = 0;
    let qtdPerguntas = 0;

    respostas.forEach((item) => {
      Object.values(item.respostas).forEach((nota) => {
        somaTotal += nota;
        qtdPerguntas += 1;
      });
    });

    if (qtdPerguntas === 0) return "0.0";
    return (somaTotal / qtdPerguntas).toFixed(1);
  };

  const handleExportarExcelCSV = () => {
    let dataset: { setorNome: string; resp: RespostaQuestionario }[] = [];

    setores.forEach((s) => {
      const respostasDoSetor = respostasSetores[s.id] || [];
      respostasDoSetor.forEach((r) => {
        dataset.push({ setorNome: s.nome, resp: r });
      });
    });

    if (dataset.length === 0) {
      alert("⚠️ Nenhuma resposta registrada para exportar.");
      return;
    }

    let csvHeaders = ["ID Resposta", "Data/Hora", "Setor"];
    PERGUNTAS_DIAGNOSTICO.forEach((p) => {
      csvHeaders.push(
        `"Q${p.id.replace("q", "")}: ${p.texto.replace(/"/g, '""')}"`,
      );
    });

    let csvRows = [csvHeaders.join(";")];

    dataset.forEach(({ setorNome, resp }) => {
      const dataFormatada = new Date(resp.dataEnvio).toLocaleString("pt-BR");
      let row = [resp.id, `"${dataFormatada}"`, `"${setorNome}"`];

      PERGUNTAS_DIAGNOSTICO.forEach((p) => {
        const nota = resp.respostas[p.id] || 0;
        row.push(nota.toString());
      });

      csvRows.push(row.join(";"));
    });

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Diagnostico_NR1_Geral.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportarPowerBIJSON = () => {
    let exportData: any[] = [];

    setores.forEach((s) => {
      const respostasDoSetor = respostasSetores[s.id] || [];
      respostasDoSetor.forEach((r) => {
        let objetoLinha: any = {
          ID_Resposta: r.id,
          Data_Envio: r.dataEnvio,
          Empresa: empresa.nomeEmpresa || "Não Informado",
          CNPJ: empresa.cnpj || "Não Informado",
          Setor_ID: s.id,
          Setor_Nome: s.nome,
        };

        PERGUNTAS_DIAGNOSTICO.forEach((p) => {
          objetoLinha[`Q_${p.id}_${p.categoria.replace(/\s+/g, "_")}`] =
            r.respostas[p.id] || 0;
        });

        exportData.push(objetoLinha);
      });
    });

    if (exportData.length === 0) {
      alert("⚠️ Nenhuma resposta registrada para exportar para o Power BI.");
      return;
    }

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Dados_GRO_PowerBI.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBaixarQrCodeComCabecalho = (setor: Setor) => {
    setBaixandoQr(true);
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 750;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setBaixandoQr(false);
      return;
    }

    // Fundo Branco
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Borda Externa Decorativa
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Textos do Cabeçalho
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "AVALIAÇÃO DE RISCOS PSICOSSOCIAIS (NR-1)",
      canvas.width / 2,
      70,
    );

    ctx.fillStyle = "#0284c7";
    ctx.font = "bold 24px Arial";
    ctx.fillText(
      empresa.nomeEmpresa || "Empresa Avaliada",
      canvas.width / 2,
      110,
    );

    ctx.fillStyle = "#64748b";
    ctx.font = "14px Arial";
    ctx.fillText(
      `CNPJ: ${empresa.cnpj || "Não informado"}`,
      canvas.width / 2,
      135,
    );

    // Destque do Setor
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(60, 160, canvas.width - 120, 50);
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 18px Arial";
    ctx.fillText(`SETOR: ${setor.nome.toUpperCase()}`, canvas.width / 2, 191);

    ctx.fillStyle = "#334155";
    ctx.font = "15px Arial";
    ctx.fillText(
      "Aponte a câmera do seu celular para responder:",
      canvas.width / 2,
      250,
    );

    // Carregar Imagem do QR Code
    const linkQrApi = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      `${window.location.origin}${window.location.pathname}?responderSetor=${setor.id}`,
    )}`;

    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous";
    qrImage.src = linkQrApi;

    qrImage.onload = () => {
      // Desenhar QR Code no centro
      ctx.drawImage(qrImage, 150, 280, 300, 300);

      // Rodapé com créditos acadêmicos/técnicos originais
      ctx.fillStyle = "#64748b";
      ctx.font = "11px Arial";
      ctx.fillText("PROTÓTIPO ACADÊMICO GRO/NR-1", canvas.width / 2, 620);
      ctx.font = "bold 11px Arial";
      ctx.fillStyle = "#0284c7";
      ctx.fillText(
        "Concepção: Prof. Alves | Desenvolvimento Técnico: Luiz Felipe Andrade",
        canvas.width / 2,
        640,
      );
      ctx.font = "10px Arial";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(
        "Pesquisa 100% Anônima e Confidencial",
        canvas.width / 2,
        675,
      );

      // Gerar download automático
      const imagemUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = imagemUrl;
      downloadLink.download = `QRCode_Setor_${setor.nome.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setBaixandoQr(false);
    };

    qrImage.onerror = () => {
      alert(
        "⚠️ Erro ao gerar a imagem do QR Code. Verifique sua conexão com a internet.",
      );
      setBaixandoQr(false);
    };
  };

  const handleAbrirRelatorioEmNovaAba = (setor: Setor) => {
    const totalResp = (respostasSetores[setor.id] || []).length;
    const media = calcularMediaSetor(setor.id);
    const numMedia = parseFloat(media);
    const dataAtual = new Date().toLocaleDateString("pt-BR");

    let planoAcaoHTML = "";
    if (totalResp === 0) {
      planoAcaoHTML = `
        <tr>
          <td>Divulgação do link do questionário</td>
          <td>Amostra zerada - impossível mensurar risco psicossocial</td>
          <td>Setor ${setor.nome}</td>
          <td>Equipe de SST e Gestão do Setor</td>
          <td>Imediato</td>
          <td>Reforçar anonimato e reenviar link no grupo do setor</td>
        </tr>
      `;
    } else if (numMedia < 3.5) {
      planoAcaoHTML = `
        <tr>
          <td>Readequação de prazos e volume de trabalho</td>
          <td>Média do setor (${media}/5.0) sinaliza alerta de sobrecarga psicossocial</td>
          <td>Setor ${setor.nome}</td>
          <td>Liderança de Setor e RH</td>
          <td>15 dias</td>
          <td>Reorganizar escala de trabalho, alinhar metas e garantir pausas</td>
        </tr>
        <tr>
          <td>Capacitação em Liderança Humanizada</td>
          <td>Indicador de suporte da gestão exige intervenção preventiva</td>
          <td>Auditório / Online</td>
          <td>Consultoria de SST e Gestores</td>
          <td>30 dias</td>
          <td>Realizar workshops sobre escuta ativa e redução do estresse no trabalho</td>
        </tr>
      `;
    } else {
      planoAcaoHTML = `
        <tr>
          <td>Manutenção das boas práticas organizacionais</td>
          <td>Setor apresentou nível de satisfação seguro (${media}/5.0)</td>
          <td>Setor ${setor.nome}</td>
          <td>SESMT e CIPA</td>
          <td>Semestral</td>
          <td>Manter acompanhamento periódico e revalidar o questionário anualmente (NR-1)</td>
        </tr>
      `;
    }

    const conteudoHTML = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Laudo NR-1 Psicossocial - ${setor.nome}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; background-color: #f8fafc; }
          .container { max-width: 850px; margin: 0 auto; background: #ffffff; padding: 35px; border-radius: 8px; border: 1px solid #cbd5e1; }
          .header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .header-info h1 { margin: 0; font-size: 18px; color: #0284c7; text-transform: uppercase; }
          .header-info p { margin: 4px 0 0 0; font-size: 12px; color: #64748b; }
          .logo-img { max-height: 50px; max-width: 180px; object-fit: contain; }
          .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f1f5f9; padding: 14px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; }
          .cards { display: flex; gap: 16px; margin-bottom: 24px; }
          .card { flex: 1; padding: 16px; border: 1px solid #cbd5e1; border-radius: 6px; text-align: center; background: #ffffff; }
          .card .number { font-size: 26px; font-weight: bold; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th { background: #0284c7; color: #ffffff; padding: 8px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
          .btn-print { background: #0284c7; color: #ffffff; border: none; padding: 10px 18px; font-size: 14px; font-weight: bold; border-radius: 6px; cursor: pointer; margin-bottom: 16px; }
          .footer-rights { margin-top: 30px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #64748b; text-align: center; }
          @media print {
            body { background: #ffffff; padding: 0; }
            .container { border: none; padding: 0; }
            .btn-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="text-align: right; max-width: 850px; margin: 0 auto;">
          <button class="btn-print" onclick="window.print()">🖨️ Imprimir ou Salvar em PDF</button>
        </div>
        <div class="container">
          <div class="header">
            <div class="header-info">
              <h1>Laudo Técnico de Risco Psicossocial (NR-1 / GRO)</h1>
              <p>Gerenciamento de Riscos Ocupacionais - Diagnóstico Quantitativo</p>
            </div>
            ${empresa.logoUrl ? `<img src="${empresa.logoUrl}" alt="Logo Empresa" class="logo-img" />` : ""}
          </div>

          <div class="grid-info">
            <div><b>Razão Social:</b> ${empresa.nomeEmpresa || "Não informada"}</div>
            <div><b>CNPJ:</b> ${empresa.cnpj || "Não informado"}</div>
            <div><b>Setor Avaliado:</b> ${setor.nome}</div>
            <div><b>Data de Emissão:</b> ${dataAtual}</div>
          </div>

          <h3 style="font-size: 14px; margin-bottom: 10px;">1. Amostragem Coletada</h3>
          <div class="cards">
            <div class="card">
              <div style="font-size: 12px; color: #64748b;">Amostras Recebidas</div>
              <div class="number" style="color: #0284c7;">${totalResp} respostas</div>
            </div>
            <div class="card">
              <div style="font-size: 12px; color: #64748b;">Média Geral de Satisfação</div>
              <div class="number" style="color: ${numMedia >= 3.5 ? "#16a34a" : "#dc2626"};">${media} / 5.0</div>
            </div>
          </div>

          <h3 style="font-size: 14px; margin-bottom: 10px;">2. Plano de Ação Recomendado (Matriz 5W2H)</h3>
          <table>
            <thead>
              <tr>
                <th>O Quê (What)</th>
                <th>Por Quê (Why)</th>
                <th>Onde (Where)</th>
                <th>Quem (Who)</th>
                <th>Quando (When)</th>
                <th>Como (How)</th>
              </tr>
            </thead>
            <tbody>
              ${planoAcaoHTML}
            </tbody>
          </table>

          <div class="footer-rights">
            PROTÓTIPO ACADÊMICO GRO/NR-1 | <b>Concepção e Ideia:</b> Prof. Alves | <b>Desenvolvimento do Código e Autoria Técnica:</b> Luiz Felipe Andrade.<br />
            <i>Todos os direitos de código e arquitetura reservados ao autor técnico Luiz Felipe Andrade.</i>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 400);
          }
        </script>
      </body>
      </html>
    `;

    const novaAba = window.open("", "_blank");
    if (novaAba) {
      novaAba.document.write(conteudoHTML);
      novaAba.document.close();
    } else {
      alert(
        "⚠️ Permita pop-ups no seu navegador para visualizar o relatório PDF.",
      );
    }
  };

  const handleLimparTudo = () => {
    if (
      confirm(
        "⚠️ Tem certeza de que deseja apagar todos os dados cadastrados e reiniciar o sistema?",
      )
    ) {
      localStorage.clear();
      window.location.href = window.location.pathname;
    }
  };

  const theme = {
    bg: modoEscuro ? "#090d16" : "#f1f5f9",
    cardBg: modoEscuro ? "#1e293b" : "#ffffff",
    text: modoEscuro ? "#f8fafc" : "#0f172a",
    subText: modoEscuro ? "#cbd5e1" : "#64748b",
    border: modoEscuro ? "#334155" : "#e2e8f0",
    inputBg: modoEscuro ? "#0f172a" : "#ffffff",
    inputText: modoEscuro ? "#ffffff" : "#0f172a",
    primaryBtnBg: "#0284c7",
    primaryBtnText: "#ffffff",
    secBtnBg: modoEscuro ? "#334155" : "#e2e8f0",
    secBtnText: modoEscuro ? "#ffffff" : "#0f172a",
    dangerBtnBg: "#ef4444",
    dangerBtnText: "#ffffff",
    activeOptionBg: modoEscuro ? "#0369a1" : "#e0f2fe",
    activeOptionBorder: "#0284c7",
  };

  // APP INTERFACE (FUNCIONÁRIO)
  if (setorRespondendoId) {
    const setorAtual = setores.find((s) => s.id === setorRespondendoId);
    const perguntasDaEtapaAtual = PERGUNTAS_DIAGNOSTICO.filter(
      (p) => p.etapaNum === etapaFormulario,
    );
    const porcentagemProgresso = Math.round((etapaFormulario / 5) * 100);
    const infoEtapa = ETAPAS_INFO.find((e) => e.num === etapaFormulario);

    if (formEnviado) {
      return (
        <div
          style={{
            backgroundColor: theme.bg,
            color: theme.text,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: "420px",
              width: "100%",
              backgroundColor: theme.cardBg,
              padding: "36px 24px",
              borderRadius: "24px",
              border: `1px solid ${theme.border}`,
              textAlign: "center",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
            <h2
              style={{
                color: "#16a34a",
                marginTop: 0,
                fontSize: "1.4rem",
                fontWeight: "bold",
              }}
            >
              Diagnóstico Enviado!
            </h2>
            <p
              style={{
                color: theme.subText,
                lineHeight: "1.5",
                fontSize: "0.95rem",
                margin: "12px 0 24px 0",
              }}
            >
              Agradecemos sua colaboração. Suas respostas foram salvas de forma{" "}
              <b>100% confidencial e anônima</b>.
            </p>
            <div
              style={{
                padding: "12px",
                backgroundColor: modoEscuro ? "#0f172a" : "#f8fafc",
                borderRadius: "12px",
                fontSize: "0.85rem",
                color: theme.subText,
              }}
            >
              🔒 Segurança garantida conforme diretrizes de Gestão de Riscos
              (NR-1).
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          backgroundColor: theme.bg,
          color: theme.text,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0 0 24px 0",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            minHeight: "100vh",
            backgroundColor: theme.cardBg,
            display: "flex",
            flexDirection: "column",
            borderLeft: `1px solid ${theme.border}`,
            borderRight: `1px solid ${theme.border}`,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              backgroundColor: theme.cardBg,
              padding: "20px 20px 12px 20px",
              borderBottom: `1px solid ${theme.border}`,
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
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: theme.primaryBtnBg,
                  }}
                >
                  {empresa.nomeEmpresa || "Avaliação Ocupacional"}
                </span>
                <h1
                  style={{
                    margin: "2px 0 0 0",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                  }}
                >
                  Setor: {setorAtual?.nome || "Geral"}
                </h1>
              </div>
              {empresa.logoUrl ? (
                <img
                  src={empresa.logoUrl}
                  alt="Logo"
                  style={{
                    maxHeight: "36px",
                    maxWidth: "100px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div
                  style={{
                    backgroundColor: modoEscuro ? "#0f172a" : "#f1f5f9",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    color: theme.primaryBtnBg,
                  }}
                >
                  {etapaFormulario} / 5
                </div>
              )}
            </div>

            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  color: theme.subText,
                  marginBottom: "6px",
                }}
              >
                <span>Progresso</span>
                <span>
                  <b>{porcentagemProgresso}%</b>
                </span>
              </div>
              <div
                style={{
                  backgroundColor: modoEscuro ? "#0f172a" : "#e2e8f0",
                  height: "6px",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#0284c7",
                    height: "100%",
                    width: `${porcentagemProgresso}%`,
                    transition: "width 0.4s ease",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
            <div style={{ marginBottom: "20px" }}>
              <h2
                style={{
                  fontSize: "1.05rem",
                  margin: 0,
                  fontWeight: "bold",
                  color: theme.text,
                }}
              >
                {infoEtapa?.titulo}
              </h2>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "0.8rem",
                  color: theme.subText,
                }}
              >
                Toque em uma opção abaixo para selecionar sua resposta em cada
                questão.
              </p>
            </div>

            {perguntasDaEtapaAtual.map((p, idx) => {
              const valorSelecionado = respostasFormulario[p.id];

              return (
                <div
                  key={p.id}
                  style={{
                    marginBottom: "24px",
                    backgroundColor: modoEscuro ? "#0f172a" : "#f8fafc",
                    padding: "16px",
                    borderRadius: "16px",
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      marginBottom: "14px",
                      lineHeight: "1.4",
                      color: theme.text,
                    }}
                  >
                    <span
                      style={{ color: theme.primaryBtnBg, marginRight: "6px" }}
                    >
                      #{(etapaFormulario - 1) * 4 + idx + 1}
                    </span>
                    {p.texto}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {OPCOES_RESPOSTA.map((opt) => {
                      const estaSelecionado = valorSelecionado === opt.valor;

                      return (
                        <button
                          key={opt.valor}
                          type="button"
                          onClick={() => selecionarOpcao(p.id, opt.valor)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 14px",
                            borderRadius: "12px",
                            border: estaSelecionado
                              ? `2px solid ${theme.activeOptionBorder}`
                              : `1px solid ${theme.border}`,
                            backgroundColor: estaSelecionado
                              ? theme.activeOptionBg
                              : theme.cardBg,
                            color: theme.text,
                            fontSize: "0.85rem",
                            fontWeight: estaSelecionado ? "bold" : "normal",
                            cursor: "pointer",
                            textAlign: "left",
                            width: "100%",
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span style={{ fontSize: "1.1rem" }}>
                              {opt.emoji}
                            </span>
                            <span>{opt.label}</span>
                          </span>

                          <span
                            style={{
                              width: "18px",
                              height: "18px",
                              borderRadius: "50%",
                              border: estaSelecionado
                                ? `5px solid ${theme.primaryBtnBg}`
                                : `2px solid ${theme.subText}`,
                              backgroundColor: "#ffffff",
                              boxSizing: "border-box",
                            }}
                          ></span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              backgroundColor: theme.cardBg,
              padding: "16px 20px",
              borderTop: `1px solid ${theme.border}`,
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            {etapaFormulario > 1 && (
              <button
                type="button"
                onClick={handleVoltarEtapa}
                style={{
                  flex: 1,
                  backgroundColor: theme.secBtnBg,
                  color: theme.secBtnText,
                  border: "none",
                  padding: "12px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Voltar
              </button>
            )}

            {etapaFormulario < 5 ? (
              <button
                type="button"
                onClick={handleAvancarEtapa}
                style={{
                  flex: 2,
                  backgroundColor: theme.primaryBtnBg,
                  color: theme.primaryBtnText,
                  border: "none",
                  padding: "12px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Avançar Etapa
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalizarEEnviar}
                style={{
                  flex: 2,
                  backgroundColor: "#16a34a",
                  color: "#ffffff",
                  border: "none",
                  padding: "12px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Finalizar e Enviar 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // APP INTERFACE (PAINEL DO GESTOR / ADMINISTRADOR)
  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        padding: "24px 16px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Cabeçalho */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "16px",
            border: `1px solid ${theme.border}`,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "1.4rem", color: theme.text }}>
              Painel GRO / NR-1 (Gestão)
            </h1>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "0.85rem",
                color: theme.subText,
              }}
            >
              Gerenciamento de Riscos Psicossociais por Setor
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setModoEscuro(!modoEscuro)}
              style={{
                backgroundColor: theme.secBtnBg,
                color: theme.secBtnText,
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.85rem",
              }}
            >
              {modoEscuro ? "☀️ Claro" : "🌙 Escuro"}
            </button>
            <button
              onClick={handleLimparTudo}
              style={{
                backgroundColor: theme.dangerBtnBg,
                color: theme.dangerBtnText,
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "0.85rem",
              }}
            >
              Resetar
            </button>
          </div>
        </div>

        {/* Cadastro de Empresa, CNPJ, E-mail e Logo */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "16px",
            border: `1px solid ${theme.border}`,
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginTop: 0 }}>
            1. Dados da Empresa
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
              marginBottom: "14px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "6px",
                  color: theme.subText,
                }}
              >
                Razão Social
              </label>
              <input
                type="text"
                value={empresa.nomeEmpresa}
                onChange={(e) =>
                  setEmpresa({ ...empresa, nomeEmpresa: e.target.value })
                }
                placeholder="Ex: Minha Empresa LTDA"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.inputBg,
                  color: theme.inputText,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "6px",
                  color: theme.subText,
                }}
              >
                CNPJ
              </label>
              <input
                type="text"
                value={empresa.cnpj}
                onChange={handleCNPJChange}
                placeholder="00.000.000/0001-00"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.inputBg,
                  color: theme.inputText,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "6px",
                  color: theme.subText,
                }}
              >
                E-mail de Contato / RH
              </label>
              <input
                type="email"
                value={empresa.emailContato}
                onChange={(e) =>
                  setEmpresa({ ...empresa, emailContato: e.target.value })
                }
                placeholder="rh@empresa.com"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.inputBg,
                  color: theme.inputText,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  marginBottom: "6px",
                  color: theme.subText,
                }}
              >
                Logotipo da Empresa (Imagem)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "8px",
                  border: `1px solid ${theme.border}`,
                  backgroundColor: theme.inputBg,
                  color: theme.inputText,
                  boxSizing: "border-box",
                  fontSize: "0.85rem",
                }}
              />
            </div>
          </div>
          {empresa.logoUrl && (
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "0.8rem", color: theme.subText }}>
                Logo Atual:
              </span>
              <img
                src={empresa.logoUrl}
                alt="Preview Logo"
                style={{
                  maxHeight: "35px",
                  maxWidth: "120px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </div>

        {/* Gestão de Setores, Links e QR Codes */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "16px",
            border: `1px solid ${theme.border}`,
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginTop: 0 }}>
            2. Setores e Links de Pesquisa
          </h2>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <input
              id="inputNovoSetor"
              type="text"
              placeholder="Nome do Setor (Ex: Administrativo, Produção...)"
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.inputBg,
                color: theme.inputText,
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAdicionarSetor((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.getElementById(
                  "inputNovoSetor",
                ) as HTMLInputElement;
                if (input) {
                  handleAdicionarSetor(input.value);
                  input.value = "";
                }
              }}
              style={{
                backgroundColor: theme.primaryBtnBg,
                color: theme.primaryBtnText,
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Adicionar Setor
            </button>
          </div>

          {setores.length === 0 ? (
            <p
              style={{
                color: theme.subText,
                fontSize: "0.9rem",
                textAlign: "center",
                margin: "20px 0",
              }}
            >
              Nenhum setor cadastrado ainda. Adicione acima para gerar os links
              e QR Codes de avaliação.
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {setores.map((setor) => {
                const totalResp = (respostasSetores[setor.id] || []).length;
                const media = calcularMediaSetor(setor.id);
                const linkSetor = `${window.location.origin}${window.location.pathname}?responderSetor=${setor.id}`;

                return (
                  <div
                    key={setor.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      backgroundColor: modoEscuro ? "#0f172a" : "#f8fafc",
                      borderRadius: "10px",
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "0.95rem" }}>
                        {setor.nome}
                      </strong>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: theme.subText,
                          marginTop: "2px",
                        }}
                      >
                        Respostas: {totalResp} | Média: {media}/5.0
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(linkSetor);
                          alert(`📋 Link do setor "${setor.nome}" copiado!`);
                        }}
                        style={{
                          backgroundColor: theme.secBtnBg,
                          color: theme.secBtnText,
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Copiar Link
                      </button>
                      <button
                        onClick={() => setSetorQrCodeAtivo(setor)}
                        style={{
                          backgroundColor: "#475569",
                          color: "#ffffff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        QR Code
                      </button>
                      <button
                        onClick={() => handleAbrirRelatorioEmNovaAba(setor)}
                        style={{
                          backgroundColor: theme.primaryBtnBg,
                          color: theme.primaryBtnText,
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Laudo PDF
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal de QR Code */}
        {setorQrCodeAtivo && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: "16px",
            }}
          >
            <div
              style={{
                backgroundColor: theme.cardBg,
                padding: "24px",
                borderRadius: "16px",
                maxWidth: "360px",
                width: "100%",
                textAlign: "center",
                border: `1px solid ${theme.border}`,
              }}
            >
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem" }}>
                QR Code do Setor
              </h3>
              <p
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "0.85rem",
                  color: theme.subText,
                }}
              >
                <b>{setorQrCodeAtivo.nome}</b>
              </p>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "16px",
                  borderRadius: "12px",
                  display: "inline-block",
                  marginBottom: "16px",
                  border: "1px solid #cbd5e1",
                }}
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    `${window.location.origin}${window.location.pathname}?responderSetor=${setorQrCodeAtivo.id}`,
                  )}`}
                  alt="QR Code do Setor"
                  style={{
                    display: "block",
                    width: "160px",
                    height: "160px",
                    margin: "0 auto",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() =>
                    handleBaixarQrCodeComCabecalho(setorQrCodeAtivo)
                  }
                  disabled={baixandoQr}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#ffffff",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  {baixandoQr ? "Gerando Imagem..." : "📥 Baixar QR Code"}
                </button>
                <button
                  onClick={() => setSetorQrCodeAtivo(null)}
                  style={{
                    backgroundColor: theme.secBtnBg,
                    color: theme.secBtnText,
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ações Gerais de Exportação */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "16px",
            border: `1px solid ${theme.border}`,
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            onClick={handleExportarExcelCSV}
            style={{
              flex: 1,
              backgroundColor: "#16a34a",
              color: "#ffffff",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            📊 Exportar Planilha (CSV)
          </button>

          <button
            onClick={handleExportarPowerBIJSON}
            style={{
              flex: 1,
              backgroundColor: "#ea580c",
              color: "#ffffff",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            📈 Exportar Power BI (JSON)
          </button>
        </div>
        {/* RODAPÉ DO PROJETO */}
        <footer
          style={{
            marginTop: "32px",
            padding: "28px 24px 20px 24px",
            borderTop: `1px solid ${theme.border}`,
            textAlign: "center",
            color: theme.subText,
          }}
        >
          {/* Identificação do projeto */}
          <div
            style={{
              marginBottom: "18px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "5px 12px",
                borderRadius: "20px",
                backgroundColor: modoEscuro ? "#0f172a" : "#e0f2fe",
                color: theme.primaryBtnBg,
                fontSize: "0.68rem",
                fontWeight: "bold",
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              Protótipo de Aplicação Web
            </div>

            <h3
              style={{
                margin: "0",
                fontSize: "0.95rem",
                fontWeight: "700",
                color: theme.text,
                letterSpacing: "0.3px",
              }}
            >
              GRO / NR-1 Psicossocial
            </h3>

            <p
              style={{
                margin: "5px 0 0 0",
                fontSize: "0.72rem",
                color: theme.subText,
              }}
            >
              Gerenciamento de Riscos Ocupacionais
            </p>
          </div>

          {/* Créditos */}
          <div
            style={{
              borderTop: `1px solid ${theme.border}`,
              borderBottom: `1px solid ${theme.border}`,
              padding: "16px 10px",
              marginBottom: "16px",
              fontSize: "0.75rem",
              lineHeight: "1.7",
            }}
          >
            <div>
              <span style={{ color: theme.subText }}>
                Concepção e Ideia do Projeto
              </span>
              <br />
              <strong style={{ color: theme.text }}>Professor Alves</strong>
            </div>

            <div style={{ marginTop: "3px" }}>
              <span style={{ color: theme.subText }}>
                Desenvolvimento de Código e Arquitetura
              </span>
              <br />
              <strong style={{ color: theme.text }}>Luiz Felipe Andrade</strong>
            </div>
          </div>

          {/* Direitos autorais */}
          <div
            style={{
              fontSize: "0.68rem",
              lineHeight: "1.5",
              color: theme.subText,
              maxWidth: "650px",
              margin: "0 auto",
            }}
          >
            <div>
              © 2026 Professor: Alves / Luiz Felipe Andrade. Todos os direitos
              sobre a implementação técnica, código e arquitetura deste software
              são reservados ao desenvolvedor.
            </div>

            <div
              style={{
                marginTop: "8px",
                opacity: 0.75,
              }}
            >
              Protótipo acadêmico • Versão 1.0
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
