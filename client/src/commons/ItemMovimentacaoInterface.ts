export interface IItemMovimentacao {
  produtoId: number;
  nomeProduto: string;
  lote: string;
  quantidadeSolicitada: number;
  quantidadeAprovada: number;
  preco?: number | null;

  validade?: string | null;
  fabricacao?: string | null;

  cas?: string;
  densidade?: string;
  concentracao?: string;

  idSolicitacaoItem?: number;
}
