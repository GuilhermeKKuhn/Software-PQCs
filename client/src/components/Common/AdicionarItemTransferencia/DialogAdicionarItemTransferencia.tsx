import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';

import { IItemMovimentacao } from '@/commons/ItemMovimentacaoInterface';
import { LoteDisponivel } from '@/commons/ProdutoQuimicoInterface';

interface Props {
  visible: boolean;
  onHide: () => void;
  produto: { id: number; nome: string };
  lotes: LoteDisponivel[];
  onAdicionar: (item: IItemMovimentacao) => void;
}

export function DialogAdicionarItemTransferencia({
  visible,
  onHide,
  produto,
  lotes,
  onAdicionar,
}: Props) {
  const toast = useRef<Toast>(null);

  const [quantidadesPorLote, setQuantidadesPorLote] = useState<Record<string, number>>({});

  const isVencido = (dataValidade: string) => {
    const hoje = new Date();
    const validade = new Date(dataValidade);
    return validade < hoje;
  };

  const handleAdicionar = () => {
    const lotesSelecionados = lotes.filter(
      (l) => (quantidadesPorLote[l.lote] ?? 0) > 0
    );

    if (lotesSelecionados.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Nenhum lote selecionado',
        detail: 'Informe a quantidade para pelo menos um lote.',
      });
      return;
    }

    for (const lote of lotesSelecionados) {
      const quantidade = quantidadesPorLote[lote.lote];

      if (quantidade > lote.quantidade) {
        toast.current?.show({
          severity: 'error',
          summary: 'Estoque insuficiente',
          detail: `A quantidade do lote ${lote.lote} é maior que disponível (${lote.quantidade}).`,
        });
        return;
      }

      if (quantidade <= 0 || quantidade === null) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Quantidade inválida',
          detail: `Informe uma quantidade válida para o lote ${lote.lote}.`,
        });
        return;
      }
    }

    // ✅ Se passou em todas as validações, adiciona os itens:
    lotesSelecionados.forEach((lote) => {
      const quantidade = quantidadesPorLote[lote.lote];

      onAdicionar({
        produtoId: produto.id,
        nomeProduto: produto.nome,
        lote: lote.lote,
        quantidadeAprovada: quantidade,
        quantidadeSolicitada: quantidade,
        preco: null,
        fabricacao: lote.dataFabricacao,
        validade: lote.dataValidade,
      });
    });

    // Limpa os campos e fecha
    setQuantidadesPorLote({});
    onHide();
  };

  return (
    <Dialog
      header={`Selecionar Lote - ${produto.nome}`}
      visible={visible}
      onHide={() => {
        setQuantidadesPorLote({});
        onHide();
      }}
      style={{ width: '600px' }}
      modal
      footer={
        <div className="d-flex justify-content-end">
          <Button
            label="Adicionar"
            icon="pi pi-check"
            className="p-button-success"
            onClick={handleAdicionar}
          />
        </div>
      }
    >
      <Toast ref={toast} />

      {lotes.length === 0 ? (
        <p className="text-muted">Nenhum lote disponível para este produto.</p>
      ) : (
        <div className="d-grid gap-3">
          {lotes.map((lote) => {
            const vencido = isVencido(lote.dataValidade);

            return (
              <div
                key={lote.lote}
                className="border rounded p-3 bg-light"
              >
                <div className="fw-bold mb-2">Lote: {lote.lote}</div>
                <div className="d-flex justify-content-between flex-wrap">
                  <div className="small text-muted">
                    <strong>Fabricação:</strong>{' '}
                    {new Date(lote.dataFabricacao).toLocaleDateString()} <br />
                    <strong>Validade:</strong>{' '}
                    <span
                      style={{
                        color: vencido ? 'red' : 'inherit',
                        fontWeight: vencido ? 'bold' : 'normal',
                      }}
                    >
                      {new Date(lote.dataValidade).toLocaleDateString()}
                    </span>{' '}
                    <br />
                    <strong>Disponível:</strong> {lote.quantidade} <br />
                    <strong>Laboratório:</strong> {lote.nomeLaboratorio}
                  </div>
                </div>

                <div className="d-flex gap-2 align-items-center mt-3">
                  <InputNumber
                    value={quantidadesPorLote[lote.lote] ?? null}
                    onValueChange={(e) =>
                      setQuantidadesPorLote((prev) => ({
                        ...prev,
                        [lote.lote]: e.value ?? 0,
                      }))
                    }
                    placeholder="Qtd"
                    min={0}
                    className="w-100"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Dialog>
  );
}
