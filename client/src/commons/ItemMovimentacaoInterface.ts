export interface IItemMovimentacao {
  produtoId: number;
  nomeProduto: string;
  quantidadeSolicitada: number;
  quantidadeAprovada: number; 
  lote: string;
  preco?: number | null;
  validade?: string;
  idSolicitacaoItem?: number;
}