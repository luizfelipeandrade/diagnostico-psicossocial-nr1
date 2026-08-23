export interface RespostaSetor {
  idSetor: string;
  respostas: Record<number, number>;
  data: string;
}

const CHAVE_STORAGE = "@nr1_respostas_setores";

export const salvarResposta = (
  idSetor: string,
  respostas: Record<number, number>,
) => {
  const existentes = obterRespostas();
  const nova: RespostaSetor = {
    idSetor,
    respostas,
    data: new Date().toDateString(),
  };
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify([...existentes, nova]));
};

export const obterRespostas = (): RespostaSetor[] => {
  const dados = localStorage.getItem(CHAVE_STORAGE);
  return dados ? JSON.parse(dados) : [];
};

export const obterRespostasPorSetor = (idSetor: string): RespostaSetor[] => {
  return obterRespostas().filter((r) => r.idSetor === idSetor);
};
