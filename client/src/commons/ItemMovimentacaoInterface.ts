import { IProdutoQuimico } from "./ProdutoQuimicoInterface";

export interface IItemMovimentacao {
  produto: IProdutoQuimico;
  quantidade: number;
  lote: string;
  preco?: number | null;
}