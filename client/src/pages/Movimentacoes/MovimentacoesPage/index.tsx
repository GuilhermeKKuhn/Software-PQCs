import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IMovimentacao } from "@/commons/MovimentacoesInterface";
import MovimentacaoService from "@/service/MovimentacaoService";
import { ActionButtons } from "@/components/Common/ActionButton/ActionButton";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { ActionButtonCreate } from "@/components/Common/ActionButtonCreate/ActionButtonCreate";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { DetalhesDialog } from "@/components/Common/DetalhesDialog/DetalhesDialog";
import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";
import { IMovimentacaoAgrupada } from "@/commons/MovimentacaoAgrupadaInterface";
import { IUser } from "@/commons/UserInterfaces";

export function MovimentacaoPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] = useState<IMovimentacaoAgrupada | null>(null);
  const [detalhesVisivel, setDetalhesVisivel] = useState(false);
  const [movimentacoesAgrupadas, setMovimentacoesAgrupadas] = useState<IMovimentacaoAgrupada[]>([]);

  const filteredMovimentacoes = movimentacoesAgrupadas.filter((mov) => {
    const termo = search.toLowerCase();
    return (
      mov.tipo?.toLowerCase().includes(termo) ||
      mov.itens?.some(item => item.lote?.toLowerCase().includes(termo)) ||
      String(mov.notaFiscal?.numeroNotaFiscal ?? '').includes(termo)
    );
  });

  useEffect(() => {
    MovimentacaoService.listarMovimentacoes().then((res) => {
      const dados: IMovimentacao[] = res.data;

      const agrupadasMap = new Map<string, IMovimentacaoAgrupada>();

      dados.forEach((mov) => {
        const key = `${mov.tipo}-${mov.notaFiscal?.id ?? 'semNota'}-${mov.laboratorioDestino?.id ?? 'semDestino'}-${mov.laboratorioOrigem?.id ?? 'semOrigem'}`;

        if (!agrupadasMap.has(key)) {
          agrupadasMap.set(key, {
            idGrupo: key,
            tipo: mov.tipo,
            data: mov.dataMovimentacao ?? mov.notaFiscal?.dataRecebimento ?? '',
            notaFiscal: mov.notaFiscal,
            laboratorioDestino: mov.laboratorioDestino,
            laboratorioOrigem: mov.laboratorioOrigem,
            usuario: mov.usuario,
            itens: [],
          });
        }

        const item: IItemMovimentacao = {
          produtoId: mov.itens[0]?.produtoId ?? 0,
          nomeProduto: mov.itens[0]?.nomeProduto ?? 'Desconhecido',
          quantidade: mov.quantidade!,
          lote: mov.lote!,
          preco: mov.itens[0]?.preco ?? null
        };

        agrupadasMap.get(key)!.itens.push(item);
      });

      const agrupadas = Array.from(agrupadasMap.values());
      setMovimentacoesAgrupadas(agrupadas);
    });
  }, []);

  const columns = [
    { field: "tipo", header: "Tipo" },
    {
      field: "data",
      header: "Data",
      body: (row: IMovimentacaoAgrupada) =>
        row.data ? new Date(row.data).toLocaleDateString("pt-BR") : "-"
    },
    {
      field: "notaFiscal.numeroNotaFiscal",
      header: "Nota Fiscal",
      body: (row: IMovimentacaoAgrupada) => row.notaFiscal?.numeroNotaFiscal ?? "-"
    },
    {
      field: "laboratorioDestino.nomeLaboratorio",
      header: "Destino",
      body: (row: IMovimentacaoAgrupada) => row.laboratorioDestino?.nomeLaboratorio ?? "-"
    },
    {
      field: "usuario.name", header: "Usuario",
      body: (row: IMovimentacaoAgrupada) => row.usuario?.name ?? "-"
    }
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
            onClick={() => navigate("/movimentacoes/nova")}
          />
        }
      />

      <div className="p-card">
        <DataTableComp
          columns={columns}
          data={filteredMovimentacoes}
          onRowClick={(e) => {
            setMovimentacaoSelecionada(e.data as IMovimentacaoAgrupada);
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
              field: 'data',
              body: (data) =>
                data.data ? new Date(data.data).toLocaleDateString("pt-BR") : "-"
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
              field: 'laboratorioOrigem.nomeLaboratorio',
              body: (data) => data.laboratorioOrigem?.nomeLaboratorio ?? "-"
            },
            {
              label: 'Destino',
              field: 'laboratorioDestino.nomeLaboratorio',
              body: (data) => data.laboratorioDestino?.nomeLaboratorio ?? "-"
            },
            {
              label: 'Itens',
              field: 'itens',
              body: (data) => (
                <div className="mt-2">
                  {data.itens?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="mb-2 p-2 border rounded bg-light shadow-sm"
                    >
                      <strong>{item.nomeProduto}</strong>
                      <div className="small text-muted">
                        <span className="me-3">Lote: <strong>{item.lote}</strong></span>
                        <span>Qtd: <strong>{item.quantidade}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          ]}
          titulo="Detalhes da Movimentação"
        />
      )}
    </div>
  );
}
