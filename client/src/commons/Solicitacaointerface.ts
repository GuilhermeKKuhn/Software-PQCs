import { IItemSolicitacao } from "./ItemSolicitacaoInterface";

export interface ISolicitacao {
  id: number;
  laboratorioId: number;
  dataSolicitacao: string;
  solicitante: string;
  laboratorio: {
    nomeLaboratorio: string;
    sala: string;
  };
  status: string;
  itens: IItemSolicitacao[];
  
}