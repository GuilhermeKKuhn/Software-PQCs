import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthUser } from "@/hooks/useAuthUser/UseAuthUser";
import ProdutoQuimicoService from "@/service/ProdutoQuimicoService";
import FornecedorService from "@/service/FornecedorService";
import LaboratorioService from "@/service/LaboratorioService";
import MovimentacaoService from "@/service/MovimentacaoService";
import SolicitacaoService from "@/service/SolicitacaoService";

import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { CabecalhoMovimentacaoForm } from "@/components/Common/CabecalhoMovimentacaoForm/CabecalhoMovimentacaoForm";
import { ListaItensMovimentacao } from "@/components/Common/ListaItensMovimentacao/ListaItensMovimentacao";
import { ConfirmarMovimentacao } from "@/components/Common/ConfirmaMovimentacao/ConfirmaMovimentacao";
import { ItensMovimentacaoForm } from "@/components/Common/ItensMovimentacaoForm/ItensMovimentacaoForm";
import { DialogAdicionarItemEntrada } from "@/components/Common/AdicionarItemEntrada/DialogAdicionarItemEntrada";
import { DialogAdicionarItemTransferencia } from "@/components/Common/AdicionarItemTransferencia/DialogAdicionarItemTransferencia";

import { IMovimentacaoForm } from "@/commons/MovimentacoesInterface";
import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";
import { IProdutoSimplificado, LoteDisponivel } from "@/commons/ProdutoQuimicoInterface";
import { IFornecedor } from "@/commons/FornecedorInterface";

