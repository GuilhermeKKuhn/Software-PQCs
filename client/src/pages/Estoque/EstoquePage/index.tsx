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
  const [produtos, setProdutos] = useState<IEstoqueProduto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<IEstoqueProduto | null>(null);
  const [lotes, setLotes] = useState<IEstoqueLote[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (user.tipoPerfil === "ADMINISTRADOR") {
      EstoqueService.buscarEstoquePorProduto().then((res) => {
        setProdutos(res.data);
      });
    } else if (user.tipoPerfil === "RESPONSAVEL_LABORATORIO") {
      EstoqueService.buscarEstoquePorLaboratorios(user.laboratoriosId).then((res) => {
        setProdutos(res.data);
      });
    } else if (user.tipoPerfil === "RESPONSAVEL_DEPARTAMENTO") {
      EstoqueService.buscarEstoquePorDepartamentos(user.departamentosId).then((res) => {
        setProdutos(res.data);
      });
    }
  }, [user]);

  const filteredProdutos = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleRowClick = (produto: IEstoqueProduto) => {
    setProdutoSelecionado(produto);

    if (user?.tipoPerfil === "RESPONSAVEL_LABORATORIO") {
      EstoqueService.buscarLotesDoProdutoDosLaboratorios(produto.id, user.laboratoriosId).then((res) => {
        setLotes(res.data);
        setShowDialog(true);
      });
    } else if (user?.tipoPerfil === "RESPONSAVEL_DEPARTAMENTO") {
      EstoqueService.buscarLotesPorProdutoEDepartamentos(produto.id, user.departamentosId).then((res) => {
        setLotes(res.data);
        setShowDialog(true);
      });
    } else {
      EstoqueService.buscarLotesDoProduto(produto.id).then((res) => {
        setLotes(res.data);
        setShowDialog(true);
      });
    }
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
          onHide={() => setShowDialog(false)}
          style={{ width: "100%", maxWidth: "850px" }}
          modal
          className="p-fluid"
        >
          {lotes.length === 0 ? (
            <div className="text-center text-muted my-4">
              Nenhum lote encontrado.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover align-middle shadow-sm mt-3">
                <thead className="table-dark text-center">
                  <tr>
                    <th scope="col">#</th>
                    <th>Lote</th>
                    <th>Validade</th>
                    <th>Quantidade</th>
                    <th>Laboratório</th>
                  </tr>
                </thead>
                <tbody>
                  {lotes.map((lote, index) => {
                    const validade = new Date(lote.validade);
                    const vencido = validade < new Date();
                    const diasRestantes = Math.floor(
                      (validade.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <tr key={index} className={vencido ? "table-danger" : ""}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          <span className="fw-semibold text-uppercase">{lote.lote}</span>
                        </td>
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
