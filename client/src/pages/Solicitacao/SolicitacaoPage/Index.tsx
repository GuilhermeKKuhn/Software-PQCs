import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { ActionButtonCreate } from "@/components/Common/ActionButtonCreate/ActionButtonCreate";
import SolicitacaoService from "@/service/SolicitacaoService";
import { ISolicitacao } from "@/commons/Solicitacaointerface";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { DetalhesDialog } from "@/components/Common/DetalhesDialog/DetalhesDialog";
import { format } from "date-fns";

export function SolicitacaoPage() {
  const navigate = useNavigate();
  const [solicitacoes, setSolicitacoes] = useState<ISolicitacao[]>([]);
  const [search, setSearch] = useState("");
  const [detalhesVisivel, setDetalhesVisivel] = useState(false);
  const [selecionada, setSelecionada] = useState<ISolicitacao | null>(null);

  useEffect(() => {
    SolicitacaoService.listarSolicitacoesPendentes().then((res) => {
      setSolicitacoes(res.data);
    });
  }, []);

  const filtered = solicitacoes.filter((s) =>
    s.itens.some((item) =>
      item.produtoId.toString().includes(search.toLowerCase())
    )
  );

  const columns = [
    {
      field: "dataSolicitacao",
      header: "Data",
      body: (rowData: ISolicitacao) =>
        rowData.dataSolicitacao
          ? format(new Date(rowData.dataSolicitacao), "dd/MM/yyyy")
          : "-",
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
        `${rowData.laboratorio?? "-"}`,
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

  return (
    <div className="container">
      <PageHeader title="Solicitações de Materiais" />

      <TableHeader
        left={
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por produto ou ID"
          />
        }
        right={
          <ActionButtonCreate
            label="Nova Solicitação"
            onClick={() => navigate("/solicitacoes/novo")}
          />
        }
      />

      <div className="p-card">
        <DataTableComp
          columns={columns}
          data={filtered}
          onRowClick={(e) => {
            setSelecionada(e.data as ISolicitacao);
            setDetalhesVisivel(true);
          }}
        />
      </div>

      {selecionada && (
        <DetalhesDialog
          data={selecionada}
          visible={detalhesVisivel}
          onHide={() => setDetalhesVisivel(false)}
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
              body: (data) =>
                `${data.laboratorio?.nomeLaboratorio ?? ""} ${data.laboratorio ?? "-"}`,
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
          titulo="Detalhes da Solicitação"
        />
      )}
    </div>
  );
}
