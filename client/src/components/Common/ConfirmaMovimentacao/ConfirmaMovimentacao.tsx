import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
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

export function ConfirmarMovimentacao({
  dadosCabecalho,
  itens,
  validarCabecalho,
}: Props) {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [dialogMotivoAberto, setDialogMotivoAberto] = useState(false);
  const [motivoSaida, setMotivoSaida] = useState<string | null>(null);

  const motivos = [
    { label: "Atividades de Ensino", value: "ATIVIDADES_ENSINO" },
    { label: "Atividades de Pesquisa", value: "ATIVIDADES_PESQUISA" },
    { label: "Atividades de Extensão", value: "ATIVIDADES_EXTENSAO" },
    { label: "Outros", value: "OUTROS" },
  ];

  const formatarData = (data: string | Date | null | undefined) => {
    if (!data) return null;
    const dateObj = typeof data === "string" ? new Date(data) : data;
    return dateObj.toISOString().split("T")[0];
  };

  const handleSubmit = () => {
    if (!validarCabecalho()) return;

    if (!itens || itens.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Adicione pelo menos um item na movimentação.",
      });
      return;
    }

    if (dadosCabecalho.tipo === "ENTRADA") {
      const algumSemDatas = itens.some(
        (item) => !item.fabricacao || !item.validade
      );
      if (algumSemDatas) {
        toast.current?.show({
          severity: "warn",
          summary: "Atenção",
          detail:
            "Todos os itens precisam ter data de fabricação e validade na entrada.",
        });
        return;
      }
    }

    if (dadosCabecalho.tipo === "SAIDA") {
      setDialogMotivoAberto(true);
    } else {
      executarConfirmacao(null);
    }
  };

  const executarConfirmacao = async (motivo: string | null) => {
    const payload = {
      ...dadosCabecalho,
      motivoSaida: motivo,
      laboratorioOrigem:
        dadosCabecalho.tipo === "ENTRADA"
          ? null
          : dadosCabecalho.laboratorioOrigem,
      itens: itens.map(
        ({
          produtoId,
          quantidadeAprovada,
          lote,
          preco,
          fabricacao,
          validade,
        }) => ({
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

      
      await MovimentacaoService.novaMovimentacao(payload as any);

      
      if (id) {
        await SolicitacaoService.concluir(Number(id));
      }

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Movimentação realizada com sucesso!",
      });

      setTimeout(() => navigate("/movimentacoes"), 1500);
    } catch (error: any) {
      let mensagem =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Erro inesperado ao processar a movimentação.";

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

      <Dialog
        header="Motivo da Saída"
        visible={dialogMotivoAberto}
        onHide={() => setDialogMotivoAberto(false)}
        modal
        style={{ width: "400px" }}
        footer={
          <div className="d-flex justify-content-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={() => setDialogMotivoAberto(false)}
              className="p-button-text"
            />
            <Button
              label="Confirmar"
              icon="pi pi-check"
              onClick={() => {
                if (!motivoSaida) {
                  toast.current?.show({
                    severity: "warn",
                    summary: "Atenção",
                    detail: "Selecione um motivo.",
                  });
                  return;
                }
                setDialogMotivoAberto(false);
                executarConfirmacao(motivoSaida);
              }}
            />
          </div>
        }
      >
        <div className="field">
          <label htmlFor="motivo">Selecione o motivo da saída</label>
          <Dropdown
            id="motivo"
            value={motivoSaida}
            options={motivos}
            onChange={(e) => setMotivoSaida(e.value)}
            placeholder="Selecione"
            className="w-100"
          />
        </div>
      </Dialog>
    </div>
  );
}
