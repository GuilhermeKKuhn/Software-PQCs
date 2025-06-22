export interface IEstoqueProduto {
  id: number;
  nome: string;
  cas: string;
  densidade: string;
  concentracao: string;
  quantidadeTotal: number;
}

export interface IEstoqueLote {
  lote: string;
  dataValidade: string; 
  quantidade: number;
  laboratorio: string;
  nomeLaboratorio?: string;
}

