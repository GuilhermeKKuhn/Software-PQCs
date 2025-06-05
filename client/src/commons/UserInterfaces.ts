
export type TipoPerfil = "ADMINISTRADOR" | "RESPONSAVEL_DEPARTAMENTO" | "RESPONSAVEL_LABORATORIO" | '';

export interface IUserLogin {
    email: string;
    password: string;
}

export interface IUser{
  id?: number;
  username?: string; 
  name: string;
  password: string;
  email: string;
  ativo: boolean;
  tipoPerfil: TipoPerfil;
  siape: string;    
}

export interface IUserDTO {
  id: number;
  username: string;
  name: string;
  email: string;
  ativo: boolean;
  tipoPerfil: "ADMINISTRADOR" | "RESPONSAVEL_DEPARTAMENTO" | "RESPONSAVEL_LABORATORIO";
  siape: string;
  laboratoriosId: number[];
  nomesLaboratorios: string[];
  departamentosId: number[];
  nomesDepartamentos: string[];
}