export default function MovimentacoesFormPage() {
  const { id: solicitacaoId } = useParams();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const user = useAuthUser();
  const isAdmin = user?.tipoPerfil === "ADMINISTRADOR";
  const isSolicitacao = Boolean(solicitacaoId);
  const isNova = !solicitacaoId;

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

  const [produtos, setProdutos] = useState<IProdutoSimplificado[]>([]);
  const [laboratorios, setLaboratorios] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<IFornecedor[]>([]);
  const [itens, setItens] = useState<IItemMovimentacao[]>([]);

  const [lotesDisponiveis, setLotesDisponiveis] = useState<LoteDisponivel[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<IProdutoSimplificado | null>(null);
  const [indexEditando, setIndexEditando] = useState<number | null>(null);

  const [dialogEntradaAberto, setDialogEntradaAberto] = useState(false);
  const [dialogTransferenciaAberto, setDialogTransferenciaAberto] = useState(false);

  // 🔥 Carregar dados iniciais
  useEffect(() => {
    ProdutoQuimicoService.listarProdutosQuimicos().then((res) => {
      const produtosFormatados = res.data.map((p: any) => ({
        id: p.id,
        nome: p.nome,
        cas: p.cas,
        densidade: p.densidade,
        concentracao: p.concentracao,
      }));
      setProdutos(produtosFormatados);
    });

    FornecedorService.listarFornecedores().then((res) => {
      setFornecedores(res.data);
    });

    LaboratorioService.listarLaboratorios().then((res) => {
      let labs = res.data;

      if (user?.tipoPerfil === "RESPONSAVEL_LABORATORIO") {
        labs = labs.filter((lab: any) => user.laboratoriosId.includes(lab.id));
      } else if (user?.tipoPerfil === "RESPONSAVEL_DEPARTAMENTO") {
        labs = labs.filter((lab: any) => user.departamentosId.includes(lab.departamento.id));
      }

      setLaboratorios(labs);
    });
  }, [user]);

  // 🔥 Se for uma movimentação baseada em solicitação, carregar dados da solicitação
  useEffect(() => {
    if (solicitacaoId) {
      MovimentacaoService.gerarMovimentacaoPreenchida(Number(solicitacaoId)).then((res) => {
        const mov = res.data;
        reset({
          tipo: mov.tipo,
          laboratorioDestino: mov.laboratorioDestino,
          laboratorioOrigem: { id: 0 }, // Admin escolhe na hora
          notaFiscal: {
            numeroNotaFiscal: 0,
            dataRecebimento: new Date().toISOString(),
            fornecedor: { id: 0 },
          },
        });
        setItens(
          mov.itens.map((item: any) => ({
            ...item,
            quantidadeSolicitada: item.quantidade,
            quantidadeAprovada: item.quantidade,
          }))
        );
      });
    }
  }, [solicitacaoId, reset]);

  // 🔥 Se for user não-admin (responsável), força tipo para SAIDA
  useEffect(() => {
    if (
      (user?.tipoPerfil === "RESPONSAVEL_LABORATORIO" ||
        user?.tipoPerfil === "RESPONSAVEL_DEPARTAMENTO") &&
      isNova
    ) {
      setValue("tipo", "SAIDA");
      if (user.laboratoriosId.length === 1) {
        setValue("laboratorioOrigem.id", user.laboratoriosId[0]);
      }
    }
  }, [user, isNova, setValue]);

  const buscarLotesDisponiveis = (produtoId: number) => {
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
    });
  };

  const handleAdicionarItem = (item: IItemMovimentacao) => {
    if (indexEditando !== null) {
      const novos = [...itens];
      novos[indexEditando] = item;
      setItens(novos);
      setIndexEditando(null);
    } else {
      setItens((prev) => [...prev, item]);
    }
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

  const handleConfirmar = () => {
    const dados = getValues();

    const dto = {
      tipo: dados.tipo,
      laboratorioDestino: dados.laboratorioDestino,
      laboratorioOrigem: dados.laboratorioOrigem,
      notaFiscal: isAdmin ? dados.notaFiscal : null,
      itens,
    };

    MovimentacaoService.novaMovimentacao(dto).then(() => {
      if (isSolicitacao) {
        SolicitacaoService.concluir(Number(solicitacaoId)).then(() => {
          navigate("/movimentacoes");
        });
      } else {
        navigate("/movimentacoes");
      }
    });
  };

  return (
    <div className="container">
      <Toast ref={toast} />
      <PageHeader title={isNova ? "Nova Movimentação" : "Movimentação"} />

      <CabecalhoMovimentacaoForm
        control={control}
        watch={watch}
        setValue={setValue}
        fornecedores={fornecedores}
        laboratorios={laboratorios}
        disableTipo={!isAdmin} 
        hideNotaFiscal={!isAdmin}
        hideDestino={false}
      />

      <ItensMovimentacaoForm
        produtos={produtos}
        tipoMovimentacao={watch("tipo")}
        onAdicionar={handleAdicionarItem}
        laboratorioOrigemId={laboratorioOrigemId}
        buscarLotesDisponiveis={buscarLotesDisponiveis}
        lotesDisponiveis={lotesDisponiveis}
      />

      <ListaItensMovimentacao
        itens={itens}
        onEditar={(index, item) => {
          setProdutoSelecionado({
            id: item.produtoId,
            nome: item.nomeProduto,
            cas: item.cas || "",
            densidade: item.densidade || "",
            concentracao: item.concentracao || "",
          });

          setIndexEditando(index);

          if (watch("tipo") === "ENTRADA") {
            setDialogEntradaAberto(true);
          } else {
            buscarLotesDisponiveis(item.produtoId);
            setDialogTransferenciaAberto(true);
          }
        }}
        onRemover={(index) => handleRemoverItem(index)}
      />

      {produtoSelecionado && (
        <>
          <DialogAdicionarItemEntrada
            visible={dialogEntradaAberto}
            onHide={() => {
              setDialogEntradaAberto(false);
              setIndexEditando(null);
            }}
            produto={produtoSelecionado}
            onAdicionar={handleAdicionarItem}
          />

          <DialogAdicionarItemTransferencia
            visible={dialogTransferenciaAberto}
            onHide={() => {
              setDialogTransferenciaAberto(false);
              setIndexEditando(null);
            }}
            produto={produtoSelecionado}
            lotes={lotesDisponiveis}
            onAdicionar={handleAdicionarItem}
          />
        </>
      )}

      <ConfirmarMovimentacao
        dadosCabecalho={getValues()}
        itens={itens}
        validarCabecalho={validarCabecalho}
        onConfirmar={handleConfirmar}
      />
    </div>
  );
}
