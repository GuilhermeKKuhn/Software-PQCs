import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { IFornecedor } from '@/commons/FornecedorInterface';
import FornecedorService from '@/service/FornecedorService';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

export function FornecedorFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const toast = useRef<Toast>(null);
  const toastExibido = useRef(false); // ✅ Controla exibição única

  const [form, setForm] = useState<IFornecedor>({
    razaoSocial: '',
    cnpj: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    email: '',
    numero: '',
    dataValidadeLicenca: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const isLicencaVencida = (data?: Date | null) => {
    if (!data) return false;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return data.getTime() < hoje.getTime();
  };

  useEffect(() => {
    if (isEdit) {
      FornecedorService.buscarFornecedorPorId(Number(id)).then((res) => {
        const fornecedorData = {
          ...res.data,
          dataValidadeLicenca: res.data.dataValidadeLicenca
            ? new Date(res.data.dataValidadeLicenca)
            : null,
        };

        setForm(fornecedorData);

        if (
          isLicencaVencida(fornecedorData.dataValidadeLicenca) &&
          !toastExibido.current
        ) {
          toast.current?.show({
            severity: 'warn',
            summary: 'Licença vencida!',
            detail:
              'A licença desse fornecedor está vencida. Atualize para continuar.',
            life: 4000,
          });
          toastExibido.current = true;
        }
      });
    }
  }, [id, isEdit]);

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    const requiredFields = [
      'razaoSocial',
      'cnpj',
      'telefone',
      'endereco',
      'cidade',
      'estado',
      'email',
      'numero',
      'dataValidadeLicenca',
    ];

    requiredFields.forEach((field) => {
      if (!form[field as keyof IFornecedor]) {
        newErrors[field] = true;
      }
    });

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    const isValid = Object.keys(validationErrors).length === 0;

    if (!isValid) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Campos obrigatórios',
        detail: 'Preencha todos os campos obrigatórios.',
        life: 3000,
      });
      return;
    }

    if (isEdit && isLicencaVencida(form.dataValidadeLicenca)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Licença vencida!',
        detail: 'Atualize a validade da licença antes de salvar.',
        life: 4000,
      });
      return;
    }

    const payload = {
      ...form,
      dataValidadeLicenca: form.dataValidadeLicenca
        ? form.dataValidadeLicenca.toISOString().split('T')[0]
        : null,
    };

    const service = isEdit
      ? () => FornecedorService.editarFornecedor(Number(id), payload)
      : () => FornecedorService.cadastrarFornecedor(payload);

    service()
      .then(() => {
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: isEdit
            ? 'Fornecedor atualizado com sucesso'
            : 'Fornecedor cadastrado com sucesso',
          life: 2000,
        });

        setTimeout(() => {
          navigate('/fornecedor');
        }, 1000);
      })
      .catch((err) => {
        const backendMsg =
          err.response?.data?.message || 'Erro ao salvar Fornecedor.';
        toast.current?.show({
          severity: 'error',
          summary: 'Erro do servidor',
          detail: backendMsg,
          life: 4000,
        });
      });
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="container">
        <h2>{isEdit ? 'Editar Fornecedor' : 'Cadastrar novo Fornecedor'}</h2>

        <div className="p-fluid">
          {[
            { label: 'Razão Social', field: 'razaoSocial' },
            { label: 'CNPJ', field: 'cnpj' },
            { label: 'Email', field: 'email' },
            { label: 'Endereço', field: 'endereco' },
            { label: 'Número', field: 'numero' },
            { label: 'Cidade', field: 'cidade' },
            { label: 'UF', field: 'estado' },
            { label: 'Telefone', field: 'telefone' },
          ].map(({ label, field }) => (
            <div className="field" key={field}>
              <label>{label}</label>
              <InputText
                value={form[field as keyof IFornecedor] as string}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className={classNames({ 'p-invalid': errors[field] })}
              />
            </div>
          ))}

          <div className="field">
            <label
              style={{
                color: isLicencaVencida(form.dataValidadeLicenca)
                  ? 'red'
                  : 'inherit',
              }}
            >
              Data de Validade da Licença
            </label>
            <Calendar
              value={form.dataValidadeLicenca}
              onChange={(e) =>
                setForm({ ...form, dataValidadeLicenca: e.value as Date })
              }
              dateFormat="dd/mm/yy"
              placeholder="Selecione a data"
              className={classNames({
                'p-invalid': errors.dataValidadeLicenca,
              })}
              minDate={new Date()}
              showIcon
            />
          </div>

          <div className="mt-4 flex gap-2">
            <Button label="Salvar" icon="pi pi-check" onClick={handleSubmit} />
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => navigate('/fornecedor')}
            />
          </div>
        </div>
      </div>
    </>
  );
}
