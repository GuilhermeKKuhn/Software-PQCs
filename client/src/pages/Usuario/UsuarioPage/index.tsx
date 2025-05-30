import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ActionButtons } from "@/components/Common/ActionButton/ActionButton";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { TableHeader } from "@/components/Common/TableHeaderProps";
import { SearchBar } from "@/components/Common/SearchBar/SearchBar";
import { ActionButtonCreate } from "@/components/Common/ActionButtonCreate/ActionButtonCreate";
import { DataTableComp } from "@/components/Common/DataTableComp/DataTableComp";
import { DeleteConfirm } from "@/components/Common/DeleteConfirm/DeleteConfirm";
import { IUser } from "@/commons/UserInterfaces";
import UserService from "@/service/UserService";
import AuthService from "@/service/AuthService";


export function UsuarioPage() {
  const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [usuarios, setUsuarios] = useState<IUser[]>([]);
  
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  
    const filteredUser = usuarios.filter((usuario) => {
      const termo = search.toLowerCase();

      return (
        usuario.name.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo) ||
        usuario.siape.toLowerCase().includes(termo) ||
        (usuario.ativo ? 'sim' : 'não').includes(termo) ||
        usuario.tipoPerfil.toLowerCase().includes(termo)
      );
    });
  
    useEffect(() => {
      UserService.listarUser().then((response) => {
        setUsuarios(response.data);
      });
    }, []);
  
    const handleOpenDelete = (id: number) => {
      setSelectedItemId(id);
      setDeleteDialogVisible(true);
    };
  
    const handleConfirmDelete = () => {
      if (selectedItemId) {
        const usuarioDeletado = usuarios.find((u) => u.id === selectedItemId);
        UserService.deletarUser(selectedItemId).then(() => {
          setUsuarios(usuarios.filter((u) => u.id !== selectedItemId));
          setDeleteDialogVisible(false);
          setSelectedItemId(null);

          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

          if (currentUser?.email === usuarioDeletado?.email) {
            AuthService.logout();
            navigate("/login");
          }

        });
      }
    };
  
    const columns = [
      { field: "name", header: "Nome" },
      { field: "email", header: "Email"},
      { field: "siape", header: "Siape"},
      { field: "ativo", header: "Ativo",
        body: (rowData: IUser) => (rowData.ativo ? "Sim" : "Não")
      },
      { field: "tipoPerfil", header: "Tipo de perfil"},
      {
        field: "acoes",
        header: "Ações",
        body: (rowData: IUser) => (
          <ActionButtons
            onEdit={() => navigate(`/usuarios/${rowData.id}`)}
            onDelete={() => handleOpenDelete(rowData.id!)}
          />
        ),
        bodyStyle: { textAlign: 'right' as const },
        headerStyle: { textAlign: 'right' as const },
      },
    ];
  
    return (
      <div className="container">
        <PageHeader title="Usuarios" />
  
        <TableHeader
          left={
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar Usuario"
            />
          }
          right={
            <ActionButtonCreate
              label="Novo Usuario"
              onClick={() => navigate("/usuarios/novo")}
            />
          }
        />
  
        <div className="p-card">
          <DataTableComp columns={columns} data={filteredUser} />
        </div>
  
        <DeleteConfirm
          visible={deleteDialogVisible}
          onHide={() => setDeleteDialogVisible(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    );
}