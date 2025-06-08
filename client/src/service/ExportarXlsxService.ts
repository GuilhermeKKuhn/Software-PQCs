import { api } from "@/lib/axios";

const exportarMovimentacoes = async (inicio: Date, fim: Date) => {
  const params = new URLSearchParams({
    inicio: inicio.toISOString().split("T")[0],
    fim: fim.toISOString().split("T")[0],
  });

  const response = await api.get(`/relatorios/movimentacoes?${params.toString()}`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "relatorio-movimentacoes.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const exportarFornecedores = () => {
  return api.get("/relatorios/fornecedores", {
    responseType: "blob",
  });
};

const exportarUsuarios = () => {
  return api.get("/relatorios/usuarios", { responseType: "blob" });
};

const exportarProdutos = () => {
  return api.get("/relatorios/produtos", {
    responseType: "blob",
  });
};

const exportarEstoque = () => {
  return api.get("/relatorios/estoque", {
    responseType: "blob",
  });
};

export default {
  exportarMovimentacoes,
  exportarFornecedores,
  exportarUsuarios,
  exportarProdutos,
  exportarEstoque
};
