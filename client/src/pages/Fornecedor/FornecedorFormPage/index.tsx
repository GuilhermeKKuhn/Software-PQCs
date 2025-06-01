import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { IFornecedor } from '@/commons/FornecedorInterface';
import FornecedorService from '@/service/FornecedorService';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

export function FornecedorFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const toast = useRef<Toast>(null);

  const [form, setForm] = useState<IFornecedor>({
    razaoSocial: '',
    cnpj: '',
    telefone: '',
    endereco: '',
    cidade: '',
    estado: '',
    email: '',
    numero: '',
  });

  const [fornecedor, setFornecedor] = useState<IFornecedor[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    FornecedorService.listarFornecedores().then((res) => setFornecedor(res.data))
    if (isEdit) {
      FornecedorService.buscarFornecedorPorId(Number(id)).then((res) => {
        const fornecedorData = { ...res.data };
        setForm(fornecedorData);
      });
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    const requiredFields = ['razaoSocial', 'cnpj', 'telefone', 'endereco', 'cidade', 'estado', 'email', 'numero'];

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

    const service = isEdit
      ? () => FornecedorService.editarFornecedor(Number(id), form)
      : () => FornecedorService.cadastrarFornecedor(form);

    service()
      .then(() => {
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: isEdit ? 'Fornecedor atualizado com sucesso' : 'Fornecedor cadastrado com sucesso',
          life: 2000,
        });

        setTimeout(() => {
          navigate('/fornecedor');
        }, 1000);
      })
      .catch((err) => {
        const validationErrors = err.response?.data?.validationErrors;

        const backendMsg = validationErrors?.password || 'Erro ao salvar Fornecedor.';
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
          <div className="field">
            <label>Razão Social</label>
            <InputText
              value={form.razaoSocial}
              onChange={(e) => setForm({ ...form, razaoSocial: e.target.value })}
              className={classNames({ 'p-invalid': errors.razaoSocial })}
            />
          </div>

          <div className="field">
            <label>CNPJ</label>
            <InputText
              value={form.cnpj}
              onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
              className={classNames({ 'p-invalid': errors.cnpj })}
            />
          </div>

          <div className="field">
            <label>Email</label>
            <InputText
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={classNames({ 'p-invalid': errors.email })}
            />
          </div>
          

          <div className="field">
            <label>Endereço</label>
            <InputText
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
              className={classNames({ 'p-invalid': errors.endereco })}
            />
          </div>

          <div className="field">
            <label>Numero</label>
            <InputText
              value={form.numero}
              onChange={(e) => setForm({ ...form, numero: e.target.value })}
              className={classNames({ 'p-invalid': errors.numero })}
            />
          </div>

          <div className="field">
            <label>Cidade</label>
            <InputText
              value={form.cidade}
              onChange={(e) => setForm({ ...form, cidade: e.target.value })}
              className={classNames({ 'p-invalid': errors.cidade })}
            />
          </div>

          <div className="field">
            <label>UF</label>
            <InputText
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className={classNames({ 'p-invalid': errors.estado })}
            />
          </div>

          <div className="field">
            <label>Telefone</label>
            <InputText
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              className={classNames({ 'p-invalid': errors.telefone })}
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
