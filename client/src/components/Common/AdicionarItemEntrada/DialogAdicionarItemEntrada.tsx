import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';

import { IProdutoSimplificado } from '@/commons/ProdutoQuimicoInterface';
import { IItemMovimentacao } from '@/commons/ItemMovimentacaoInterface';

interface Props {
  visible: boolean;
  onHide: () => void;
  produto: IProdutoSimplificado;
  onAdicionar: (item: IItemMovimentacao) => void;
}

export function DialogAdicionarItemEntrada({
  visible,
  onHide,
  produto,
  onAdicionar,
}: Props) {
  const toast = useRef<Toast>(null);

  const [lote, setLote] = useState('');
  const [fabricacao, setFabricacao] = useState<Date | null>(null);
  const [validade, setValidade] = useState<Date | null>(null);
  const [quantidade, setQuantidade] = useState<number | null>(null);

  const limpar = () => {
    setLote('');
    setFabricacao(null);
    setValidade(null);
    setQuantidade(null);
  };

  const formatDateToLocalDate = (date: Date) => {
    return date.toISOString().split('T')[0]; // Exemplo: "2025-06-21"
  };

  const handleAdicionar = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (!lote || !fabricacao || !validade || !quantidade) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campos obrigatórios',
        detail: 'Preencha todos os campos antes de adicionar.',
      });
      return;
    }

    if (fabricacao > hoje) {
      toast.current?.show({
        severity: 'error',
        summary: 'Data inválida',
        detail: 'Fabricação não pode ser maior que hoje.',
      });
      return;
    }

    if (validade < fabricacao) {
      toast.current?.show({
        severity: 'error',
        summary: 'Data inválida',
        detail: 'Validade não pode ser menor que fabricação.',
      });
      return;
    }

    if (validade < hoje) {
      toast.current?.show({
        severity: 'error',
        summary: 'Data inválida',
        detail: 'Validade não pode ser menor que hoje.',
      });
      return;
    }

    const item: IItemMovimentacao = {
      produtoId: produto.id,
      nomeProduto: produto.nome,
      lote,
      quantidadeSolicitada: quantidade,
      quantidadeAprovada: quantidade,
      preco: null,
      fabricacao: formatDateToLocalDate(fabricacao),
      validade: formatDateToLocalDate(validade),
      cas: produto.cas,
      densidade: produto.densidade,
      concentracao: produto.concentracao,
    };

    onAdicionar(item);
    limpar();
    onHide();
  };

  return (
    <Dialog
      header={`Adicionar Item - ${produto.nome}`}
      visible={visible}
      onHide={() => {
        limpar();
        onHide();
      }}
      style={{ width: '500px' }}
      modal
    >
      <Toast ref={toast} />

      <div className="d-grid gap-3">
        <div>
          <label>Lote</label>
          <InputText
            value={lote}
            onChange={(e) => setLote(e.target.value)}
            className="w-100"
          />
        </div>

        <div>
          <label>Data de Fabricação</label>
          <Calendar
            value={fabricacao}
            onChange={(e) => setFabricacao(e.value as Date)}
            maxDate={new Date()}
            dateFormat="dd/mm/yy"
            className="w-100"
            showIcon
          />
        </div>

        <div>
          <label>Data de Validade</label>
          <Calendar
            value={validade}
            onChange={(e) => setValidade(e.value as Date)}
            minDate={fabricacao || new Date()}
            dateFormat="dd/mm/yy"
            className="w-100"
            showIcon
          />
        </div>

        <div>
          <label>Quantidade</label>
          <InputNumber
            value={quantidade}
            onValueChange={(e) => setQuantidade(e.value ?? null)}
            className="w-100"
            min={0}
            placeholder="Quantidade"
          />
        </div>

        <div className="text-end">
          <Button
            label="Adicionar"
            icon="pi pi-check"
            onClick={handleAdicionar}
          />
        </div>
      </div>
    </Dialog>
  );
}
