
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

const gerarMovimentacaoPreenchida = (id: number) => {
  return api.get(`/solicitacoes/${id}/movimentacao-preenchida`)
}

const MovimentacaoService = {
    novaMovimentacao,
    listarMovimentacoes,
    buscarMovimentacao,
    gerarMovimentacaoPreenchida
};

export default MovimentacaoService;
