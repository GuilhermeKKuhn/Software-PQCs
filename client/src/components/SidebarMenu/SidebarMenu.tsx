import { PanelMenu } from "primereact/panelmenu";
import { useNavigate } from "react-router-dom";

export const SidebarMenu = () => {
  const navigate = useNavigate();

  const items = [
    {
      label: "Pagina Inicial",
      icon: "pi pi-home",
      command: () => navigate("/"),
    },
    {
      label: "Cadastros",
      icon: "pi pi-folder-open",
      items: [
        { label: "Produtos", command: () => navigate("/cadastros/produtos") },
        { label: "Laboratórios", command: () => navigate("/cadastros/laboratorios") },
        { label: "Fornecedores", command: () => navigate("/cadastros/fornecedores") },
        { label: "Usuários", command: () => navigate("/usuarios/novo") },
      ],
    },
    {
      label: "Movimentações",
      icon: "pi pi-sync",
      command: () => navigate("/movimentacoes"),
    },
  ];

  return (
    <div className="h-full">
      <PanelMenu model={items} className="h-full border-none shadow-none" />
    </div>
  );
};
