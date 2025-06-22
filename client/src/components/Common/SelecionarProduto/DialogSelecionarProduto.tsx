import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState } from "react";
import { IProdutoSimplificado } from "@/commons/ProdutoQuimicoInterface";


interface DialogSelecionarProdutoProps {
  visible: boolean;
  onHide: () => void;
  produtos: IProdutoSimplificado[];
  onSelect: (produto: IProdutoSimplificado) => void;
}

export function DialogSelecionarProduto({
  visible,
  onHide,
  produtos,
  onSelect,
}: DialogSelecionarProdutoProps) {
  const [filtro, setFiltro] = useState("");

  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      p.cas.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Dialog
      header="Selecionar Produto"
      visible={visible}
      onHide={onHide}
      style={{ width: "600px", maxWidth: "90%" }}
      modal
    >
      <div className="mb-3">
        <InputText
          placeholder="Filtrar por nome ou CAS..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-100"
        />
      </div>

      {produtosFiltrados.length === 0 ? (
        <p className="text-muted">Nenhum produto encontrado.</p>
      ) : (
        <div className="d-grid gap-2">
          {produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className="border rounded p-3 bg-light d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{produto.nome}</strong>
                <div className="small text-muted">
                  <span><strong>CAS:</strong> {produto.cas}</span> |{" "}
                  <span><strong>Densidade:</strong> {produto.densidade}</span> |{" "}
                  <span><strong>Concentração:</strong> {produto.concentracao}</span>
                </div>
              </div>
              <Button
                icon="pi pi-check"
                className="p-button-sm"
                onClick={() => onSelect(produto)}
              />
            </div>
          ))}
        </div>
      )}
    </Dialog>
  );
}
