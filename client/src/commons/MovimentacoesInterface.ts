import { ILaboratorio } from "./LaboratorioInterface";
import { INotaFiscal } from "./NotaFiscalInterface";
import { IItemMovimentacao } from "./ItemMovimentacaoInterface";

export interface IMovimentacao {
  id: number;
  tipo: string;
  dataMovimentacao?: string;
  lote?: string;
  quantidade?: number;
  validade?: string;
  notaFiscal?: INotaFiscal;
  itens: IItemMovimentacao[];
  laboratorioOrigem?: ILaboratorio | null;
  laboratorioDestino?: ILaboratorio | null;
  usuario?: {
    id: number;
    nome: string;
  };
}
