import { IItemMovimentacao } from "./ItemMovimentacaoInterface";
import { ILaboratorio } from "./LaboratorioInterface";
import { INotaFiscal } from "./NotaFiscalInterface";
import { IUser } from "./UserInterfaces";


export interface IMovimentacaoAgrupada {
  idGrupo: string;
  tipo: string;
  data: string;
  notaFiscal?: INotaFiscal;
  laboratorioDestino?: ILaboratorio | null;
  laboratorioOrigem?: ILaboratorio | null;
  itens: IItemMovimentacao[];
  usuario?: IUser;
}

