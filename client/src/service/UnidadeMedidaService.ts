import { IUnidadeMedida } from "@/commons/UnidadeMedidaInterface";
import { api } from "@/lib/axios";

const cadastrarUnidadeMedida = (unidade: IUnidadeMedida) => {
  return api.post("/unidademedida", unidade);
};

const listarUnidadesMedida = () => {
  return api.get<IUnidadeMedida[]>("/unidademedida");
};

const buscarUnidadeMedidaPorId = (id: number) => {
  return api.get(`/unidademedida/${id}`);
};

const editarUnidadeMedida = (id: number, unidade: IUnidadeMedida) => {
  return api.put(`/unidademedida/${id}`, unidade);
};

const deletarUnidadeMedida = (id: number) => {
  return api.delete(`/unidademedida/${id}`);
};

const UnidadeMedidaService = {
  cadastrarUnidadeMedida,
  listarUnidadesMedida,
  buscarUnidadeMedidaPorId,
  editarUnidadeMedida,
  deletarUnidadeMedida,
};

export default UnidadeMedidaService;
