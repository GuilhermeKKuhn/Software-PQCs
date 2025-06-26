import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IProdutoQuimico } from "@/commons/ProdutoQuimicoInterface";
import ProdutoQuimicoService from "@/service/ProdutoQuimicoService";
import { ActionButtons } from "@/components/Common/ActionButton/ActionButton";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { ActionButtonCreate } from "@/components/Common/ActionButtonCreate/ActionButtonCreate";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { DeleteConfirm } from "@/components/Common/DeleteConfirm/DeleteConfirm";
import { ExportarXlsx } from "@/components/Common/ExportarXlsx/ExportarXlsx";



export function ProdutoPage() {
  const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [produtos, setProdutos] = useState<IProdutoQuimico[]>([]);
  
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
    const filteredProdutos = produtos.filter((produtos) => {
      const termo = search.toLowerCase();
      return (
        produtos.nome.toLowerCase().includes(termo) ||
        produtos.cas.toLowerCase().includes(termo) ||
        produtos.estadoFisico.toLowerCase().includes(termo) ||
        produtos.caracteristica.toLowerCase().includes(termo) ||
        produtos.orgaos.join(', ').toLowerCase().includes(termo) ||
        produtos.unidadeMedida.nome?.toLowerCase().includes(termo)
      );
    });
  
    useEffect(() => {
      ProdutoQuimicoService.listarProdutosQuimicos().then((response) => {
        setProdutos(response.data);
      });
    }, []);
  
    const handleOpenDelete = (id: number) => {
      setSelectedItemId(id);
      setDeleteDialogVisible(true);
    };
  
    const handleConfirmDelete = () => {
      if (selectedItemId) {
        ProdutoQuimicoService.deletarProdutoQuimico(selectedItemId).then(() => {
          setProdutos(produtos.filter((u) => u.id !== selectedItemId));
          setDeleteDialogVisible(false);
          setSelectedItemId(null);
        });
      }
    };

    const orgaoLabels: Record<string, string> = {
      POLICIA_FEDERAL: "Polícia Federal",
      EXERCITO: "Exército",
      POLICIA_CIVIL: "Policia Civil", 
    };
  
  const columns = [
    { field: "nome", header: "Produto Químico", headerStyle: { textAlign: 'center' as const}, bodyStyle: { textAlign: 'left' as const} },
    { field: "cas", header: "CAS", headerStyle: { textAlign: 'center' as const}, bodyStyle: { textAlign: 'left' as const} },
    { field: "concentracao", header: "Concentração", headerStyle: { textAlign: 'center' as const}, bodyStyle: { textAlign: 'center' as const} },
    { field: "densidade", header: "Densidade", headerStyle: { textAlign: 'center' as const}, bodyStyle: { textAlign: 'center' as const} },
    {
      field: "orgaos",
      header: "Órgãos Controladores",
      body: (rowData: IProdutoQuimico) => 
        rowData.orgaos.map((o) => orgaoLabels[o]).join(", "),
      headerStyle: { textAlign: 'left' as const },
      bodyStyle: { textAlign: 'center' as const },
    },
    {
      field: "unidadeMedida",
      header: "Unidade de Medida",
      body: (rowData: IProdutoQuimico) => rowData?.unidadeMedida.sigla,
      headerStyle: { textAlign: 'center' as const},
      bodyStyle: { textAlign: 'center' as const}
    },
    {
      field: "acoes",
      header: "Ações",
      body: (rowData: IProdutoQuimico) => (
        <ActionButtons
          onEdit={() => navigate(`/produtos/${rowData.id}`)}
          onDelete={() => handleOpenDelete(rowData.id!)}
        />
      ),
      headerStyle: { textAlign: 'right' as const},
      bodyStyle: { textAlign: 'right' as const}
    },
  ];

  
    return (
      <div className="container">
        <PageHeader title="Produtos Químicos" />
  
        <TableHeader
          left={
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar Produto Químico"
            />
          }
          right={
            <div className="d-flex gap-2">
              <ExportarXlsx
                titulo="Exportar Produtos Químicos"
                endpoint="/relatorios/produtos"
                nomeArquivo="produtos"
                semData
              />
              <ActionButtonCreate
                label="Novo Produto Químico"
                onClick={() => navigate("/produtos/novo")}
              />
            </div>
          }
        />
  
        <div className="p-card">
          <DataTableComp columns={columns} data={filteredProdutos} />
        </div>
  
        <DeleteConfirm
          visible={deleteDialogVisible}
          onHide={() => setDeleteDialogVisible(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    );
}