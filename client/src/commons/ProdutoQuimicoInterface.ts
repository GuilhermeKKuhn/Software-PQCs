
export type OrgaoControlador = "POLICIA_FEDERAL" | "POLICIA_MILITAR" | "EXERCITO" | '';


export interface IProdutoQuimico {
  id?: number;
  nome: string;
  cas: string;
  caracteristica: string;
  estadoFisico: string;
  concentracao: string;
  densidade: string;
  orgaos: OrgaoControlador[];
  unidadeMedida: {
    id: number;
    nome?: string;
    sigla?: string;
  }
}


export interface LoteDisponivel {
  lote: string;
  quantidade: number;
  dataFabricacao: string;
  dataValidade: string;
  laboratorioId: number;
  nomeLaboratorio: string;
  cas: string;
  densidade: string;
  concentracao: string;
}



export interface IProdutoSimplificado {
  id: number;
  nome: string;
  cas: string;
  densidade: string;
  concentracao: string;
}