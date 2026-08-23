import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
  nomeSetor: string;
  tokenSetor: string;
}

export const ModalLinkSetor: React.FC<Props> = ({ nomeSetor, tokenSetor }) => {
  const [copiado, setCopiado] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // URL do formulário do funcionário baseada na origem atual do app
  const urlFormulario = `${window.location.origin}/responder/${tokenSetor}`;

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(urlFormulario);
  };

  const handleBaixarQRCode = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL("image/png");

      const dowloadLink = document.createElement("a");
      dowloadLink.href = pngUrl;
      dowloadLink.download = `QRCode_Setor_${nomeSetor}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
  };
};
