import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { IMovimentacao } from "@/commons/MovimentacoesInterface";
import { IMovimentacaoAgrupada } from "@/commons/MovimentacaoAgrupadaInterface";
import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";

import MovimentacaoService from "@/service/MovimentacaoService";

import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { ActionButtonCreate } from "@/components/Common/ActionButtonCreate/ActionButtonCreate";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { DetalhesDialog } from "@/components/Common/DetalhesDialog/DetalhesDialog";
import { ExportarXlsx } from "@/components/Common/ExportarXlsx/ExportarXlsx";


export function MovimentacaoPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] =
    useState<IMovimentacaoAgrupada | null>(null);
  const [detalhesVisivel, setDetalhesVisivel] = useState(false);
  const [movimentacoesAgrupadas, setMovimentacoesAgrupadas] = useState<
    IMovimentacaoAgrupada[]
  >([]);

  const filteredMovimentacoes = movimentacoesAgrupadas.filter((mov) => {
    const termo = search.toLowerCase();
    return (
      mov.tipo?.toLowerCase().includes(termo) ||
      mov.itens?.some((item) => item.lote?.toLowerCase().includes(termo)) ||
      String(mov.notaFiscal?.numeroNotaFiscal ?? "").includes(termo)
    );
  });

  useEffect(() => {
    MovimentacaoService.listarMovimentacoes().then((res) => {
      const dados: IMovimentacao[] = res.data;

      const agrupadasMap = new Map<string, IMovimentacaoAgrupada>();

      dados.forEach((mov) => {
        const key = `${mov.tipo}-${
          mov.notaFiscal?.id ?? "semNota"
        }-${mov.laboratorioDestino?.id ?? "semDestino"}-${
          mov.laboratorioOrigem?.id ?? "semOrigem"
        }`;

        if (!agrupadasMap.has(key)) {
          agrupadasMap.set(key, {
            idGrupo: key,
            tipo: mov.tipo,
            data: mov.dataMovimentacao ?? mov.notaFiscal?.dataRecebimento ?? "",
            notaFiscal: mov.notaFiscal,
            laboratorioDestino: mov.laboratorioDestino,
            laboratorioOrigem: mov.laboratorioOrigem,
            usuario: mov.usuario
              ? {
                  id: mov.usuario.id,
                  name: mov.usuario.name ?? mov.usuario.nome ?? "Desconhecido",
                }
              : undefined,
            itens: [],
          });
        }

        mov.itens.forEach((itemMov) => {
          const item: IItemMovimentacao = {
            produtoId: itemMov.produtoId,
            nomeProduto: itemMov.nomeProduto ?? "Desconhecido",
            lote: itemMov.lote ?? mov.lote ?? "-",
            preco: itemMov.preco ?? null,

            quantidadeSolicitada:
              itemMov.quantidadeSolicitada ??
              itemMov.quantidadeAprovada ??
              itemMov.quantidade ??
              mov.quantidade ??
              0,

            quantidadeAprovada:
              itemMov.quantidadeAprovada ??
              itemMov.quantidadeSolicitada ??
              itemMov.quantidade ??
              mov.quantidade ??
              0,

            fabricacao: itemMov.fabricacao ?? null,
            validade: itemMov.validade ?? null,

            cas: itemMov.cas ?? '',
            densidade: itemMov.densidade ?? '',
            concentracao: itemMov.concentracao ?? '',

            idSolicitacaoItem: itemMov.idSolicitacaoItem ?? undefined,
          };

          agrupadasMap.get(key)!.itens.push(item);
        });
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
        row.data ? new Date(row.data).toLocaleDateString("pt-BR") : "-",
    },
    {
      field: "notaFiscal.numeroNotaFiscal",
      header: "Nota Fiscal",
      body: (row: IMovimentacaoAgrupada) =>
        row.notaFiscal?.numeroNotaFiscal ?? "-",
    },
    {
      field: "laboratorioDestino.nomeLaboratorio",
      header: "Destino",
      body: (row: IMovimentacaoAgrupada) =>
        row.laboratorioDestino?.nomeLaboratorio ?? "-",
    },
    {
      field: "usuario.name",
      header: "Usuário",
      body: (row: IMovimentacaoAgrupada) => row.usuario?.name ?? "-",
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
          <div className="d-flex gap-2">
            <ExportarXlsx
              titulo="Exportar Relatório"
              endpoint="/relatorios/movimentacoes"
              nomeArquivo="relatorio-movimentacoes"
            />
            <ActionButtonCreate
              label="Nova Movimentação"
              onClick={() => navigate("/movimentacoes/nova")}
            />
          </div>
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
            { label: "Tipo", field: "tipo" },
            {
              label: "Data",
              field: "data",
              body: (data) =>
                data.data
                  ? new Date(data.data).toLocaleDateString("pt-BR")
                  : "-",
            },
            {
              label: "Nota Fiscal",
              field: "notaFiscal.numeroNotaFiscal",
            },
            {
              label: "Fornecedor",
              field: "notaFiscal.fornecedor.razaoSocial",
              body: (data) =>
                data.notaFiscal?.fornecedor?.razaoSocial ?? "-",
            },
            {
              label: "Origem",
              field: "laboratorioOrigem.nomeLaboratorio",
              body: (data) =>
                data.laboratorioOrigem?.nomeLaboratorio ?? "-",
            },
            {
              label: "Destino",
              field: "laboratorioDestino.nomeLaboratorio",
              body: (data) =>
                data.laboratorioDestino?.nomeLaboratorio ?? "-",
            },
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
                      <strong>{item.nomeProduto}</strong>
                      <div className="small text-muted">
                        <span className="me-3">
                          Lote: <strong>{item.lote}</strong>
                        </span>
                        <span className="me-3">
                          Qtd: <strong>{item.quantidadeAprovada}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
          titulo="Detalhes da Movimentação"
        />
      )}
    </div>
  );
}
