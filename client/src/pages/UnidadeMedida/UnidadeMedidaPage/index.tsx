import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { ActionButtons } from "@/components/Common/ActionButton/ActionButton";
import { ActionButtonCreate } from "@/components/Common/ActionButtonCreate/ActionButtonCreate";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { DeleteConfirm } from "@/components/Common/DeleteConfirm/DeleteConfirm";

import UnidadeService from "@/service/UnidadeMedidaService";
import { IUnidadeMedida } from "@/commons/UnidadeMedidaInterface";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";

export function UnidadeMedidaPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [unidades, setUnidades] = useState<IUnidadeMedida[]>([]);

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

   const filteredUnidades = unidades.filter((unidade) =>
   unidade.nome.toLowerCase().includes(search.toLowerCase()) ||
   unidade.sigla.toLowerCase().includes(search.toLowerCase()));


  useEffect(() => {
    UnidadeService.listarUnidadesMedida().then((response) => {
      setUnidades(response.data);
    });
  }, []);

  const handleOpenDelete = (id: number) => {
    setSelectedItemId(id);
    setDeleteDialogVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItemId) {
      UnidadeService.deletarUnidadeMedida(selectedItemId).then(() => {
        setUnidades(unidades.filter((u) => u.id !== selectedItemId));
        setDeleteDialogVisible(false);
        setSelectedItemId(null);
      });
    }
  };

  const columns = [
    { field: "nome", header: "Nome" },
    { field: "sigla", header: "Sigla" },
    {
      field: "acoes",
      header: "Ações",
      body: (rowData: IUnidadeMedida) => (
        <ActionButtons
          onEdit={() => navigate(`/unidademedida/${rowData.id}`)}
          onDelete={() => handleOpenDelete(rowData.id!)}
        />
      ),
      bodyStyle: { textAlign: 'right' as const },
      headerStyle: { textAlign: 'right' as const },
    },
  ];

  return (
    <div className="container">
      <PageHeader title="Unidades de Medida" />

      <TableHeader
        left={
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar Unidade"
          />
        }
        right={
          <ActionButtonCreate
            label="Nova Unidade"
            onClick={() => navigate("/unidademedida/novo")}
          />
        }
      />

      <div className="p-card">
        <DataTableComp columns={columns} data={filteredUnidades} />
      </div>

      <DeleteConfirm
        visible={deleteDialogVisible}
        onHide={() => setDeleteDialogVisible(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
