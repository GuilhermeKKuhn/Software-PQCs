export interface IProdutoQuimico {
  id?: number;
  nome: string;
  cas: string;
  validade: number; 
  caracteristica: string;
  estadoFisico: string;
  unidadeMedida: {
    id: number;
    nome?: string; 
    sigla?: string;
  };
}
