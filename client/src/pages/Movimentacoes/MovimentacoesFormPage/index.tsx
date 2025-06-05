import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { IMovimentacaoForm } from "@/commons/MovimentacoesInterface";
import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";
import { CabecalhoMovimentacaoForm } from "@/components/Common/CabecalhoMovimentacaoForm/CabecalhoMovimentacaoForm";
import { ListaItensMovimentacao } from "@/components/Common/ListaItensMovimentacao/ListaItensMovimentacao";
import FornecedorService from "@/service/FornecedorService";
import LaboratorioService from "@/service/LaboratorioService";
import ProdutoQuimicoService from "@/service/ProdutoQuimicoService";
import { ConfirmarMovimentacao } from "@/components/Common/ConfirmaMovimentacao/ConfirmaMovimentacao";
import { ItensMovimentacaoForm } from "@/components/Common/ItensMovimentacaoForm/ItensMovimentacaoForm";
import { useAuthUser } from "@/hooks/useAuthUser/UseAuthUser";
import { IFornecedor } from "@/commons/FornecedorInterface";
import { ILaboratorio } from "@/commons/LaboratorioInterface";


export default function MovimentacaoFormPage() {
  const user = useAuthUser();
  const isPerfilRestrito = user?.tipoPerfil !== "ADMINISTRADOR";

  const { control, watch } = useForm<IMovimentacaoForm>({
    defaultValues: {
      tipo: isPerfilRestrito ? "SAIDA" : undefined,
      notaFiscal: {
        numeroNotaFiscal: undefined,
        dataRecebimento: "",
        fornecedor: { id: undefined },
      },
      laboratorioDestino: { id: undefined },
      laboratorioOrigem: { id: undefined },
      itens: [],
    },
  });

  const tipoMovimentacao = watch("tipo");
  const toast = useRef<Toast>(null);

  const [fornecedores, setFornecedores] = useState<IFornecedor[]>([]);
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [itens, setItens] = useState<IItemMovimentacao[]>([]);

  useEffect(() => {
    FornecedorService.listarFornecedores().then((res) => setFornecedores(res.data));
    ProdutoQuimicoService.listarProdutosQuimicos().then((res) => setProdutos(res.data));

    LaboratorioService.listarLaboratorios().then((res) => {
      let labs: ILaboratorio[] = res.data;

      if (user?.tipoPerfil === "RESPONSAVEL_LABORATORIO") {
        labs = labs.filter((lab) => user.laboratoriosId.includes(lab.id));
      } else if (user?.tipoPerfil === "RESPONSAVEL_DEPARTAMENTO") {
        labs = labs.filter((lab) => user.departamentosId.includes(lab.departamento.id));
      }

      setLaboratorios(labs);
    });
  }, [user]);

  const adicionarItem = (item: IItemMovimentacao) => {
    setItens([...itens, item]);
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const validarCabecalho = (): boolean => {
    if (!tipoMovimentacao) return false;

    if (tipoMovimentacao === "TRANSFERENCIA") {
      const origem = watch("laboratorioOrigem.id");
      const destino = watch("laboratorioDestino.id");
      if (!origem || !destino || origem === destino) {
        toast.current?.show({
          severity: "warn",
          summary: "Erro",
          detail: "Laboratórios de origem e destino devem ser diferentes.",
        });
        return false;
      }
    }

    if (tipoMovimentacao === "ENTRADA") {
      const fornecedor = watch("notaFiscal.fornecedor.id");
      if (!fornecedor) {
        toast.current?.show({
          severity: "warn",
          summary: "Erro",
          detail: "Fornecedor é obrigatório.",
        });
        return false;
      }
    }

    return true;
  };

  return (
    <div className="p-4 space-y-6">
      <Toast ref={toast} />

      <CabecalhoMovimentacaoForm
        control={control}
        watch={watch}
        fornecedores={fornecedores}
        laboratorios={laboratorios}
        disableTipo={isPerfilRestrito}
        hideNotaFiscal={isPerfilRestrito}
        hideDestino={isPerfilRestrito}
      />

      <ItensMovimentacaoForm
        tipoMovimentacao={tipoMovimentacao}
        produtos={produtos}
        onAdicionar={adicionarItem}
        itens={itens}
        laboratorioOrigemId={watch("laboratorioOrigem.id")}
      />

      <ListaItensMovimentacao itens={itens} onRemove={removerItem} />

      <ConfirmarMovimentacao
        dadosCabecalho={{ ...watch(), itens }}
        itens={itens}
        validarCabecalho={validarCabecalho}
      />
    </div>
  );
}
