import { Route, Routes } from "react-router-dom";
import  LoginPage  from "@/pages/LoginPage";
import { AuthenticatedRoutes } from "../AuthenticatedRoutes";
import { DashboardPage } from "@/pages/DashboardPage";
import { DepartamentoPage } from "@/pages/Departamento/DepartamentoPage";
import { DepartamentoFormPage } from "@/pages/Departamento/DepartamentoFormPage";
import { LaboratorioPage } from "@/pages/Laboratorio/LaboratorioPage";
import { LaboratorioFormPage } from "@/pages/Laboratorio/LaboratorioFormPage";
import { ProdutoPage } from "@/pages/ProdutoQuimico/ProdutoPage";
import { ProdutoFormPage } from "@/pages/ProdutoQuimico/ProdutoFormPage";
import { NotaFiscalPage } from "@/pages/NotasFiscais/NotaFiscalPage";
import { NotaFiscalFormPage } from "@/pages/NotasFiscais/NotaFiscalFormPage";
import { EstoquePage } from "@/pages/Estoque/EstoquePage";
import { MovimentacaoPage } from "@/pages/Movimentacoes/MovimentacoesPage";
import { MovimentacaoFormPage } from "@/pages/Movimentacoes/MovimentacoesFormPage";
import { UsuarioPage } from "@/pages/Usuario/UsuarioPage";
import { UsuarioFormPage } from "@/pages/Usuario/UsuarioFormPage";
import { RelatorioPage } from "@/pages/Relatorio/RelatorioPage";

export function BaseRoutes() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />



        {/*rotas todas publicas para teste*/}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<DashboardPage />} />

        {/* Departamentos */}
        <Route path="/departamentos" element={<DepartamentoPage />} />
        <Route path="/departamentos/novo" element={<DepartamentoFormPage />} />
        <Route path="/departamentos/:id" element={<DepartamentoFormPage />} />

        {/* Laboratórios */}
        <Route path="/laboratorios" element={<LaboratorioPage />} />
        <Route path="/laboratorios/novo" element={<LaboratorioFormPage />} />
        <Route path="/laboratorios/:id" element={<LaboratorioFormPage />} />

        {/* Produtos Químicos */}
        <Route path="/produtos" element={<ProdutoPage />} />
        <Route path="/produtos/novo" element={<ProdutoFormPage />} />
        <Route path="/produtos/:id" element={<ProdutoFormPage />} />

        {/* Notas Fiscais */}
        <Route path="/notas" element={<NotaFiscalPage />} />
        <Route path="/notas/novo" element={<NotaFiscalFormPage />} />
        <Route path="/notas/:id" element={<NotaFiscalFormPage />} />

        {/* Estoque */}
        <Route path="/estoque" element={<EstoquePage />} />
        <Route path="/estoque/:laboratorioId" element={<EstoquePage />} />

        {/* Movimentações */}
        <Route path="/movimentacoes" element={<MovimentacaoPage />} />
        <Route path="/movimentacoes/nova" element={<MovimentacaoFormPage />} />
        <Route path="/movimentacoes/:id" element={<MovimentacaoFormPage />} />

        {/* Usuários */}
        <Route path="/usuarios" element={<UsuarioPage />} />
        <Route path="/usuarios/novo" element={<UsuarioFormPage />} />
        <Route path="/usuarios/:id" element={<UsuarioFormPage />} />

        {/* Relatórios */}
        <Route path="/relatorios" element={<RelatorioPage />} />






        
      
        {/* Protected Routes */}
        <Route element={<AuthenticatedRoutes />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<DashboardPage />} />

          {/* Departamentos */}
          <Route path="/departamentos" element={<DepartamentoPage />} />
          <Route path="/departamentos/novo" element={<DepartamentoFormPage />} />
          <Route path="/departamentos/:id" element={<DepartamentoFormPage />} />

          {/* Laboratórios */}
          <Route path="/laboratorios" element={<LaboratorioPage />} />
          <Route path="/laboratorios/novo" element={<LaboratorioFormPage />} />
          <Route path="/laboratorios/:id" element={<LaboratorioFormPage />} />

          {/* Produtos Químicos */}
          <Route path="/produtos" element={<ProdutoPage />} />
          <Route path="/produtos/novo" element={<ProdutoFormPage />} />
          <Route path="/produtos/:id" element={<ProdutoFormPage />} />

          {/* Notas Fiscais */}
          <Route path="/notas" element={<NotaFiscalPage />} />
          <Route path="/notas/novo" element={<NotaFiscalFormPage />} />
          <Route path="/notas/:id" element={<NotaFiscalFormPage />} />

          {/* Estoque */}
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/estoque/:laboratorioId" element={<EstoquePage />} />

          {/* Movimentações */}
          <Route path="/movimentacoes" element={<MovimentacaoPage />} />
          <Route path="/movimentacoes/nova" element={<MovimentacaoFormPage />} />
          <Route path="/movimentacoes/:id" element={<MovimentacaoFormPage />} />

          {/* Usuários */}
          <Route path="/usuarios" element={<UsuarioPage />} />
          <Route path="/usuarios/novo" element={<UsuarioFormPage />} />
          <Route path="/usuarios/:id" element={<UsuarioFormPage />} />

          {/* Relatórios */}
          <Route path="/relatorios" element={<RelatorioPage />} />
        </Route>

      </Routes>
    </>
  );
}