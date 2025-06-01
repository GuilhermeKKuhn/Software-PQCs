import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IItemMovimentacao, IMovimentacao } from "@/commons/MovimentacoesInterface";
import MovimentacaoService from "@/service/MovimentacaoService";
import { ActionButtons } from "@/components/Common/ActionButton/ActionButton";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { ActionButtonCreate } from "@/components/Common/ActionButtonCreate/ActionButtonCreate";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { DetalhesDialog } from "@/components/Common/DetalhesDialog/DetalhesDialog";
import { DeleteConfirm } from "@/components/Common/DeleteConfirm/DeleteConfirm";

export function MovimentacaoPage() {
  const navigate = useNavigate();
  const [movimentacoes, setMovimentacoes] = useState<IMovimentacao[]>([]);
  const [search, setSearch] = useState('');
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] = useState<IMovimentacao | null>(null);
  const [detalhesVisivel, setDetalhesVisivel] = useState(false);

  const filteredMovimentacoes = movimentacoes.filter((mov) => {
    const termo = search.toLowerCase();

    return (
      mov.tipo?.toLowerCase().includes(termo) ||
      mov.itens?.some(item => item.lote?.toLowerCase().includes(termo)) ||
      String(mov.notaFiscal?.numeroNotaFiscal ?? '').includes(termo)
    );
  });

  useEffect(() => {
    MovimentacaoService.listarMovimentacoes().then((res) => {
      setMovimentacoes(res.data);
    });
  }, []);

  const columns = [
    { field: "tipo", header: "Tipo" },
    {
      field: "data",
      header: "Data",
      body: (row: IMovimentacao) =>
        row.notaFiscal?.dataRecebimento
          ? new Date(row.notaFiscal.dataRecebimento).toLocaleDateString("pt-BR")
          : "-"
    },
    {
      field: "notaFiscal.numeroNotaFiscal",
      header: "Nota Fiscal",
      body: (row: IMovimentacao) => row.notaFiscal?.numeroNotaFiscal ?? "-"
    },
    {
      field: "laboratorioDestino.nome",
      header: "Destino",
      body: (row: IMovimentacao) => row.laboratorioDestino?.nome ?? "-"
    },
    {
      field: "acoes",
      header: "Ações",
      body: (row: IMovimentacao) => (
        <ActionButtons
          onEdit={() => console.log("Editar movimentação", row.id)}
          onDelete={() => console.log("Excluir movimentação", row.id)}
        />
      ),
      bodyStyle: { textAlign: 'right' as const },
      headerStyle: { textAlign: 'right' as const },
    },
  ];

  return (
    <div className="container">
      <PageHeader title="Movimentações" />

      <TableHeader
        left={
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar movimentação"
          />
        }
        right={
          <ActionButtonCreate
            label="Nova Movimentação"
            onClick={() => navigate("/movimentacao/nova")}
          />
        }
      />

      <div className="p-card">
        <DataTableComp
          columns={columns}
          data={filteredMovimentacoes}
          onRowClick={(e) => {
            setMovimentacaoSelecionada(e.data as IMovimentacao);
            setDetalhesVisivel(true);
          }}
        />
      </div>

      {movimentacaoSelecionada && (
        <DetalhesDialog
          data={movimentacaoSelecionada}
          visible={detalhesVisivel}
          onHide={() => setDetalhesVisivel(false)}
          campos={[
            { label: 'Tipo', field: 'tipo' },
            {
              label: 'Data',
              field: 'notaFiscal.dataRecebimento',
              body: (data) =>
                data.notaFiscal?.dataRecebimento
                  ? new Date(data.notaFiscal.dataRecebimento).toLocaleDateString("pt-BR")
                  : "-"
            },
            {
              label: 'Nota Fiscal',
              field: 'notaFiscal.numeroNotaFiscal'
            },
            {
              label: 'Fornecedor',
              field: 'notaFiscal.fornecedor.razaoSocial',
              body: (data) => data.notaFiscal?.fornecedor?.razaoSocial ?? "-"
            },
            {
              label: 'Origem',
              field: 'laboratorioOrigem.nome',
              body: (data) => data.laboratorioOrigem?.nome ?? "-"
            },
            {
              label: 'Destino',
              field: 'laboratorioDestino.nome',
              body: (data) => data.laboratorioDestino?.nome ?? "-"
            },
            {
              label: 'Itens',
              field: 'itens',
              body: (data) => (
                <ul>
                  {data.itens?.map((item: IItemMovimentacao, index: number) => (
                    <li key={index}>
                      Produto #{item.produtoId} - Lote: {item.lote} - Qtd: {item.quantidade}
                    </li>
                  )) ?? "Sem itens"}
                </ul>
              )
            }
          ]}
          titulo="Detalhes da Movimentação"
        />
      )}

      {/* Se quiser implementar exclusão futuramente */}
      <DeleteConfirm
        visible={false}
        onHide={() => {}}
        onConfirm={() => {}}
      />
    </div>
  );
}
