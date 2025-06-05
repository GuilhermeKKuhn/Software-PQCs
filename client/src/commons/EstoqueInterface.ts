export interface IEstoqueProduto {
  id: number;
  nome: string;
  quantidadeTotal: number;
}

export interface IEstoqueLote {
  lote: string;
  validade: string;
  quantidade: number;
  laboratorio: string;
   nomeLaboratorio?: string;
}
