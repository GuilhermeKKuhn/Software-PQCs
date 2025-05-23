export interface IDepartamento {
  id?: number; //ver
  nomeDepartamento: string;
  responsavel: {
    id: number;
    nome?: string;
  };
}