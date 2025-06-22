import { INotaFiscal } from "./NotaFiscalInterface";
import { ILaboratorio } from "./LaboratorioInterface";
import { IItemMovimentacao } from "./ItemMovimentacaoInterface";

export interface IMovimentacaoAgrupada {
  idGrupo: string;
  tipo: string;
  motivoSaida?: string | null; 
  data: string;
  notaFiscal?: INotaFiscal;
  laboratorioDestino?: ILaboratorio | null;
  laboratorioOrigem?: ILaboratorio | null;
  itens: IItemMovimentacao[];
  usuario?: { id: number; name: string };
}

export type IUsuarioSimplificado = {
  id: number;
  name: string;
};
