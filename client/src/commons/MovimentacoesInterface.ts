import { ILaboratorio } from "./LaboratorioInterface";
import { INotaFiscal } from "./NotaFiscalInterface";
import { IItemMovimentacao } from "./ItemMovimentacaoInterface";

export interface IMovimentacao {
  id: number;
  tipo: string;
  motivoSaida?: string | null; // <-- Adiciona aqui
  dataMovimentacao?: string;
  notaFiscal?: INotaFiscal | null;
  laboratorioDestino?: ILaboratorio | null;
  laboratorioOrigem?: ILaboratorio | null;
  usuario?: { id: number; nome: string }; // <-- nome aqui no backend vem como "nome"
  itens: IItemMovimentacao[];
  lote?: string;
  quantidade?: number;
}


export interface IMovimentacaoForm {
  tipo: "ENTRADA" | "TRANSFERENCIA" | "SAIDA" | "";
  notaFiscal?: INotaFiscal;
  laboratorioOrigem?: ILaboratorio;
  laboratorioDestino?: ILaboratorio;
  itens: IItemMovimentacao[];
}
