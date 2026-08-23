export interface Setor {
  id: string;
  nome: string;
  linkAnonimo: string;
}

export interface DadosEmpresa {
  nomeEmpresa: string;
  cnpj: string;
  setores: Setor[];
}
