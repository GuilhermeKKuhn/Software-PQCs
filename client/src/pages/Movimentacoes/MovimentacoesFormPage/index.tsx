import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { IMovimentacaoForm } from "@/commons/MovimentacoesInterface";
import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";
import { CabecalhoMovimentacaoForm } from "@/components/Common/CabecalhoMovimentacaoForm/CabecalhoMovimentacaoForm";
import { ListaItensMovimentacao } from "@/components/Common/ListaItensMovimentacao/ListaItensMovimentacao";
import FornecedorService from "@/service/FornecedorService";
import LaboratorioService from "@/service/LaboratorioService";
import ProdutoQuimicoService from "@/service/ProdutoQuimicoService";
import { ConfirmarMovimentacao } from "@/components/Common/ConfirmaMovimentacao/ConfirmaMovimentacao";
import { ItensMovimentacaoForm } from "@/components/Common/ItensMovimentacaoForm/ItensMovimentacaoForm";

export default function MovimentacaoFormPage() {
  const { control, watch } = useForm<IMovimentacaoForm>({
    defaultValues: {
      tipo: undefined,
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

  const [fornecedores, setFornecedores] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState<IItemMovimentacao[]>([]);

  useEffect(() => {
    FornecedorService.listarFornecedores().then((res) => setFornecedores(res.data as any));
    LaboratorioService.listarLaboratorios().then((res) => setLaboratorios(res.data as any));
    ProdutoQuimicoService.listarProdutosQuimicos().then((res) => setProdutos(res.data as any));
  }, []);

  const adicionarItem = (item: IItemMovimentacao) => {
    setItens([...itens, item]);
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-6">
      <CabecalhoMovimentacaoForm
        control={control}
        watch={watch}
        fornecedores={fornecedores}
        laboratorios={laboratorios}
      />

      <ItensMovimentacaoForm
        tipoMovimentacao={tipoMovimentacao}
        produtos={produtos}
        onAdicionar={adicionarItem}
        itens={itens}
      />

      <ListaItensMovimentacao
        itens={itens}
        onRemove={removerItem}
      />

      <div className="w-full flex justify-end mt-4">
        <ConfirmarMovimentacao
          dadosCabecalho={{ ...watch(), itens }}
          itens={itens}
        />
      </div>

    </div>
  );
}
