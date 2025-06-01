import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ILaboratorio } from "@/commons/LaboratorioInterface";
import LaboratorioService from "@/service/LaboratorioService";
import { ActionButtons } from "@/components/Common/ActionButton/ActionButton";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { ActionButtonCreate } from "@/components/Common/ActionButtonCreate/ActionButtonCreate";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { DeleteConfirm } from "@/components/Common/DeleteConfirm/DeleteConfirm";

export function LaboratorioPage() {
  const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
    const filteredLaboratorios = laboratorios.filter((laboratorio) => {
      const termo = search.toLowerCase();

      return (
        laboratorio.nomeLaboratorio.toLowerCase().includes(termo) ||
        laboratorio.sala.toLowerCase().includes(termo) ||
        laboratorio.departamento?.nomeDepartamento?.toLowerCase().includes(termo) ||
        laboratorio.responsavel?.name?.toLowerCase().includes(termo)
      );
    });
  
    useEffect(() => {
      LaboratorioService.listarLaboratorios().then((response) => {
        setLaboratorios(response.data);
      });
    }, []);
  
    const handleOpenDelete = (id: number) => {
      setSelectedItemId(id);
      setDeleteDialogVisible(true);
    };
  
    const handleConfirmDelete = () => {
      if (selectedItemId) {
        LaboratorioService.deletarLaboratorio(selectedItemId).then(() => {
          setLaboratorios(laboratorios.filter((u) => u.id !== selectedItemId));
          setDeleteDialogVisible(false);
          setSelectedItemId(null);
        });
      }
    };
  
    const columns = [
      { field: "nomeLaboratorio", header: "Laboratorio" },
      { field: "departamento", header: "Departamento",
        body: (rowdata: ILaboratorio) => rowdata?.departamento.nomeDepartamento
      },
      { field: "sala", header: "Sala" },
      { field: "responsavel", header: "Responsável",
        body: (rowData: ILaboratorio) => rowData?.responsavel.name
      },
      {
        field: "acoes",
        header: "Ações",
        body: (rowData: ILaboratorio) => (
          <ActionButtons
            onEdit={() => navigate(`/laboratorios/${rowData.id}`)}
            onDelete={() => handleOpenDelete(rowData.id!)}
          />
        ),
        bodyStyle: { textAlign: 'right' as const },
        headerStyle: { textAlign: 'right' as const },
      },
    ];
  
    return (
      <div className="container">
        <PageHeader title="Laboratorios" />
  
        <TableHeader
          left={
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar Laboratorio"
            />
          }
          right={
            <ActionButtonCreate
              label="Novo Laboratorio"
              onClick={() => navigate("/laboratorios/novo")}
            />
          }
        />
  
        <div className="p-card">
          <DataTableComp columns={columns} data={filteredLaboratorios} />
        </div>
  
        <DeleteConfirm
          visible={deleteDialogVisible}
          onHide={() => setDeleteDialogVisible(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    );
}