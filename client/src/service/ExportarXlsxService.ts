import { api } from "@/lib/axios";

// 🔧 Helper para download de arquivo Blob
const downloadBlob = (data: BlobPart, filename: string) => {
  const blob = new Blob([data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const exportarMovimentacoes = async (inicio: Date, fim: Date) => {
  const params = new URLSearchParams({
    inicio: inicio.toISOString().split("T")[0],
    fim: fim.toISOString().split("T")[0],
  });

  const response = await api.get(`/relatorios/movimentacoes?${params.toString()}`, {
    responseType: "blob",
  });

  downloadBlob(response.data, "relatorio-movimentacoes.xlsx");
};

const exportarMovimentacoesPersonalizado = async (
  inicio: Date,
  fim: Date,
  tipos: string[]
) => {
  const params = new URLSearchParams({
    dataInicio: inicio.toISOString().split("T")[0],
    dataFim: fim.toISOString().split("T")[0],
    tipos: tipos.join(","),
  });

  const response = await api.get(
    `/relatorios/movimentacoes-personalizado?${params.toString()}`,
    {
      responseType: "blob",
    }
  );

  downloadBlob(response.data, "relatorio-movimentacoes-personalizado.xlsx");
};

const exportarFornecedores = async () => {
  const response = await api.get("/relatorios/fornecedores", {
    responseType: "blob",
  });
  downloadBlob(response.data, "relatorio-fornecedores.xlsx");
};

const exportarUsuarios = async () => {
  const response = await api.get("/relatorios/usuarios", {
    responseType: "blob",
  });
  downloadBlob(response.data, "relatorio-usuarios.xlsx");
};

const exportarProdutos = async () => {
  const response = await api.get("/relatorios/produtos", {
    responseType: "blob",
  });
  downloadBlob(response.data, "relatorio-produtos.xlsx");
};

const exportarEstoque = async () => {
  const response = await api.get("/relatorios/estoque", {
    responseType: "blob",
  });
  downloadBlob(response.data, "relatorio-estoque.xlsx");
};

export default {
  exportarMovimentacoes,
  exportarMovimentacoesPersonalizado,
  exportarFornecedores,
  exportarUsuarios,
  exportarProdutos,
  exportarEstoque,
};
