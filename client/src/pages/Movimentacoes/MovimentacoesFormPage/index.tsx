import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import { useAuthUser } from "@/hooks/useAuthUser/UseAuthUser";
import ProdutoQuimicoService from "@/service/ProdutoQuimicoService";
import FornecedorService from "@/service/FornecedorService";
import LaboratorioService from "@/service/LaboratorioService";
import MovimentacaoService from "@/service/MovimentacaoService";

import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { CabecalhoMovimentacaoForm } from "@/components/Common/CabecalhoMovimentacaoForm/CabecalhoMovimentacaoForm";
import { ItensMovimentacaoForm } from "@/components/Common/ItensMovimentacaoForm/ItensMovimentacaoForm";
import { ListaItensMovimentacao } from "@/components/Common/ListaItensMovimentacao/ListaItensMovimentacao";
import { ConfirmarMovimentacao } from "@/components/Common/ConfirmaMovimentacao/ConfirmaMovimentacao";

import { IMovimentacaoForm } from "@/commons/MovimentacoesInterface";
import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";
import { LoteDisponivel } from "@/commons/ProdutoQuimicoInterface";

export default function MovimentacoesFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const user = useAuthUser();
  const isAdmin = user?.tipoPerfil === "ADMINISTRADOR";
  const isNova = !id;

  const { control, watch, setValue, getValues, reset } = useForm<IMovimentacaoForm>({
    defaultValues: {
      laboratorioDestino: { id: 0 },
      laboratorioOrigem: { id: 0 },
      notaFiscal: {
        numeroNotaFiscal: 0,
        dataRecebimento: new Date().toISOString(),
        fornecedor: { id: 0 },
      },
    },
  });

  const tipo = watch("tipo");
  const laboratorioOrigemId = watch("laboratorioOrigem.id");

  const [produtos, setProdutos] = useState<{ id: number; nome: string }[]>([]);
  const [laboratorios, setLaboratorios] = useState<{ id: number; nomeLaboratorio: string }[]>([]);
  const [fornecedores, setFornecedores] = useState<{ id: number; razaoSocial: string }[]>([]);
  const [itens, setItens] = useState<IItemMovimentacao[]>([]);

  const [dialogAberto, setDialogAberto] = useState(false);
  const [lotesDisponiveis, setLotesDisponiveis] = useState<LoteDisponivel[]>([]);
  const [indexSelecionado, setIndexSelecionado] = useState<number | null>(null);

  const disableTipo = !isAdmin || !isNova;

  useEffect(() => {
    if (!id && user && user.tipoPerfil !== "ADMINISTRADOR") {
      setValue("tipo", "SAIDA");
    }
  }, [user, id, setValue]);

  useEffect(() => {
    ProdutoQuimicoService.listarProdutosQuimicos().then((res) => {
      const produtosFormatados = res.data
        .filter((p) => p.id !== undefined)
        .map((p) => ({ id: p.id as number, nome: p.nome }));
      setProdutos(produtosFormatados);
    });

    FornecedorService.listarFornecedores().then((res) => setFornecedores(res.data));

    LaboratorioService.listarLaboratorios().then((res) => {
      let labs = res.data;

      if (user?.tipoPerfil === "RESPONSAVEL_LABORATORIO") {
        labs = labs.filter((lab) => user.laboratoriosId.includes(lab.id));
      } else if (user?.tipoPerfil === "RESPONSAVEL_DEPARTAMENTO") {
        labs = labs.filter((lab) => user.departamentosId.includes(lab.departamento.id));
      }

      setLaboratorios(labs);
    });
  }, [user]);

  useEffect(() => {
    if (id) {
      MovimentacaoService.gerarMovimentacaoPreenchida(Number(id)).then((res) => {
        const mov = res.data;
        reset({
          tipo: mov.tipo,
          laboratorioDestino: mov.laboratorioDestino,
          laboratorioOrigem: mov.laboratorioOrigem,
          notaFiscal: mov.notaFiscal ?? {
            numeroNotaFiscal: 0,
            dataRecebimento: new Date().toISOString(),
            fornecedor: { id: 0 },
          },
        });
       setItens(
          mov.itens.map((item: any) => ({
            ...item,
            quantidadeSolicitada: item.quantidade, // só visual
            quantidadeAprovada: item.quantidade,   // valor inicial editável
          }))
        );
      });
    }
  }, [id, reset]);

  const abrirDialogLote = (index: number, produtoId: number) => {
    if (!laboratorioOrigemId) {
      toast.current?.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Selecione o laboratório de origem primeiro.",
      });
      return;
    }

    ProdutoQuimicoService.buscarLotesDisponiveis(produtoId, laboratorioOrigemId).then((res) => {
      setLotesDisponiveis(res.data);
      setIndexSelecionado(index);
      setDialogAberto(true);
    });
  };

  const handleEditarQuantidade = (index: number, novaQtd: number) => {
    const novosItens = [...itens];
    novosItens[index].quantidadeAprovada = novaQtd;
    setItens(novosItens);
  };


  const usarLote = (loteSelecionado: string) => {
    if (indexSelecionado === null) return;
    const novosItens = [...itens];
    novosItens[indexSelecionado].lote = loteSelecionado;
    setItens(novosItens);
    setDialogAberto(false);
  };

  const handleAdicionarItem = (item: IItemMovimentacao) => {
    setItens((prev) => [...prev, item]);
  };

  const handleRemoverItem = (index: number) => {
    setItens((prev) => prev.filter((_, i) => i !== index));
  };

  const validarCabecalho = () => {
    if (!getValues("tipo")) {
      toast.current?.show({
        severity: "warn",
        summary: "Erro",
        detail: "Tipo de movimentação é obrigatório.",
      });
      return false;
    }
    return true;
  };

  return (
    <div className="container">
      <Toast ref={toast} />
      <PageHeader title="Nova Movimentação" />

      <CabecalhoMovimentacaoForm
        control={control}
        watch={watch}
        fornecedores={fornecedores}
        laboratorios={laboratorios}
        disableTipo={disableTipo}
        hideNotaFiscal={!isAdmin}
        hideDestino={!isAdmin}
      />

      <ItensMovimentacaoForm
        produtos={produtos}
        tipoMovimentacao={tipo}
        laboratorioOrigemId={laboratorioOrigemId}
        onAdicionar={handleAdicionarItem}
        itens={itens}
      />

      <ListaItensMovimentacao
        itens={itens}
        onRemove={handleRemoverItem}
        onSelecionarLote={abrirDialogLote}
        onEditarQuantidade={handleEditarQuantidade}
      />


      <Dialog
        header="Selecionar Lote"
        visible={dialogAberto}
        onHide={() => setDialogAberto(false)}
        modal
        style={{ width: "100%", maxWidth: "600px" }}
        contentStyle={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {lotesDisponiveis.length === 0 ? (
          <p className="text-muted">Nenhum lote disponível para este produto.</p>
        ) : (
          <div className="d-grid gap-3">
            {lotesDisponiveis.map((loteDisp, index) => (
              <div key={index} className="border rounded p-3 bg-light">
                <div className="mb-2">
                  <strong>Lote:</strong> {loteDisp.lote}<br />
                  <strong>Validade:</strong> {new Date(loteDisp.validade).toLocaleDateString()}<br />
                  <strong>Qtd:</strong> {loteDisp.quantidade}
                </div>
                <div className="text-end">
                  <Button
                    label="Usar"
                    icon="pi pi-check"
                    className="p-button-sm p-button-success"
                    onClick={() => usarLote(loteDisp.lote)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Dialog>

      <ConfirmarMovimentacao
        dadosCabecalho={getValues()}
        itens={itens}
        validarCabecalho={validarCabecalho}
      />
    </div>
  );
}
