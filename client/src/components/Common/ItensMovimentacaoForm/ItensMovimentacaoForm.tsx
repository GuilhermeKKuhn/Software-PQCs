import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";

import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";
import { IMovimentacaoForm } from "@/commons/MovimentacoesInterface";
import { IProdutoSimplificado } from "@/commons/ProdutoQuimicoInterface";
import { DialogSelecionarProduto } from "../SelecionarProduto/DialogSelecionarProduto";
import { DialogAdicionarItemEntrada } from "../AdicionarItemEntrada/DialogAdicionarItemEntrada";
import { DialogAdicionarItemTransferencia } from "../AdicionarItemTransferencia/DialogAdicionarItemTransferencia";

interface Props {
  produtos: IProdutoSimplificado[];
  tipoMovimentacao: IMovimentacaoForm["tipo"];
  onAdicionar: (item: IItemMovimentacao) => void;
  laboratorioOrigemId?: number;
  buscarLotesDisponiveis: (produtoId: number) => void;
  lotesDisponiveis: any[];
}

export function ItensMovimentacaoForm({
  produtos,
  tipoMovimentacao,
  onAdicionar,
  laboratorioOrigemId,
  buscarLotesDisponiveis,
  lotesDisponiveis,
}: Props) {
  const toast = useRef<Toast>(null);

  const [dialogProdutoAberto, setDialogProdutoAberto] = useState(false);
  const [dialogEntradaAberto, setDialogEntradaAberto] = useState(false);
  const [dialogTransferenciaAberto, setDialogTransferenciaAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<IProdutoSimplificado | null>(null);

  const handleSelecionarProduto = (produto: IProdutoSimplificado) => {
    setProdutoSelecionado(produto);

    if (tipoMovimentacao === "ENTRADA") {
      setDialogEntradaAberto(true);
    } else {
      buscarLotesDisponiveis(produto.id);
      setDialogTransferenciaAberto(true);
    }

    setDialogProdutoAberto(false);
  };

  const handleAbrirDialogProduto = () => {
    if (!tipoMovimentacao) {
      toast.current?.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Selecione o tipo de movimentação antes de adicionar um item.",
      });
      return;
    }
    setDialogProdutoAberto(true);
  };

  return (
    <div className="container my-4">
      <Toast ref={toast} />

      <div className="d-flex justify-content-end mb-3">
        <Button
          label="Adicionar Item"
          icon="pi pi-plus"
          onClick={handleAbrirDialogProduto}
        />
      </div>

      <DialogSelecionarProduto
        visible={dialogProdutoAberto}
        onHide={() => setDialogProdutoAberto(false)}
        produtos={produtos}
        onSelect={handleSelecionarProduto}
      />

      {produtoSelecionado && (
        <>
          <DialogAdicionarItemEntrada
            visible={dialogEntradaAberto}
            onHide={() => setDialogEntradaAberto(false)}
            produto={produtoSelecionado}
            onAdicionar={onAdicionar}
          />

          <DialogAdicionarItemTransferencia
            visible={dialogTransferenciaAberto}
            onHide={() => setDialogTransferenciaAberto(false)}
            produto={produtoSelecionado}
            lotes={lotesDisponiveis}
            onAdicionar={onAdicionar}
          />
        </>
      )}
    </div>
  );
}
