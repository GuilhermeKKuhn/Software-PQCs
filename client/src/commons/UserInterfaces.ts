
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