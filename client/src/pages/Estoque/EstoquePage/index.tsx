import { useEffect, useState } from "react";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import EstoqueService from "@/service/EstoqueService";
import { Dialog } from "primereact/dialog";
import { IEstoqueLote, IEstoqueProduto } from "@/commons/EstoqueInterface";
import { useAuthUser } from "@/hooks/useAuthUser/UseAuthUser";
import { ExportarXlsx } from "@/components/Common/ExportarXlsx/ExportarXlsx";

export function EstoquePage() {
  const user = useAuthUser();
  const [search, setSearch] = useState("");
  const [searchDialog, setSearchDialog] = useState("");

  const [produtos, setProdutos] = useState<IEstoqueProduto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<IEstoqueProduto | null>(null);
  const [lotes, setLotes] = useState<IEstoqueLote[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!user) return;

    const carregar = async () => {
      if (user.tipoPerfil === "ADMINISTRADOR") {
        const res = await EstoqueService.buscarEstoquePorProduto();
        setProdutos(res.data);
      } else if (user.tipoPerfil === "RESPONSAVEL_LABORATORIO") {
        const res = await EstoqueService.buscarEstoquePorLaboratorios(user.laboratoriosId);
        setProdutos(res.data);
      } else if (user.tipoPerfil === "RESPONSAVEL_DEPARTAMENTO") {
        const res = await EstoqueService.buscarEstoquePorDepartamentos(user.departamentosId);
        setProdutos(res.data);
      }
    };

    carregar();
  }, [user]);

  const filteredProdutos = produtos.filter((p) => {
    const termo = search.toLowerCase();
    return (
      p.nome.toLowerCase().includes(termo) ||
      String(p.quantidadeTotal).includes(termo)
    );
  });

  const filteredLotes = lotes.filter((l) => {
    const termo = searchDialog.toLowerCase();
    const laboratorio = l.laboratorio?.toLowerCase() ?? l.nomeLaboratorio?.toLowerCase() ?? "";
    const lote = l.lote?.toLowerCase() ?? "";
    const validade = l.dataValidade ?? "";

    return (
      laboratorio.includes(termo) ||
      lote.includes(termo) ||
      validade.includes(termo)
    );
  });

  const handleRowClick = (produto: IEstoqueProduto) => {
    setProdutoSelecionado(produto);

    const buscarLotes = async () => {
      if (user?.tipoPerfil === "RESPONSAVEL_LABORATORIO") {
        const res = await EstoqueService.buscarLotesDoProdutoDosLaboratorios(produto.id, user.laboratoriosId);
        setLotes(res.data);
      } else if (user?.tipoPerfil === "RESPONSAVEL_DEPARTAMENTO") {
        const res = await EstoqueService.buscarLotesPorProdutoEDepartamentos(produto.id, user.departamentosId);
        setLotes(res.data);
      } else {
        const res = await EstoqueService.buscarLotesDoProduto(produto.id);
        setLotes(res.data);
      }
      setShowDialog(true);
    };

    buscarLotes();
  };

  const columns = [
    { field: "nome", header: "Produto" },
    {
      field: "quantidadeTotal",
      header: "Quantidade Total",
      body: (row: IEstoqueProduto) => `${row.quantidadeTotal} un.`,
    },
  ];

  return (
    <div className="container">
      <PageHeader title="Estoque" />

      <TableHeader
        left={
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto"
          />
        }
        right={
          <ExportarXlsx
            titulo="Exportar Estoque"
            endpoint="/relatorios/estoque"
            nomeArquivo="estoque"
            semData
          />
        }
      />

      <div className="p-card">
        <DataTableComp
          columns={columns}
          data={filteredProdutos}
          onRowClick={(e) => handleRowClick(e.data as IEstoqueProduto)}
        />
      </div>

      <Dialog
        header={`${produtoSelecionado?.nome}`}
        visible={showDialog}
        onHide={() => {
          setShowDialog(false);
          setSearchDialog("");
        }}
        style={{ width: "100%", maxWidth: "850px" }}
        modal
        className="p-fluid"
      >
        <div className="mb-3">
          <SearchBar
            value={searchDialog}
            onChange={(e) => setSearchDialog(e.target.value)}
            placeholder="Buscar lote ou laboratório"
          />
        </div>

        {filteredLotes.length === 0 ? (
          <div className="text-center text-muted my-4">
            Nenhum lote encontrado.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle shadow-sm">
              <thead className="table-dark text-center">
                <tr>
                  <th>Lote</th>
                  <th>Validade</th>
                  <th>Quantidade</th>
                  <th>Laboratório</th>
                </tr>
              </thead>
              <tbody>
                {filteredLotes.map((lote, index) => {
                  const validade = new Date(lote.dataValidade);
                  const vencido = validade < new Date();

                  return (
                    <tr key={index} className={vencido ? "table-danger" : ""}>
                      <td className="text-uppercase fw-semibold">{lote.lote}</td>
                      <td>{validade.toLocaleDateString("pt-BR")}</td>
                      <td>
                        <span className="badge bg-success fs-6">
                          {lote.quantidade} un.
                        </span>
                      </td>
                      <td>
                        <i className="pi pi-building text-secondary me-2" />
                        {lote.laboratorio || lote.nomeLaboratorio}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Dialog>
    </div>
  );
}
