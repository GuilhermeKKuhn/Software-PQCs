import { IFornecedor } from "./FornecedorInterface";

export interface INotaFiscal {
  id: number;
  numeroNotaFiscal: number;
  dataRecebimento: string;
  fornecedor: IFornecedor;
}

export interface IItemNota {
  nomeProduto: string;
  lote: string;
  quantidade: number;
}