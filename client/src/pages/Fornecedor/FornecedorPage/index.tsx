import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IFornecedor } from "@/commons/FornecedorInterface";
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
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<IFornecedor | null>(null);
  const [detalhesVisivel, setDetalhesVisivel] = useState(false);

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
        setFornecedores(fornecedores.filter((f) => f.id !== selectedItemId));
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

  const isLicencaVencida = (dataLicenca?: Date | string | null) => {
    if (!dataLicenca) return false;
    const data = new Date(dataLicenca);
    const hoje = new Date();
    data.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);
    return data < hoje;
  };

  const columns = [
    { field: "razaoSocial", header: "Razão Social" },
    {
      field: "cnpj",
      header: "CNPJ",
      body: (rowData: IFornecedor) => formatarCNPJ(rowData.cnpj),
    },
    { field: "telefone", header: "Telefone" },
    { field: "cidade", header: "Cidade" },
    { field: "estado", header: "UF" },
    {
      field: "dataValidadeLicenca",
      header: "Validade Licença",
      body: (rowData: IFornecedor) => {
        const vencido = isLicencaVencida(rowData.dataValidadeLicenca);
        const data = rowData.dataValidadeLicenca
          ? new Date(rowData.dataValidadeLicenca).toLocaleDateString()
          : "Não informada";

        return (
          <span
            style={{
              color: vencido ? "red" : "inherit",
              fontWeight: vencido ? "bold" : "normal",
            }}
          >
            {data}
          </span>
        );
      },
      headerStyle: { textAlign: "center" as const },
      bodyStyle: { textAlign: "center" as const },
    },
    {
      field: "acoes",
      header: "Ações",
      body: (rowData: IFornecedor) => (
        <ActionButtons
          onEdit={() => navigate(`/fornecedor/${rowData.id}`)}
          onDelete={() => handleOpenDelete(rowData.id!)}
        />
      ),
      headerStyle: { textAlign: "right" as const },
      bodyStyle: { textAlign: "right" as const },
    },
  ];

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
        <DataTableComp
          columns={columns}
          data={filteredFornecedor}
          onRowClick={(e) => {
            setFornecedorSelecionado(e.data as IFornecedor);
            setDetalhesVisivel(true);
          }}
        />
      </div>

      {fornecedorSelecionado && (
        <DetalhesDialog
          data={fornecedorSelecionado}
          visible={detalhesVisivel}
          onHide={() => setDetalhesVisivel(false)}
          campos={[
            { label: "Razão Social", field: "razaoSocial" },
            { label: "CNPJ", field: "cnpj", body: (data) => formatarCNPJ(data.cnpj) },
            { label: "E-mail", field: "email" },
            { label: "Cidade", field: "cidade" },
            { label: "Endereço", field: "endereco" },
            { label: "Número", field: "numero" },
            { label: "UF", field: "estado" },
            { label: "Telefone", field: "telefone" },
            {
              label: 'Validade Licença',
              field: 'dataValidadeLicenca',
              body: (data) => {
                const vencido = isLicencaVencida(data.dataValidadeLicenca);
                const text = data.dataValidadeLicenca
                  ? new Date(data.dataValidadeLicenca).toLocaleDateString()
                  : "Não informada";

                return vencido ? (
                  <span className="text-danger">{text}</span>
                ) : (
                  text 
                );
              }
            }
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
