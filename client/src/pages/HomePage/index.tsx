import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "@/service/AuthService";

export function Homepage() {
  const navigate = useNavigate();
  const role = AuthService.getUserRole();

  useEffect(() => {
    switch (role) {
      case "ROLE_ADMINISTRADOR":
        navigate("/solicitacoes-pendentes", { replace: true });
        break;
      case "ROLE_RESPONSAVEL_LABORATORIO":
        navigate("/solicitacoes", { replace: true });
        break;
      case "ROLE_RESPONSAVEL_DEPARTAMENTO":
        navigate("/solicitacoes", { replace: true });
        break;
      default:
        navigate("/login", { replace: true }); 
        break;
    }
  }, [navigate, role]);

  return null; 
}
