import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { IMovimentacaoForm } from "@/commons/MovimentacoesInterface";
import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";
import ProdutoQuimicoService from "@/service/ProdutoQuimicoService";

interface Props {
  produtos: { id: number; nome: string }[];
  tipoMovimentacao: IMovimentacaoForm["tipo"];
  onAdicionar: (item: IItemMovimentacao) => void;
  itens: IItemMovimentacao[];
  laboratorioOrigemId?: number;
}

type LoteDisponivel = {
  lote: string;
  quantidade: number;
  validade: string;
  laboratorioId?: number;
  laboratorioNome?: string; 
};

export function ItensMovimentacaoForm({
  produtos,
  tipoMovimentacao,
  onAdicionar,
  laboratorioOrigemId,
}: Props) {
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [lote, setLote] = useState("");
  const [quantidade, setQuantidade] = useState<number | null>(null);
  const [preco, setPreco] = useState<number | null>(null);
  const [lotesDisponiveis, setLotesDisponiveis] = useState<LoteDisponivel[]>([]);
  const [showLoteDialog, setShowLoteDialog] = useState(false);

  const camposDesabilitados = !tipoMovimentacao;

  useEffect(() => {
    if ((tipoMovimentacao === "SAIDA" || tipoMovimentacao === "TRANSFERENCIA") && produtoId) {
      if (!laboratorioOrigemId) {
        alert("Selecione o laboratório de origem primeiro.");
        return;
      }

      ProdutoQuimicoService.buscarLotesDisponiveis(produtoId, laboratorioOrigemId).then((res) => {
        setLotesDisponiveis(res.data);
        setShowLoteDialog(true);
      });
    }
  }, [produtoId, laboratorioOrigemId, tipoMovimentacao]);

  const handleAdicionar = () => {
    if (!produtoId || !lote || quantidade === null) return;

    if (
      tipoMovimentacao !== "ENTRADA" &&
      !lotesDisponiveis.find((l) => l.lote === lote)
    ) {
      alert("Lote inválido para movimentação.");
      return;
    }

    const produto = produtos.find((p) => p.id === produtoId);

    onAdicionar({
    produtoId,
    nomeProduto: produto?.nome ?? "",
    lote,
    quantidadeSolicitada: quantidade ?? 0, // adiciona aqui
    quantidadeAprovada: quantidade ?? 0,
    preco: tipoMovimentacao === "ENTRADA" ? preco : null,
  });
    setProdutoId(null);
    setLote("");
    setQuantidade(null);
    setPreco(null);
  };

  return (
    <div className="container border rounded bg-white p-4 mt-4">
      <h5 className="mb-4">Itens da Movimentação</h5>

      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Produto</label>
          <Dropdown
            value={produtoId}
            onChange={(e) => setProdutoId(e.value)}
            options={produtos.map((p) => ({ label: p.nome, value: p.id }))}
            placeholder="Produto"
            disabled={camposDesabilitados}
            className="w-100"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Lote</label>
          <InputText
            value={lote}
            onChange={(e) => setLote(e.target.value)}
            placeholder={tipoMovimentacao === "ENTRADA" ? "Lote" : "Selecionar"}
            disabled={tipoMovimentacao !== "ENTRADA"}
            className="form-control"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Quantidade</label>
          <InputNumber
            value={quantidade}
            onValueChange={(e) => setQuantidade(e.value ?? null)}
            placeholder="Qtd"
            disabled={camposDesabilitados}
            className="w-100"
          />
        </div>

        <div className="col-md-3 d-flex align-items-end justify-content-end">
          <Button
            label="Adicionar Item"
            icon="pi pi-plus"
            onClick={handleAdicionar}
            disabled={camposDesabilitados}
            className="w-100"
          />
        </div>
      </div>

      <Dialog
        header="Selecionar Lote"
        visible={showLoteDialog}
        onHide={() => setShowLoteDialog(false)}
        modal
        style={{ width: "100%", maxWidth: "600px" }}
        contentStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {lotesDisponiveis.length === 0 ? (
          <p className="text-muted">Nenhum lote disponível para este produto.</p>
        ) : (
          <div className="d-grid gap-3">
            {lotesDisponiveis.map((loteDisp, index) => (
              <div key={index} className="border rounded p-3 bg-light">
                <div className="mb-2">
                  <strong>Lote:</strong> {loteDisp.lote}<br />
                  <strong>Validade:</strong>{" "}
                  {new Date(loteDisp.validade).toLocaleDateString()}<br />
                  <strong>Qtd:</strong> {loteDisp.quantidade}<br />
                  {loteDisp.laboratorioNome && (
                    <>
                      <strong>Lab:</strong> {loteDisp.laboratorioNome}
                    </>
                  )}
                </div>
                <div className="text-end">
                  <Button
                    label="Usar"
                    icon="pi pi-check"
                    className="p-button-sm p-button-success"
                    onClick={() => {
                      setLote(loteDisp.lote);
                      setShowLoteDialog(false);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Dialog>
    </div>
  );
}
