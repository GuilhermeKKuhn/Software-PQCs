import { useNavigate } from "react-router-dom";
import logo from "@/assets/logoUTFPR.png";
import AuthService from "@/service/AuthService";

export function NavBar() {
  const navigate = useNavigate();

  const onClickLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white border-bottom px-3">
      <div className="d-flex align-items-center gap-3">
        <img src={logo} alt="UTFPR" style={{ height: "40px" }} />
        <span className="fw-bold">Produtos Químicos Controlados</span>
      </div>

      <div className="ms-auto">
        <button className="btn btn-danger" onClick={onClickLogout}>
          Sair
        </button>
      </div>
    </nav>
  );
}
