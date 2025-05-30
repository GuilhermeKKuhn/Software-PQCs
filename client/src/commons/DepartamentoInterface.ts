export interface IDepartamento {
  id?: number; 
  nomeDepartamento: string;
  sigla: string;
  responsavel: {
    id: number;
    name?: string;
  };
}