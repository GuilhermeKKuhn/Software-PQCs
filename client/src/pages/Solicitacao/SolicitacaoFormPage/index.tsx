import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";

import { IItemSolicitacao } from "@/commons/ItemSolicitacaoInterface";
import { IProdutoQuimico } from "@/commons/ProdutoQuimicoInterface";
import { ILaboratorio } from "@/commons/LaboratorioInterface";

import ProdutoQuimicoService from "@/service/ProdutoQuimicoService";
import LaboratorioService from "@/service/LaboratorioService";
import SolicitacaoService from "@/service/SolicitacaoService";

import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { DialogSelecionarProduto } from "@/components/Common/SelecionarProduto/DialogSelecionarProduto";


export function SolicitacaoFormPage() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [produtos, setProdutos] = useState<IProdutoQuimico[]>([]);
  const [laboratorioId, setLaboratorioId] = useState<number | null>(null);
  const [itens, setItens] = useState<IItemSolicitacao[]>([]);

  const [dialogProdutoAberto, setDialogProdutoAberto] = useState(false);
  const [dialogQuantidadeAberto, setDialogQuantidadeAberto] = useState(false);

  const [produtoSelecionado, setProdutoSelecionado] = useState<IProdutoQuimico | null>(null);
  const [quantidade, setQuantidade] = useState<number>(0);

  useEffect(() => {
    LaboratorioService.listarLaboratoriosPermitidos().then((res) => setLaboratorios(res.data));
    ProdutoQuimicoService.listarProdutosQuimicos().then((res) => setProdutos(res.data));
  }, []);

  const handleAdicionarItem = () => {
    if (!produtoSelecionado || quantidade <= 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Campos obrigatórios",
        detail: "Selecione um produto e defina uma quantidade válida.",
        life: 3000,
      });
      return;
    }

    const novoItem: IItemSolicitacao = {
      produtoId: produtoSelecionado.id,
      quantidadeSolicitada: quantidade,
    };

    setItens((prev) => [...prev, novoItem]);
    setDialogQuantidadeAberto(false);
    setProdutoSelecionado(null);
    setQuantidade(0);
  };

  const removerItem = (index: number) => {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  };

  const enviarSolicitacao = () => {
    if (!laboratorioId || itens.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Formulário incompleto",
        detail: "Selecione um laboratório e adicione ao menos um item.",
        life: 3000,
      });
      return;
    }

    const dto = {
      laboratorioId,
      itens,
    };

    SolicitacaoService.criarSolicitacao(dto)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Solicitação enviada com sucesso!",
          life: 2000,
        });
        setTimeout(() => navigate("/solicitacoes"), 1000);
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Erro ao enviar",
          detail: "Ocorreu um erro ao enviar a solicitação.",
          life: 4000,
        });
      });
  };

  return (
    <div className="container">
      <Toast ref={toast} />
      <PageHeader title="Nova Solicitação de Material" />

      <div className="card p-3 mb-4">
        <label>Laboratório</label>
        <select
          className="form-control"
          value={laboratorioId || ""}
          onChange={(e) => setLaboratorioId(Number(e.target.value))}
        >
          <option value="">Selecione...</option>
          {laboratorios.map((lab) => (
            <option key={lab.id} value={lab.id}>
              {lab.nomeLaboratorio} - Sala {lab.sala}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Itens da Solicitação</h5>
        <button className="btn btn-secondary" onClick={() => setDialogProdutoAberto(true)}>
          Adicionar Item
        </button>
      </div>

      {itens.length === 0 && (
        <p className="text-muted">Nenhum item adicionado ainda.</p>
      )}

      {itens.map((item, index) => {
        const produto = produtos.find((p) => p.id === item.produtoId);
        return (
          <div key={index} className="card mb-2 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">{produto?.nome}</h6>
                <small className="text-muted">
                  Quantidade solicitada: <strong>{item.quantidadeSolicitada}</strong>
                </small>
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => removerItem(index)}
              >
                Remover
              </button>
            </div>
          </div>
        );
      })}

      <div className="text-end mt-3">
        <button className="btn btn-success" onClick={enviarSolicitacao}>
          Enviar Solicitação
        </button>
      </div>

      {/* Dialog selecionar produto */}
      <DialogSelecionarProduto
        visible={dialogProdutoAberto}
        onHide={() => setDialogProdutoAberto(false)}
        produtos={produtos}
        onSelect={(produto) => {
          setProdutoSelecionado(produto);
          setDialogProdutoAberto(false);
          setDialogQuantidadeAberto(true);
        }}
      />

      {/* Dialog para definir quantidade */}
      <Dialog
        header="Definir Quantidade"
        visible={dialogQuantidadeAberto}
        onHide={() => setDialogQuantidadeAberto(false)}
        style={{ width: "400px" }}
        modal
      >
        {produtoSelecionado && (
          <>
            <div className="mb-3">
              <label>Produto</label>
              <input
                type="text"
                className="form-control"
                value={produtoSelecionado.nome}
                disabled
              />
            </div>

            <div className="mb-3">
              <label>Quantidade</label>
              <input
                type="number"
                className="form-control"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                min={0}
              />
            </div>

            <div className="text-end">
              <button
                className="btn btn-secondary me-2"
                onClick={() => setDialogQuantidadeAberto(false)}
              >
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleAdicionarItem}>
                Confirmar
              </button>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
