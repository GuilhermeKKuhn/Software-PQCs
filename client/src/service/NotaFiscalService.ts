import { IItemNota, INotaFiscal } from "@/commons/NotaFiscalInterface";
import { api } from "@/lib/axios";


const listarNotas = () => {
  return api.get<INotaFiscal[]>("/notafiscal");
};

const listarItensDaNota = (notaId: number) => {
  return api.get<IItemNota[]>(`/notafiscal/${notaId}/itens`);
};

const NotaFiscalService = {
  listarNotas,
  listarItensDaNota,
};

export default NotaFiscalService;