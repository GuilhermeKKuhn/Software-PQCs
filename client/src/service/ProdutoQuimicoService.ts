import { IProdutoQuimico, LoteDisponivel } from "@/commons/ProdutoQuimicoInterface";
import { api } from "@/lib/axios";

const cadastrarProdutoQuimico = (produto: IProdutoQuimico) => {
  return api.post("/produtoquimico", produto);
};

const listarProdutosQuimicos = () => {
  return api.get<IProdutoQuimico[]>("/produtoquimico");
};

const buscarProdutoQuimicoPorId = (id: number) => {
  return api.get(`/produtoquimico/${id}`);
};

const editarProdutoQuimico = (id: number, produto: IProdutoQuimico) => {
  return api.put(`/produtoquimico/${id}`, produto);
};

const deletarProdutoQuimico = (id: number) => {
  return api.delete(`/produtoquimico/${id}`);
};

const buscarLotesDisponiveis = (id: number) => {
  return api.get<LoteDisponivel[]>(`/produtoquimico/lotes-disponiveis/${id}`);
}


const ProdutoQuimicoService = {
  cadastrarProdutoQuimico,
  listarProdutosQuimicos,
  buscarProdutoQuimicoPorId,
  editarProdutoQuimico,
  deletarProdutoQuimico,
  buscarLotesDisponiveis,
};

export default ProdutoQuimicoService;
