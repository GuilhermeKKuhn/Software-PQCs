import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";

import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";

import { INotaFiscal, IItemNota } from "@/commons/NotaFiscalInterface";
import NotaFiscalService from "@/service/NotaFiscalService";

export function NotaFiscalPage() {
  const [notas, setNotas] = useState<INotaFiscal[]>([]);
  const [search, setSearch] = useState("");
  const [notaSelecionada, setNotaSelecionada] = useState<INotaFiscal | null>(null);
  const [itens, setItens] = useState<IItemNota[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    NotaFiscalService.listarNotas().then(res => setNotas(res.data));
  }, []);

  const filteredNotas = notas.filter(n =>
    n.numeroNotaFiscal.toString().includes(search.toLowerCase()) ||
    n.fornecedor?.razaoSocial?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (nota: INotaFiscal) => {
    setNotaSelecionada(nota);
    NotaFiscalService.listarItensDaNota(nota.id).then(res => {
      setItens(res.data);
      setShowDialog(true);
    });
  };

  function parseLocalDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "-";
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("pt-BR");
  }

  const columns = [
    { field: "numeroNotaFiscal", header: "Nº Nota" },
    {
      field: "dataRecebimento",
      header: "Data",
      body: (row: INotaFiscal) => parseLocalDate(row.dataRecebimento)
    },
    { field: "fornecedor.razaoSocial", header: "Fornecedor" }
  ];

  return (
    <div className="container">
      <PageHeader title="Notas Fiscais" />

      <TableHeader
        left={
          <SearchBar
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar Nota Fiscal"
          />
        }
      />

      <div className="p-card">
        <DataTableComp
          columns={columns}
          data={filteredNotas}
          onRowClick={(e) => handleRowClick(e.data as INotaFiscal)}
        />
      </div>

      <Dialog
        header={`Nota Fiscal Nº ${notaSelecionada?.numeroNotaFiscal}`}
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: "100%", maxWidth: "800px" }}
        modal
      >
        {notaSelecionada && (
          <div className="container-fluid">
            <div className="row gy-3 mb-3">
                <small className="text-muted">Data de Recebimento</small>
                <div className="fw-bold">
                  {parseLocalDate(notaSelecionada.dataRecebimento)}
                </div>
                <div className="border rounded p-3 bg-light">
                  <div className="fw-bold mb-2">{notaSelecionada.fornecedor.razaoSocial}</div>
                  <div className="small text-muted d-flex flex-column gap-1">
                    <div><strong>CNPJ:</strong> {notaSelecionada.fornecedor.cnpj}</div>
                    <div><strong>Endereço:</strong> {notaSelecionada.fornecedor.endereco ?? "-"}, Nº {notaSelecionada.fornecedor.numero ?? "-"}</div>
                    <div><strong>Cidade:</strong> {notaSelecionada.fornecedor.cidade ?? "-"}</div>
                    <div><strong>Estado:</strong> {notaSelecionada.fornecedor.estado ?? "-"}</div>
                    <div><strong>Telefone:</strong> {notaSelecionada.fornecedor.telefone ?? "-"}</div>
                    <div><strong>Email:</strong> {notaSelecionada.fornecedor.email ?? "-"}</div>
                  
                  </div>
              </div>
            </div>

            <h5 className="border-bottom pb-2 mb-3">Itens da Nota</h5>
            <div className="row g-3">
              {itens.map((item, idx) => (
                <div key={idx} className="col-12">
                  <div className="p-3 border rounded bg-light">
                    <div className="fw-bold">{item.nomeProduto}</div>
                    <div className="text-muted small mt-2">
                      <div><strong>Lote:</strong> {item.lote}</div>
                      <div><strong>Quantidade:</strong> {item.quantidade}</div>
                      <div>
                        <strong>Fabricação:</strong> {parseLocalDate(item.fabricacao)}
                      </div>
                      <div>
                        <strong>Validade:</strong>{" "}
                        <span style={{
                          color: item.validade && new Date(item.validade) < new Date() ? "red" : "inherit"
                        }}>
                          {parseLocalDate(item.validade)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
