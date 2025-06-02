
export type OrgaoControlador = "POLICIA_FEDERAL" | "POLICIA_MILITAR" | "EXERCITO" | '';


export interface IProdutoQuimico {
  id?: number;
  nome: string;
  cas: string;
  validade: number; 
  caracteristica: string;
  orgao: OrgaoControlador;
  estadoFisico: string;
  unidadeMedida: {
    id: number;
    nome?: string; 
    sigla?: string;
  };
}


export interface LoteDisponivel  {
  lote: string;
  quantidade: number;
  validade: string;
  laboratorioId: number;
};