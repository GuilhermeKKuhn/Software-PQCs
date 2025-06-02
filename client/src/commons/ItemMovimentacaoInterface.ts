export interface IItemMovimentacao {
  produtoId: number;
  nomeProduto: string;
  quantidade: number;
  lote: string;
  preco?: number | null;
  validade?: string;
}