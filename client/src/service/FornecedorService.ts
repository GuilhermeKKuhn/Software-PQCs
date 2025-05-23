import { IFornecedor } from "@/commons/FornecedorInterface";
import { api } from "@/lib/axios";

const cadastrarFornecedor = (fornecedor: IFornecedor) => {
  return api.post("/fornecedor", fornecedor);
};

const listarFornecedores = () => {
  return api.get<IFornecedor[]>("/fornecedor");
};

const buscarFornecedorPorId = (id: number) => {
  return api.get(`/fornecedor/${id}`);
};

const editarFornecedor = (id: number, fornecedor: IFornecedor) => {
  return api.put(`/fornecedor/${id}`, fornecedor);
};

const deletarFornecedor = (id: number) => {
  return api.delete(`/fornecedor/${id}`);
};

const FornecedorService = {
  cadastrarFornecedor,
  listarFornecedores,
  buscarFornecedorPorId,
  editarFornecedor,
  deletarFornecedor,
};

export default FornecedorService;
