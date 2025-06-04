import { IEstoqueLote, IEstoqueProduto } from "@/commons/EstoqueInterface";
import { api } from "@/lib/axios";

const buscarEstoquePorProduto = () => {
  return api.get<IEstoqueProduto[]>("/estoques/resumo");
};

const buscarLotesDoProduto = (produtoId: number) => {
  return api.get<IEstoqueLote[]>(`/estoques/lotes/${produtoId}`);
};

const EstoqueService = {
  buscarEstoquePorProduto,
  buscarLotesDoProduto,
};

export default EstoqueService;
