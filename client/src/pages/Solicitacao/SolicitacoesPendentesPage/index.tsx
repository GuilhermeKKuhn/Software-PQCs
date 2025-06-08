import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SolicitacaoService from "@/service/SolicitacaoService";
import { ISolicitacao } from "@/commons/Solicitacaointerface";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { format } from "date-fns";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { DetalhesDialog } from "@/components/Common/DetalhesDialog/DetalhesDialog";

export function SolicitacoesPendentesPage() {
  const [solicitacoes, setSolicitacoes] = useState<ISolicitacao[]>([]);
  const [search, setSearch] = useState("");
  const [selecionada, setSelecionada] = useState<ISolicitacao | null>(null);
  const [detalhesVisivel, setDetalhesVisivel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    SolicitacaoService.listar().then((res) => {
      const ordenadas = [...res.data].sort(
        (a, b) =>
          new Date(b.dataSolicitacao).getTime() -
          new Date(a.dataSolicitacao).getTime()
      );
      setSolicitacoes(ordenadas);
    });
  }, []);

  const filtered = solicitacoes.filter((s) => {
    const termo = search.toLowerCase();
    return (
      s.solicitante.toLowerCase().includes(termo) ||
      s.status.toLowerCase().includes(termo) ||
      s.dataSolicitacao.toLowerCase().includes(termo) ||
      s.laboratorio?.nomeLaboratorio.toLowerCase().includes(termo) ||
      s.laboratorio?.sala.toLowerCase().includes(termo)
    );
  });

  const columns = [
    {
      field: "dataSolicitacao",
      header: "Data",
      body: (rowData: ISolicitacao) =>
        format(new Date(rowData.dataSolicitacao), "dd/MM/yyyy"),
      headerStyle: { textAlign: "center" as const },
      bodyStyle: { textAlign: "left" as const },
    },
    {
      field: "solicitante",
      header: "Solicitante",
      headerStyle: { textAlign: "center" as const },
      bodyStyle: { textAlign: "left" as const },
    },
    {
      field: "laboratorio",
      header: "Laboratório",
      body: (rowData: ISolicitacao) =>
        `${rowData.laboratorio?.nomeLaboratorio}`,
      headerStyle: { textAlign: "center" as const },
      bodyStyle: { textAlign: "left" as const },
    },
    {
      field: "status",
      header: "Status",
      headerStyle: { textAlign: "center" as const },
      bodyStyle: { textAlign: "left" as const },
    },
  ];

  const handleRowClick = (e: any) => {
    const solicitacao = e.data as ISolicitacao;
    const status = solicitacao.status.toUpperCase();

    if (status === "APROVADA" || status === "RECUSADA") {
      setSelecionada(solicitacao);
      setDetalhesVisivel(true);
    } else {
      navigate(`/movimentacoes/nova/${solicitacao.id}`);
    }
  };

  return (
    <div className="container">
      <PageHeader title="Solicitações" />

      <TableHeader
        left={
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar Solicitação"
          />
        }
      />

      <DataTableComp
        columns={columns}
        data={filtered}
        onRowClick={handleRowClick}
      />

      {selecionada && (
        <DetalhesDialog
          data={selecionada}
          visible={detalhesVisivel}
          onHide={() => setDetalhesVisivel(false)}
          titulo="Detalhes da Solicitação"
          campos={[
            {
              label: "Data",
              field: "dataSolicitacao",
              body: (data) =>
                data?.dataSolicitacao
                  ? new Date(data.dataSolicitacao).toLocaleDateString("pt-BR")
                  : "-",
            },
            { label: "Solicitante", field: "solicitante" },
            {
              label: "Laboratório",
              field: "laboratorio.nomeLaboratorio",
              body: (data) => `${data.laboratorio?.nomeLaboratorio ?? "-"}`,
            },
            { label: "Status", field: "status" },
            {
              label: "Itens",
              field: "itens",
              body: (data) => (
                <div className="mt-2">
                  {data.itens?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="mb-2 p-2 border rounded bg-light shadow-sm"
                    >
                      <strong>Produto: {item.nomeProduto ?? "N/A"}</strong>
                      <div className="small text-muted">
                        <span className="me-3">
                          Qtd. Solicitada:{" "}
                          <strong>{item.quantidadeSolicitada}</strong>
                        </span>
                        {item.quantidadeAprovada !== undefined && (
                          <span className="me-3">
                            Qtd. Aprovada:{" "}
                            <strong>{item.quantidadeAprovada}</strong>
                          </span>
                        )}
                        {item.loteSelecionado && (
                          <span>
                            Lote: <strong>{item.loteSelecionado}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
