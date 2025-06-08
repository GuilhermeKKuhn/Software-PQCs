import { PanelMenu } from "primereact/panelmenu";
import { MenuItem } from "primereact/menuitem";
import { useNavigate } from "react-router-dom";
import "./SideBarMenu.css";
import AuthService from "@/service/AuthService";

export const SidebarMenu = () => {
  const navigate = useNavigate();
  const role = AuthService.getUserRole(); // ex: "ROLE_ADMINISTRADOR"

  const commonItems: MenuItem[] = [
    {
      label: "Página Inicial",
      icon: "pi pi-home",
      command: () => navigate("/home"),
    },
  ];

  const adminItems: MenuItem[] = [
    {
      label: "Produtos",
      icon: "pi pi-box",
      items: [
        {
          label: "Produtos Químicos",
          icon: "pi pi-box",
          command: () => navigate("/produtos"),
        },
        {
          label: "Unidades de Medida",
          icon: "pi pi-tag",
          command: () => navigate("/unidademedida"),
        },
      ],
    },
    {
      label: "Laboratórios",
      icon: "pi pi-building",
      command: () => navigate("/laboratorios"),
    },
    {
      label: "Departamentos",
      icon: "pi pi-sitemap",
      command: () => navigate("/departamentos"),
    },
    {
      label: "Notas Fiscais",
      icon: "pi pi-file",
      command: () => navigate("/notas"),
    },
    {
      label: "Estoque",
      icon: "pi pi-database",
      command: () => navigate("/estoque"),
    },
    {
      label: "Movimentações",
      icon: "pi pi-sync",
      command: () => navigate("/movimentacoes"),
    },
    {
      label: "Usuários",
      icon: "pi pi-users",
      command: () => navigate("/usuarios"),
    },
    {
      label: "Fornecedor",
      icon: "pi pi-truck",
      command: () => navigate("/fornecedor"),
    },
    {
      label: "Solicitação",
      icon: "pi pi-send",
      command: () => navigate("/solicitacoes-pendentes"),
    },
  ];

    const responsavelLabItems: MenuItem[] = [
    {
      label: "Estoque",
      icon: "pi pi-database",
      command: () => navigate("/estoque"),
    },
    {
      label: "Movimentações",
      icon: "pi pi-sync",
      command: () => navigate("/movimentacoes/nova"),
    },
    {
      label: "Solicitação",
      icon: "pi pi-send",
      command: () => navigate("/solicitacoes"),
    },
  ];

  const responsavelDepItems: MenuItem[] = [
    {
      label: "Estoques dos Laboratórios",
      icon: "pi pi-database",
      command: () => navigate("/estoque"),
    },
    {
      label: "Movimentações",
      icon: "pi pi-sync",
      command: () => navigate("/movimentacoes/nova"),
    },
    {
      label: "Solicitação",
      icon: "pi pi-send",
      command: () => navigate("/solicitacoes"),
    },
  ];


  let roleItems: MenuItem[] = [];

  switch (role) {
    case "ROLE_ADMINISTRADOR":
      roleItems = adminItems;
      break;
    case "ROLE_RESPONSAVEL_LABORATORIO":
      roleItems = responsavelLabItems;
      break;
    case "ROLE_RESPONSAVEL_DEPARTAMENTO":
      roleItems = responsavelDepItems;
      break;
    default:
      roleItems = [];
  }

  const items: MenuItem[] = [...commonItems, ...roleItems];

  return (
    <div className="d-flex flex-column h-100">
      <PanelMenu
        model={items}
        className="w-100 border-0 rounded-0 shadow-0"
      />
    </div>
  );
};
