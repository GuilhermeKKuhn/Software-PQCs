import { ILaboratorio } from "@/commons/LaboratorioInterface";
import { api } from "@/lib/axios";

const cadastrarLaboratorio = (laboratorio: ILaboratorio) => {
  return api.post("/laboratorio", laboratorio);
};

const listarLaboratorios = () => {
  return api.get<ILaboratorio[]>("/laboratorio");
};

const buscarLaboratorioPorId = (id: number) => {
  return api.get(`/laboratorio/${id}`);
};

const editarLaboratorio = (id: number, laboratorio: ILaboratorio) => {
  return api.put(`/laboratorio/${id}`, laboratorio);
};

const deletarLaboratorio = (id: number) => {
  return api.delete(`/laboratorio/${id}`);
};

const LaboratorioService = {
  cadastrarLaboratorio,
  listarLaboratorios,
  buscarLaboratorioPorId,
  editarLaboratorio,
  deletarLaboratorio
};

export default LaboratorioService;
