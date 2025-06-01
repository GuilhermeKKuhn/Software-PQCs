
import { IMovimentacao } from "@/commons/MovimentacoesInterface";
import { api } from "@/lib/axios";

const novaMovimentacao = (movimentacao: IMovimentacao) => {
  return api.post("/api/movimentacoes", movimentacao);
};

const listarMovimentacoes = () => {
  return api.get<IMovimentacao[]>("/api/movimentacoes/all");
};

const buscarMovimentacao = (id: number) => {
  return api.get(`/api/movimentacoes/${id}`);
};

const MovimentacaoService = {
    novaMovimentacao,
    listarMovimentacoes,
    buscarMovimentacao
};

export default MovimentacaoService;
