import { IUnidadeMedida } from "@/commons/UnidadeMedidaInterface";
import { api } from "@/lib/axios";
import { AxiosRequestConfig } from "axios";

const cadastrarUnidadeMedida = (unidade: IUnidadeMedida) => {
  return api.post("/unidademedida", unidade);
};

const listarUnidadesMedida = () => {
  return api.get<IUnidadeMedida[]>("/unidademedida");
};

const buscarUnidadeMedidaPorId = (id: number, config?: AxiosRequestConfig) => {
  return api.get(`/unidademedida/${id}`, config);
};

const editarUnidadeMedida = (id: number, data: IUnidadeMedida) => {
  return api.put(`/unidademedida/${id}`, data);
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
