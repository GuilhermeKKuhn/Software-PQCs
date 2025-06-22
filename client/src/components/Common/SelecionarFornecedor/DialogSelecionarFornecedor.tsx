import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';

import { IFornecedor } from '@/commons/FornecedorInterface';

interface Props {
  visible: boolean;
  onHide: () => void;
  fornecedores: IFornecedor[];
  onSelect: (fornecedor: IFornecedor) => void;
}

export function DialogSelecionarFornecedor({
  visible,
  onHide,
  fornecedores,
  onSelect,
}: Props) {
  const [filtro, setFiltro] = useState('');
  const [listaFiltrada, setListaFiltrada] = useState<IFornecedor[]>([]);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (filtro.trim() === '') {
      setListaFiltrada(fornecedores);
    } else {
      const filtroLower = filtro.toLowerCase();
      const filtrados = fornecedores.filter(
        (f) =>
          f.razaoSocial.toLowerCase().includes(filtroLower) ||
          f.cnpj.toLowerCase().includes(filtroLower)
      );
      setListaFiltrada(filtrados);
    }
  }, [filtro, fornecedores]);

  const isLicencaVencida = (data: string | Date | null | undefined) => {
    if (!data) return true;
    const validade = new Date(data instanceof Date ? data : String(data));
    const hoje = new Date();
    validade.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);
    return validade < hoje;
  };

  const formatarData = (data: string | Date | null | undefined) => {
    if (!data) return '-';
    const d = new Date(data instanceof Date ? data : String(data));
    return d.toLocaleDateString();
  };

  const formatarCnpj = (cnpj: string) => {
    if (!cnpj) return '';
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  };

  const handleSelecionar = (fornecedor: IFornecedor) => {
    if (isLicencaVencida(fornecedor.dataValidadeLicenca)) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Licença vencida',
        detail: 'Não é possível selecionar um fornecedor com licença vencida.',
      });
      return;
    }

    onSelect(fornecedor);
  };

  return (
    <Dialog
      header="Selecionar Fornecedor"
      visible={visible}
      onHide={onHide}
      style={{ width: '800px' }}
      modal
    >
      <Toast ref={toast} />

      <div className="mb-3">
        <InputText
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por razão social ou CNPJ"
          className="w-100"
        />
      </div>

      {listaFiltrada.length === 0 ? (
        <p className="text-muted">Nenhum fornecedor encontrado.</p>
      ) : (
        <div className="d-grid gap-3">
          {listaFiltrada.map((fornecedor) => {
            const vencido = isLicencaVencida(fornecedor.dataValidadeLicenca);

            return (
              <div
                key={fornecedor.id}
                className={`border rounded p-3 ${
                  vencido ? 'bg-danger bg-opacity-10' : 'bg-light'
                }`}
              >
                <div className="d-flex justify-content-between flex-wrap">
                  <div>
                    <strong>{fornecedor.razaoSocial}</strong> <br />
                    <span className="text-muted">
                      <strong>CNPJ:</strong> {formatarCnpj(fornecedor.cnpj)} <br />
                      <strong>Cidade:</strong> {fornecedor.cidade} - {fornecedor.estado} <br />
                      <strong>Validade da Licença:</strong>{' '}
                      <span style={{ color: vencido ? 'red' : 'inherit' }}>
                        {formatarData(fornecedor.dataValidadeLicenca)}
                      </span>
                    </span>
                  </div>

                  <div className="d-flex align-items-center">
                    <Button
                      label={vencido ? 'Licença Vencida' : 'Selecionar'}
                      icon={vencido ? 'pi pi-ban' : 'pi pi-check'}
                      className={`p-button-sm ${
                        vencido
                          ? 'p-button-danger p-button-outlined'
                          : 'p-button-success'
                      }`}
                      disabled={vencido}
                      onClick={() => handleSelecionar(fornecedor)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Dialog>
  );
}
