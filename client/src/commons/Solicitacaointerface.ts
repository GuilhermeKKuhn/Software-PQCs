import { IItemSolicitacao } from "./ItemSolicitacaoInterface";

export interface ISolicitacao {
  id: number;
  laboratorioId: number;
  dataSolicitacao: string;
  solicitante: string;
  laboratorio: string;
  status: string;
  itens: IItemSolicitacao[];
  
}