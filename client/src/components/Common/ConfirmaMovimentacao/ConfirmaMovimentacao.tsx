import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MovimentacaoService from "@/service/MovimentacaoService";
import SolicitacaoService from "@/service/SolicitacaoService";

import { IMovimentacaoForm } from "@/commons/MovimentacoesInterface";
import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";

interface Props {
  dadosCabecalho: IMovimentacaoForm;
  itens: IItemMovimentacao[];
  validarCabecalho: () => boolean;
}

export function ConfirmarMovimentacao({ dadosCabecalho, itens, validarCabecalho }: Props) {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const formatarData = (data: string | Date | null | undefined) => {
    if (!data) return null;
    const dateObj = typeof data === "string" ? new Date(data) : data;
    return dateObj.toISOString().split("T")[0]; // yyyy-MM-dd
  };

  const handleSubmit = async () => {
    if (!validarCabecalho()) return;

    if (dadosCabecalho.tipo === "ENTRADA") {
      const algumSemDatas = itens.some(
        (item) => !item.fabricacao || !item.validade
      );
      if (algumSemDatas) {
        toast.current?.show({
          severity: "warn",
          summary: "Atenção",
          detail: "Todos os itens precisam ter data de fabricação e validade na entrada.",
        });
        return;
      }
    }

    const payload = {
      ...dadosCabecalho,
      laboratorioOrigem: dadosCabecalho.tipo === "ENTRADA" ? null : dadosCabecalho.laboratorioOrigem,
      itens: itens.map(
        ({ produtoId, quantidadeAprovada, lote, preco, fabricacao, validade }) => ({
          produtoId,
          quantidade: quantidadeAprovada,
          lote,
          preco,
          fabricacao: formatarData(fabricacao),
          validade: formatarData(validade),
        })
      ),
    };

    try {
      setLoading(true);

      if (id) {
        const itensSolicitacaoPayload = itens.map((item) => ({
          id: item.idSolicitacaoItem,
          produtoId: item.produtoId,
          quantidadeSolicitada: item.quantidadeSolicitada ?? 0,
          quantidadeAprovada: item.quantidadeAprovada ?? 0,
          loteSelecionado: item.lote,
          laboratorioOrigemId: dadosCabecalho.laboratorioOrigem?.id ?? 0,
        }));

        await SolicitacaoService.aprovarSolicitacao(Number(id), itensSolicitacaoPayload);

        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Movimentação realizada com sucesso!",
        });

      } else {
        await MovimentacaoService.novaMovimentacao(payload as any);

        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Movimentação realizada com sucesso!",
        });
      }

      setTimeout(() => navigate("/movimentacoes"), 1500);

    } catch (error: any) {
      let mensagem =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Erro inesperado ao processar a movimentação.";

      if (
        typeof error?.response?.data === "string" &&
        error.response.data.includes("HTTP Status 500")
      ) {
        const match = error.response.data.match(
          /<b>Message<\/b>\s*Request processing failed:.*?:(.*?)<\/p>/
        );
        if (match && match[1]) {
          mensagem = match[1].trim();
        }
      }

      const erroEstoque = mensagem.includes("Quantidade insuficiente");

      toast.current?.show({
        severity: "error",
        summary: erroEstoque ? "Estoque insuficiente" : "Erro ao salvar",
        detail: mensagem,
        life: 6000,
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Toast ref={toast} />
      <div className="d-flex justify-content-end">
        <Button
          label="Confirmar Movimentação"
          icon="pi pi-check"
          className="p-button-success"
          loading={loading}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}
