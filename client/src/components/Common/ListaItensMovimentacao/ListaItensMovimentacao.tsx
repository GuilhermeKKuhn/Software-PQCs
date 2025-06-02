import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";
import { Button } from "primereact/button";

interface Props {
  itens: IItemMovimentacao[];
  onRemove: (index: number) => void;
}

export function ListaItensMovimentacao({ itens, onRemove }: Props) {
  return (
    <div className="container my-4">
      <h5 className="mb-3">Itens da Movimentação</h5>

      {itens.length === 0 ? (
        <p className="text-muted">Nenhum item adicionado.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Produto</th>
                <th>Lote</th>
                <th>Quantidade</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item, index) => (
                <tr key={index}>
                  <td>{item.nomeProduto}</td>
                  <td>{item.lote}</td>
                  <td>{item.quantidade}</td>
                  <td className="text-center">
                    <Button
                      icon="pi pi-trash"
                      className="p-button-danger p-button-sm"
                      onClick={() => onRemove(index)}
                      tooltip="Remover item"
                      tooltipOptions={{ position: "top" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
