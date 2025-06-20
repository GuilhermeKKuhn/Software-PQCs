import { IFornecedor, FornecedorPayload } from "@/commons/FornecedorInterface";
import { api } from "@/lib/axios";

const cadastrarFornecedor = (fornecedor: FornecedorPayload) => {
  return api.post("/fornecedor", fornecedor);
};

const listarFornecedores = () => {
  return api.get<IFornecedor[]>("/fornecedor");
};

const buscarFornecedorPorId = (id: number) => {
  return api.get<IFornecedor>(`/fornecedor/${id}`);
};

const editarFornecedor = (id: number, fornecedor: FornecedorPayload) => {
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
