export interface IFornecedor {
  id?: number;
  razaoSocial: string;
  cnpj: string;
  endereco: string;
  numero: string;
  cidade: string;
  estado: string;
  telefone: string;
  email: string;
  dataValidadeLicenca: Date | string | null;
}

export type FornecedorPayload = Omit<IFornecedor, 'dataValidadeLicenca'> & {
  dataValidadeLicenca: string | null;
};
