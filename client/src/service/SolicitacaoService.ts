import { api } from "@/lib/axios";
import { IItemSolicitacao, ISolicitacaoCreate } from "@/commons/ItemSolicitacaoInterface";
import { ISolicitacao } from "@/commons/Solicitacaointerface";

/**
 * Cria uma nova solicitação de materiais
 */
const criarSolicitacao = (dto: ISolicitacaoCreate) => {
  return api.post("/solicitacoes", dto);
};

/**
 * Busca uma solicitação específica pelo ID
 */
const buscarSolicitacaoPorId = (id: number) => {
  return api.get<ISolicitacao>(`/solicitacoes/${id}`);
};


/**
 * Gera uma movimentação preenchida a partir de uma solicitação
 */
const gerarMovimentacaoPreenchida = (id: number) => {
  return api.get(`/solicitacoes/${id}/movimentacao-preenchida`);
};

/**
 * Marca a solicitação como concluída após a movimentação
 */
const concluir = (id: number) => {
  return api.post(`/solicitacoes/${id}/concluir`);
};

/**
 * Lista todas as solicitações visíveis para o usuário
 */
const listar = () => {
  return api.get<ISolicitacao[]>("/solicitacoes/listartodas");
};

/**
 * Lista as solicitações pendentes (para aprovação)
 */
const listarPendentes = () => {
  return api.get<ISolicitacao[]>("/solicitacoes/pendentes");
};

const SolicitacaoService = {
  criarSolicitacao,
  buscarSolicitacaoPorId,
  gerarMovimentacaoPreenchida,
  concluir,
  listar,
  listarPendentes,
};

export default SolicitacaoService;
