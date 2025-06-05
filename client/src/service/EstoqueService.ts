import { IEstoqueLote, IEstoqueProduto } from "@/commons/EstoqueInterface";
import { api } from "@/lib/axios";

const buscarEstoquePorProduto = () => {
  return api.get<IEstoqueProduto[]>("/estoques/resumo");
};

const buscarLotesDoProduto = (produtoId: number) => {
  return api.get<IEstoqueLote[]>(`/estoques/lotes/${produtoId}`);
};

const buscarLotesPorProdutoELaboratorio = (produtoId: number, laboratorioId: number) => {
  return api.get("/estoques/lotes-disponiveis", {
    params: { produtoId, laboratorioId },
  });
};

const buscarEstoquePorLaboratorios = (ids: number[]) => {
  return api.post("/estoques/resumo/laboratorios", ids);
};

const buscarEstoquePorDepartamentos = (ids: number[]) => {
  return api.post("/estoques/resumo/departamentos", ids);
};

const buscarLotesDoProdutoDoLaboratorio = (produtoId: number, laboratorioId: number) => {
  return api.get(`/estoques/lotes-disponiveis?produtoId=${produtoId}&laboratorioId=${laboratorioId}`);
};

const buscarLotesDoProdutoDosLaboratorios = (
  produtoId: number,
  laboratoriosIds: number[]
) => {
  return api.get(`/estoques/lotes-disponiveis/multilabs`, {
    params: {
      produtoId,
      laboratoriosIds,
    },
    paramsSerializer: {
      serialize: (params: Record<string, any>) => {
        const query = new URLSearchParams();
        query.append("produtoId", params.produtoId.toString());
        params.laboratoriosIds.forEach((id: number) =>
          query.append("laboratoriosIds", id.toString())
        );
        return query.toString();
      },
    },
  });
};

const buscarLotesPorProdutoEDepartamentos = (produtoId: number, departamentosIds: number[]) => {
  return api.get("/estoques/lotes-disponiveis/departamentos", {
    params: { produtoId, departamentosIds },
    paramsSerializer: {
      serialize: (params: Record<string, any>) => {
        const query = new URLSearchParams();
        query.append("produtoId", params.produtoId.toString());
        params.departamentosIds.forEach((id: number) => {
          query.append("departamentosIds", id.toString());
        });
        return query.toString();
      },
    },
  });
};

const EstoqueService = {
  buscarEstoquePorProduto,
  buscarLotesDoProduto,
  buscarLotesPorProdutoELaboratorio,
  buscarEstoquePorLaboratorios,
  buscarEstoquePorDepartamentos,
  buscarLotesDoProdutoDoLaboratorio,
  buscarLotesDoProdutoDosLaboratorios,
  buscarLotesPorProdutoEDepartamentos
};

export default EstoqueService;
