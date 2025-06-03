import { Button } from "primereact/button";
import { IMovimentacaoForm } from "@/commons/MovimentacoesInterface";
import MovimentacaoService from "@/service/MovimentacaoService";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";

interface Props {
  dadosCabecalho: IMovimentacaoForm;
  itens: IItemMovimentacao[];
  validarCabecalho: () => boolean;
}

export function ConfirmarMovimentacao({ dadosCabecalho, itens }: Props) {
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!dadosCabecalho.tipo) {
      toast.current?.show({ severity: "warn", summary: "Erro", detail: "Tipo de movimentação é obrigatório." });
      return;
    }

    if (itens.length === 0) {
      toast.current?.show({ severity: "warn", summary: "Erro", detail: "Adicione ao menos um item." });
      return;
    }

    const payload = {
      ...dadosCabecalho,
      itens: itens.map(({ produtoId, quantidade, lote, preco }) => ({
        produtoId,
        quantidade,
        lote,
        preco,
      })),
    };

    try {
      setLoading(true);
      await MovimentacaoService.novaMovimentacao(payload as any);
      toast.current?.show({ severity: "success", summary: "Sucesso", detail: "Movimentação realizada!" });
      setTimeout(() => navigate("/movimentacoes"), 1500);
    } catch (error: any) {
      toast.current?.show({ severity: "error", summary: "Erro", detail: error.message || "Erro ao salvar." });
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
