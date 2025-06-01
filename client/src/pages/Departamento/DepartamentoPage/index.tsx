import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ActionButtons } from "@/components/Common/ActionButton/ActionButton";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { ActionButtonCreate } from "@/components/Common/ActionButtonCreate/ActionButtonCreate";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { DeleteConfirm } from "@/components/Common/DeleteConfirm/DeleteConfirm";
import { IDepartamento } from "@/commons/DepartamentoInterface";
import DepartamentoService from "@/service/DepartamentoService";

export function DepartamentoPage() {
  const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [departamentos, setDepartamentos] = useState<IDepartamento[]>([]);
  
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
    const filteredDepartamentos = departamentos.filter((departamento) => {
      const termo = search.toLowerCase();

      return (
        departamento.nomeDepartamento.toLowerCase().includes(termo) ||
        departamento.responsavel?.name?.toLowerCase().includes(termo)
      );
    });
  
    useEffect(() => {
      DepartamentoService.listarDepartamentos().then((response) => {
        setDepartamentos(response.data);
      });
    }, []);
  
    const handleOpenDelete = (id: number) => {
      setSelectedItemId(id);
      setDeleteDialogVisible(true);
    };
  
    const handleConfirmDelete = () => {
      if (selectedItemId) {
        DepartamentoService.deletarDepartamento(selectedItemId).then(() => {
          setDepartamentos(departamentos.filter((u) => u.id !== selectedItemId));
          setDeleteDialogVisible(false);
          setSelectedItemId(null);
        });
      }
    };
  
    const columns = [
      { field: "nomeDepartamento", header: "Departamento" },
      { field: "sigla", header: "Sigla"},
      { field: "responsavel", header: "Responsável",
        body: (rowData: IDepartamento) => rowData?.responsavel.name
      },
      {
        field: "acoes",
        header: "Ações",
        body: (rowData: IDepartamento) => (
          <ActionButtons
            onEdit={() => navigate(`/departamentos/${rowData.id}`)}
            onDelete={() => handleOpenDelete(rowData.id!)}
          />
        ),
        bodyStyle: { textAlign: 'right' as const },
        headerStyle: { textAlign: 'right' as const },
      },
    ];
  
    return (
      <div className="container">
        <PageHeader title="Departamentos" />
  
        <TableHeader
          left={
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar Departamento"
            />
          }
          right={
            <ActionButtonCreate
              label="Novo Departamento"
              onClick={() => navigate("/departamentos/novo")}
            />
          }
        />
  
        <div className="p-card">
          <DataTableComp columns={columns} data={filteredDepartamentos} />
        </div>
  
        <DeleteConfirm
          visible={deleteDialogVisible}
          onHide={() => setDeleteDialogVisible(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    );
}