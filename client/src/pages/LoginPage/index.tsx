import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import AuthService from "@/service/AuthService";
import logoUTFPR from "@/assets/logoUTFPR.png";
import logoPQCS from "@/assets/logoPQCS.png";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [pending, setPending] = useState(false);
  const [apiError, setApiError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    setPending(true);
    setApiError(false);

    AuthService.login({ email: form.email, password: form.password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/home");
      })
      .catch(() => {
        setApiError(true);
        setPending(false);
      });
  };

  return (    
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #fef2a1, #ffffff)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div
        style={{
          width: "920px",
          height: "540px",
          display: "flex",
          borderRadius: "2rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {/* Lado esquerdo */}
        <div style={{
          flex: 1,
          background: "#fdfde3",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "40px 30px"
        }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <img src={logoPQCS} alt="Logo PQCS" style={{ maxWidth: "340px", marginBottom: 40, marginTop: 40 }} />
          </div>
          <img src={logoUTFPR} alt="Logo UTFPR" style={{ maxWidth: "100px", alignSelf: "flex-start" }} />
        </div>

        {/* Lado direito */}
        <div style={{
          flex: 1,
          background: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "50px 35px"
        }}>
          <img src={logoUTFPR} alt="Logo UTFPR" style={{ maxWidth: 90, margin: "0 auto 18px auto" }} />
          <h2 style={{ textAlign: "center", color: "#373435", marginBottom: 24, fontSize: 22 }}>
            Login
          </h2>

          {apiError && (
            <div style={{ color: "#f44336", textAlign: "center", marginBottom: 16 }}>
              E-mail ou senha inválidos.
            </div>
          )}

          <div className="p-fluid" style={{ marginBottom: 16 }}>
            <span className="p-float-label">
              <InputText
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="p-inputtext-lg"
                autoComplete="username"
              />
              <label htmlFor="email">Informe seu login*</label>
            </span>
          </div>

          <div className="p-fluid" style={{ marginBottom: 32 }}>
            <span className="p-float-label">
              <Password
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                toggleMask
                feedback={false}
                className="p-inputtext-lg"
                autoComplete="current-password"
              />
              <label htmlFor="password">Informe sua senha*</label>
            </span>
          </div>

          <Button
            label={pending ? "Entrando..." : "Entrar"}
            className="p-button-rounded p-button-warning p-button-lg"
            style={{ width: "100%", marginBottom: 16, color: "#373435" }}
            onClick={handleLogin}
            disabled={pending}
          />

          <div style={{ textAlign: "center", color: "#999", fontSize: 15 }}>
            <a href="#" style={{ color: "#373435", marginRight: 8 }}>
              Esqueci o login/senha
            </a>
            <a href="#" style={{ color: "#373435", marginLeft: 8 }}>
              ajuda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
