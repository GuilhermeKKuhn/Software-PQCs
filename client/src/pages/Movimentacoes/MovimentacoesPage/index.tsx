import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { IMovimentacao } from "@/commons/MovimentacoesInterface";
import { IMovimentacaoAgrupada } from "@/commons/MovimentacaoAgrupadaInterface";
import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";

import MovimentacaoService from "@/service/MovimentacaoService";
import ProdutoQuimicoService from "@/service/ProdutoQuimicoService";

import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { ActionButtonCreate } from "@/components/Common/ActionButtonCreate/ActionButtonCreate";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { DetalhesDialog } from "@/components/Common/DetalhesDialog/DetalhesDialog";
import { ExportarXlsx } from "@/components/Common/ExportarXlsx/ExportarXlsx";

import { useAuthUser } from "@/hooks/useAuthUser/UseAuthUser";
import { IProdutoSimplificado } from "@/commons/ProdutoQuimicoInterface";

// ... imports (mantém como está)

export function MovimentacaoPage() {
  const navigate = useNavigate();
  const user = useAuthUser();

  const [search, setSearch] = useState("");
  const [movimentacaoSelecionada, setMovimentacaoSelecionada] =
    useState<IMovimentacaoAgrupada | null>(null);
  const [detalhesVisivel, setDetalhesVisivel] = useState(false);
  const [movimentacoesAgrupadas, setMovimentacoesAgrupadas] = useState<
    IMovimentacaoAgrupada[]
  >([]);
  const [produtos, setProdutos] = useState<IProdutoSimplificado[]>([]);

  const filteredMovimentacoes = movimentacoesAgrupadas.filter((mov) => {
    const termo = search.toLowerCase();
    return (
      mov.tipo?.toLowerCase().includes(termo) ||
      mov.itens?.some((item) => item.lote?.toLowerCase().includes(termo)) ||
      String(mov.notaFiscal?.numeroNotaFiscal ?? "").includes(termo) ||
      mov.laboratorioDestino?.nomeLaboratorio?.toLowerCase().includes(termo) ||
      mov.laboratorioOrigem?.nomeLaboratorio?.toLowerCase().includes(termo)
    );
  });

  useEffect(() => {
    ProdutoQuimicoService.listarProdutosQuimicos().then((res) => {
      setProdutos(res.data);
    });

    MovimentacaoService.listarMovimentacoes().then((res) => {
      const dados: IMovimentacao[] = res.data;

      const agrupadasMap = new Map<string, IMovimentacaoAgrupada>();

      dados.forEach((mov) => {
        const key = `${mov.id}`;

        if (!agrupadasMap.has(key)) {
          agrupadasMap.set(key, {
            idGrupo: key,
            tipo: mov.tipo,
            motivoSaida: mov.motivoSaida ?? null,
            data:
              mov.dataMovimentacao ?? mov.notaFiscal?.dataRecebimento ?? "",
            notaFiscal: mov.notaFiscal,
            laboratorioDestino: mov.laboratorioDestino,
            laboratorioOrigem: mov.laboratorioOrigem,
            usuario: mov.usuario
              ? {
                  id: mov.usuario.id,
                  name:
                    mov.usuario.name ?? mov.usuario.nome ?? "Desconhecido",
                }
              : undefined,
            itens: [],
          });
        }

        mov.itens.forEach((itemMov) => {
          const produtoInfo = produtos.find(
            (p) => p.id === itemMov.produtoId
          );

          const item: IItemMovimentacao = {
            produtoId: itemMov.produtoId,
            nomeProduto: itemMov.nomeProduto ?? produtoInfo?.nome ?? "Desconhecido",
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

            cas: produtoInfo?.cas ?? "-",
            densidade: produtoInfo?.densidade ?? "-",
            concentracao: produtoInfo?.concentracao ?? "-",

            idSolicitacaoItem: itemMov.idSolicitacaoItem ?? undefined,
          };

          agrupadasMap.get(key)!.itens.push(item);
        });
      });

      const agrupadas = Array.from(agrupadasMap.values());
      setMovimentacoesAgrupadas(agrupadas);
    });
  }, [user]);

  const columns = [
    { field: "tipo", header: "Tipo" },
    {
      field: "data",
      header: "Data",
      body: (row: IMovimentacaoAgrupada) =>
        row.data ? new Date(row.data).toLocaleDateString("pt-BR") : "-",
    },
    {
      field: "laboratorioDestino.nomeLaboratorio",
      header: "Destino",
      body: (row: IMovimentacaoAgrupada) =>
        row.tipo === "SAIDA"
          ? "Consumo"
          : row.laboratorioDestino?.nomeLaboratorio ?? "-",
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
              label: "Motivo da Saída",
              field: "motivoSaida",
              body: (data) =>
                data.tipo === "SAIDA"
                  ? data.motivoSaida
                    ? data.motivoSaida.replaceAll("_", " ")
                    : "-"
                  : "-",
            },
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
              body: (data) =>
                data.notaFiscal?.numeroNotaFiscal ?? "Sem Nota",
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
                data.tipo === "SAIDA"
                  ? "Consumo"
                  : data.laboratorioDestino?.nomeLaboratorio ?? "-",
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
                      <div>
                        <strong>{item.nomeProduto}</strong>
                      </div>
                      <div className="small text-muted">
                        <div>
                          <span className="me-3">
                            Lote: <strong>{item.lote}</strong>
                          </span>
                          <span className="me-3">
                            Qtd: <strong>{item.quantidadeAprovada}</strong>
                          </span>
                          <span className="me-3">
                            CAS: <strong>{item.cas}</strong>
                          </span>
                          <span className="me-3">
                            Densidade: <strong>{item.densidade}</strong>
                          </span>
                          <span className="me-3">
                            Concentração:{" "}
                            <strong>{item.concentracao}</strong>
                          </span>
                        </div>
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

