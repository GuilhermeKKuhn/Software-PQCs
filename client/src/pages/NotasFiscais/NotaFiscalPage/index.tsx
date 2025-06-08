import { useEffect, useState } from "react";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { Dialog } from "primereact/dialog";
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
    n.numeroNotaFiscal.toString().includes(search.toLowerCase())
    || n.fornecedor?.razaoSocial?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (nota: INotaFiscal) => {
    setNotaSelecionada(nota);
    NotaFiscalService.listarItensDaNota(nota.id).then(res => {
      setItens(res.data);
      setShowDialog(true);
    });
  };

  function parseLocalDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const columns = [
    { field: "numeroNotaFiscal", header: "Nº Nota" },
    {
      field: "dataRecebimento",
      header: "Data",
      body: (row: INotaFiscal) =>
        parseLocalDate(row.dataRecebimento).toLocaleDateString("pt-BR")
    },
    { field: "fornecedor.razaoSocial", header: "Fornecedor" },
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
        header={`Nota Fiscal ${notaSelecionada?.numeroNotaFiscal}`}
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: "100%", maxWidth: "700px" }}
        modal
      >
        {notaSelecionada && (
          <div className="container-fluid">
            <div className="row gy-3 mb-3">
              <div className="col-12">
                <small className="text-muted">Data de Recebimento</small>
                <div className="fw-bold">
                  {parseLocalDate(notaSelecionada.dataRecebimento).toLocaleDateString("pt-BR")}
                </div>
              </div>

              <div className="col-12">
                <small className="text-muted">Fornecedor</small>
                <div className="fw-bold">{notaSelecionada.fornecedor.razaoSocial}</div>
              </div>
            </div>

            <h5 className="border-bottom pb-2 mb-3">Itens da Nota</h5>
            <div className="row g-3">
              {itens.map((item, idx) => (
                <div key={idx} className="col-12">
                  <div className="p-3 border rounded bg-light">
                    <div className="fw-bold">{item.nomeProduto}</div>
                    <div className="text-muted small mt-2">
                      <div>Lote: <strong>{item.lote}</strong></div>
                      <div>Quantidade: <strong>{item.quantidade}</strong></div>
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
