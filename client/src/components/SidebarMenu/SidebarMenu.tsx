import { PanelMenu } from "primereact/panelmenu";
import { useNavigate } from "react-router-dom";
import "./SideBarMenu.css"


export const SidebarMenu = () => {
  const navigate = useNavigate();

  const items = [
    {
      label: "Página Inicial",
      icon: "pi pi-home",
      command: () => navigate("/home"),
    },
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
  ];

  return (
    <div className="d-flex flex-column h-100">
      <PanelMenu
        model={items}
        className="w-100 border-0 rounded-0 shadow-0"
      />
    </div>
  );
};
