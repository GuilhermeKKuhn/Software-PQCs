export interface ILaboratorio {
  id: number; //ver
  nomeLaboratorio: string;
  sala: string;
  departamento: {
    id: number;
    nomeDepartamento?: string; 
  };
  responsavel: {
    id: number;
    name?: string;
  };
}