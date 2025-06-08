import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IFornecedor } from "@/commons/FornecedorInterface";
import { FornecedorFormPage } from "../FornecedorFormPage";
import FornecedorService from "@/service/FornecedorService";
import { ActionButtons } from "@/components/Common/ActionButton/ActionButton";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { ActionButtonCreate } from "@/components/Common/ActionButtonCreate/ActionButtonCreate";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { DeleteConfirm } from "@/components/Common/DeleteConfirm/DeleteConfirm";
import { DetalhesDialog } from "@/components/Common/DetalhesDialog/DetalhesDialog";
import { ExportarXlsx } from "@/components/Common/ExportarXlsx/ExportarXlsx";



export function FornecedorPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [fornecedores, setFornecedores] = useState<IFornecedor[]>([]);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [FornecedorSelecionado, setFornecedorSelecionado] = useState<IFornecedor | null>(null);
  const [detalhesVisivel, setDetalhesVisivel] = useState(false);


  const filteredFornecedor = fornecedores.filter((fornecedor) => {
      const termo = search.toLowerCase();

      return (
        fornecedor.razaoSocial.toLowerCase().includes(termo) ||
        fornecedor.cnpj.toLowerCase().includes(termo) ||
        fornecedor.cidade.toLowerCase().includes(termo) ||
        fornecedor.endereco.toLowerCase().includes(termo) ||
        fornecedor.estado.toLowerCase().includes(termo) ||
        fornecedor.numero.toLowerCase().includes(termo) ||
        fornecedor.telefone.toLowerCase().includes(termo) ||
        fornecedor.email.toLowerCase().includes(termo)
      );
    });

  useEffect(() => {
    FornecedorService.listarFornecedores().then((response) => {
      setFornecedores(response.data);
    });
  }, []);

  const handleOpenDelete = (id: number) => {
    setSelectedItemId(id);
    setDeleteDialogVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItemId) {
      FornecedorService.deletarFornecedor(selectedItemId).then(() => {
        setFornecedores(fornecedores.filter((u) => u.id !== selectedItemId));
        setDeleteDialogVisible(false);
        setSelectedItemId(null);
      });
    }
  };

  const formatarCNPJ = (cnpj: string) => {
      if (!cnpj) return "";
         return cnpj
            .replace(/\D/g, "")
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .slice(0, 18);
   };

  const columns = [
    { field: "razaoSocial", header: "Razão Social" },
    { field: "cnpj", header: "CNPJ",
       body: (rowData: IFornecedor) => formatarCNPJ(rowData.cnpj),
    },
    { field: "telefone", header: "Telefone" },
    { field: "cidade", header: "Cidade" },
    { field: "estado", header: "UF" },
    {
      field: "acoes",
      header: "Ações",
      body: (rowData: IFornecedor) => (
        <ActionButtons
          onEdit={() => navigate(`/fornecedor/${rowData.id}`)}
          onDelete={() => handleOpenDelete(rowData.id!)}
        />
      ),
      bodyStyle: { textAlign: 'right' as const },
      headerStyle: { textAlign: 'right' as const },
    },
  ];

  return (
    <div className="container">
      <PageHeader title="Fornecedor" />

      <TableHeader
        left={
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar Fornecedor"
          />
        }
        right={
          <div className="d-flex gap-2">
              <ExportarXlsx
              titulo="Exportar Fornecedores"
              endpoint="/relatorios/fornecedores"
              nomeArquivo="fornecedores"
              semData
            />
            <ActionButtonCreate
              label="Novo Fornecedor"
              onClick={() => navigate("/fornecedor/novo")}
            />
          </div>
        }
      />

      <div className="p-card">
        <DataTableComp columns={columns} data={filteredFornecedor}
         onRowClick={(e) => {
            setFornecedorSelecionado(e.data as IFornecedor);
            setDetalhesVisivel(true);
         }}/>
      </div>

      {FornecedorSelecionado && (
         <DetalhesDialog
         data={FornecedorSelecionado}
         visible={detalhesVisivel}
         onHide={() => setDetalhesVisivel(false)}
         campos={[
            { label: 'Razão Social', field: 'razaoSocial' },
            { label: 'CNPJ', field: 'cnpj', body: (data) => formatarCNPJ(data.cnpj) },
            { label: 'E-mail', field: 'email' },
            { label: 'Cidade', field: 'cidade' },
            { label: 'Endereco', field: 'endereco' },
            { label: 'Número', field: 'numero' },
            { label: 'UF', field: 'estado' },
            { label: 'Telefone', field: 'telefone' },
         ]}
         titulo="Detalhes do fornecedor"
         />
      )}

      <DeleteConfirm
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
