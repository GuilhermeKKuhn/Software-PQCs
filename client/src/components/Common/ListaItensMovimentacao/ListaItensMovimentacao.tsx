import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";
import { Button } from "primereact/button";

interface Props {
  itens: IItemMovimentacao[];
  onEditar: (index: number, item: IItemMovimentacao) => void;
  onRemover: (index: number) => void;
}

export function ListaItensMovimentacao({
  itens,
  onEditar,
  onRemover,
}: Props) {
  return (
    <div className="container my-4">
      <h5 className="mb-3">Itens da Movimentação</h5>

      {itens.length === 0 ? (
        <p className="text-muted">Nenhum item adicionado.</p>
      ) : (
        <div className="d-grid gap-3">
          {itens.map((item, index) => (
            <div
              key={index}
              className="border rounded p-3 bg-light shadow-sm d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{item.nomeProduto}</strong>
                <div className="small text-muted">
                  <span className="me-3">
                    <strong>Lote:</strong> {item.lote || "-"}
                  </span>
                  <span className="me-3">
                    <strong>Qtd:</strong> {item.quantidadeAprovada}
                  </span>
                  {item.fabricacao && (
                    <span className="me-3">
                      <strong>Fabricação:</strong>{" "}
                      {new Date(item.fabricacao).toLocaleDateString()}
                    </span>
                  )}
                  {item.validade && (
                    <span className="me-3">
                      <strong>Validade:</strong>{" "}
                      {new Date(item.validade).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-info p-button-sm"
                  tooltip="Editar"
                  onClick={() => onEditar(index, item)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger p-button-sm"
                  tooltip="Remover"
                  onClick={() => onRemover(index)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
