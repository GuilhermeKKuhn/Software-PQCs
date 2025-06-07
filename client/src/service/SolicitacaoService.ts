import { api } from "@/lib/axios";
import { IItemSolicitacao, ISolicitacaoCreate } from "@/commons/ItemSolicitacaoInterface";
import { ISolicitacao } from "@/commons/Solicitacaointerface";

const listarSolicitacoesPendentes = () => {
  return api.get<ISolicitacao[]>("/solicitacoes/pendentes");
};

const criarSolicitacao = (dto: ISolicitacaoCreate) => {
  return api.post("/solicitacoes", dto);
};

const buscarSolicitacaoPorId = (id: number) => {
  return api.get<ISolicitacao>(`/solicitacoes/${id}`);
};

const aprovarSolicitacao = (id: number, itens: IItemSolicitacao[]) => {
  return api.post(`/solicitacoes/${id}/aprovar`, itens);
};

const gerarMovimentacaoPreenchida = (id: number) => {
  return api.get(`/solicitacoes/${id}/movimentacao-preenchida`);
};

const SolicitacaoService = {
  listarSolicitacoesPendentes,
  criarSolicitacao,
  buscarSolicitacaoPorId,
  aprovarSolicitacao,
  gerarMovimentacaoPreenchida,
};

export default SolicitacaoService;
