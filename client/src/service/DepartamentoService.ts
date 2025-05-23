
import { IDepartamento } from "@/commons/DepartamentoInterface";
import { api } from "@/lib/axios";

const cadastrarDepartamento = (departamento: IDepartamento) => {
  return api.post("/departamento", departamento);
};

const listarDepartamentos = () => {
  return api.get<IDepartamento[]>("/departamento");
};

const buscarDepartamentoPorId = (id: number) => {
  return api.get(`/departamento/${id}`);
};

const editarDepartamento = (id: number, departamento: IDepartamento) => {
  return api.put(`/departamento/${id}`, departamento);
};

const deletarDepartamento = (id: number) => {
  return api.delete(`/departamento/${id}`);
};

const DepartamentoService = {
    cadastrarDepartamento,
    listarDepartamentos,
    buscarDepartamentoPorId,
    editarDepartamento,
    deletarDepartamento
}

export default DepartamentoService;