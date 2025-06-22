export interface IItemSolicitacao {
  id?: number;
  produtoId: number;
  quantidadeSolicitada: number;
  quantidadeAprovada?: number;
  loteSelecionado?: string;
  laboratorioOrigemId?: number;
  nomeProduto?: string;
  cas?: string;
}


export interface ISolicitacaoCreate {
  laboratorioId: number;
  itens: IItemSolicitacao[];
}