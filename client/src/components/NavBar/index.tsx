import { useNavigate } from "react-router-dom";
import logo from "@/assets/logoUTFPR.png";
import AuthService from "@/service/AuthService";

export function NavBar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const onClickLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white border-bottom px-3 shadow-sm">
      <div className="d-flex align-items-center gap-3">
        <img src={logo} alt="UTFPR" style={{ height: "40px" }} />
        <span className="fw-bold">Produtos Químicos Controlados</span>
      </div>

      <div className="ms-auto dropdown">
        <button
          className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2"
          type="button"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-person-circle"></i>
          {user?.name || "Usuário"}
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow-sm" aria-labelledby="userDropdown">
          <li>
            <h6 className="dropdown-header">{user?.email || "email@dominio.com"}</h6>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item text-danger fw-semibold" onClick={onClickLogout}>
              <i className="bi bi-box-arrow-right me-2"></i> Sair
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
