import { useState } from "react";
import { Formulario } from "./components/Formulario";
import { processarResultadosNR1 } from "./utils/calculoNR1"; //Ainda vai ser criada
import { PERGUNTAS_NR1 } from "./data/perguntasNR1";

export function App() {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRepostas] = useState<Record<number, number>>({});
  const [concluido, setConcluido] = useState(false);

  //Função para salvar a nota (1 a 5) da pergunta atual
  const handleResponder = (perguntaId: number, valor: number) => {
    setRespostas((prev) => ({ ...prev, [perguntaId]: valor }));
  };

  //Avançar para a próxima pergunta ou finalizar
  const handleProxima = () => {
    if (indiceAtual < PERGUNTAS_NR1.length - 1) {
      setIndiceAtual((prev) => prev + 1);
    } else {
      setConcluido(true);
    }
  };

  // Voltar para a pergunta anterior
  const handleAnterior = () => {
    if (indiceAtual > 0) {
      setIndiceAtual((prev) => prev - 1);
    }
  };
  if (concluido) {
    const resultados = processarResultadosNR1(respostas);
    return (
      <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>Diagnóstico Concluído!</h2>
        <p>Resultados processados para o inventário da NR-1:</p>
        <pre>{JSON.stringify(resultados, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Avaliação Psicossocial (NR-1/NR-17)</h1>
      <Formulario
        indiceAtual={indiceAtual}
        respostas={respostas}
        onResponder={handleResponder}
        onProxima={handleProxima}
        onAnterior={handleAnterior}
      />
    </div>
  );
}

export default App;
