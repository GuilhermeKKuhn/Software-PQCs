import { IItemMovimentacao } from "./ItemMovimentacaoInterface";
import { ILaboratorio } from "./LaboratorioInterface";
import { INotaFiscal } from "./NotaFiscalInterface";


export interface IMovimentacaoAgrupada {
  idGrupo: string;
  tipo: string;
  data: string;
  notaFiscal?: INotaFiscal;
  laboratorioDestino?: ILaboratorio | null;
  laboratorioOrigem?: ILaboratorio | null;
  itens: IItemMovimentacao[];
}

