
export type OrgaoControlador = "POLICIA_FEDERAL" | "POLICIA_MILITAR" | "EXERCITO" | '';


export interface IProdutoQuimico {
  id?: number;
  nome: string;
  cas: string;
  caracteristica: string;
  estadoFisico: string;
  concentracao: string;
  densidade: string;
  orgaos: OrgaoControlador[]; // Agora é array
  unidadeMedida: {
    id: number;
    nome?: string;
    sigla?: string;
  }
}


export interface LoteDisponivel  {
  lote: string;
  quantidade: number;
  validade: string;
  laboratorioId: number;
};