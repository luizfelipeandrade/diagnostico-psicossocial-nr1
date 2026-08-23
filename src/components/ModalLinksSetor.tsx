import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  nomeSetor: string;
  tokenSetor: string;
}

export const ModalLinkSetor: React.FC<Props> = ({ nomeSetor, tokenSetor }) => {
  const [copiado, setCopiado] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const urlFormulario = `${window.location.origin}/responder/${tokenSetor}`;

  const handleCopiarLink = async () => {
    try {
      await navigator.clipboard.writeText(urlFormulario);
      setCopiado(true);

      setTimeout(() => {
        setCopiado(false);
      }, 2000);
    } catch (erro) {
      console.error("Erro ao copiar link:", erro);
    }
  };

  const handleBaixarQRCode = () => {
    if (!qrRef.current) return;

    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `QRCode_Setor_${nomeSetor}.svg`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "24px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h3 style={{ margin: "0 0 6px 0" }}>Link do setor</h3>

        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          {nomeSetor}
        </p>
      </div>

      <div
        ref={qrRef}
        style={{
          padding: "16px",
          background: "#ffffff",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
        }}
      >
        <QRCodeSVG value={urlFormulario} size={200} level="M" includeMargin />
      </div>

      <div
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          background: "var(--option-bg)",
          border: "1px solid var(--border-color)",
          fontSize: "12px",
          wordBreak: "break-all",
        }}
      >
        {urlFormulario}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          width: "100%",
        }}
      >
        <button
          type="button"
          className="btn-secondary"
          onClick={handleCopiarLink}
          style={{
            flex: 1,
          }}
        >
          {copiado ? "✓ Copiado!" : "Copiar Link"}
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={handleBaixarQRCode}
          style={{
            flex: 1,
          }}
        >
          Baixar QR Code
        </button>
      </div>
    </div>
  );
};
