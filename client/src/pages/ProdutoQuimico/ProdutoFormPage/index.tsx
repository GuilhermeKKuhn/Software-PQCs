import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { IUser } from '@/commons/UserInterfaces';
import UserService from '@/service/UserService';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { IProdutoQuimico } from '@/commons/ProdutoQuimicoInterface';
import ProdutoQuimicoService from '@/service/ProdutoQuimicoService';
import { IUnidadeMedida } from '@/commons/UnidadeMedidaInterface';
import UnidadeMedidaService from '@/service/UnidadeMedidaService';

export function ProdutoFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const toast = useRef<Toast>(null);

  const [form, setForm] = useState<IProdutoQuimico>({
    nome: '',
    cas: '',
    validade: 0,
    caracteristica: '',
    estadoFisico: '',
    orgao: '',
    unidadeMedida: {id: 0},
  });

  const [unidade, setUnidade] = useState<IUnidadeMedida[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    UnidadeMedidaService.listarUnidadesMedida().then((res) => setUnidade(res.data))
    if (isEdit) {
      ProdutoQuimicoService.buscarProdutoQuimicoPorId(Number(id)).then((res) => {
        const productData = { ...res.data, password: '' };
        setForm(productData);
      });
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    const requiredFields = ['nome', 'cas', 'validade', 'caracteristica', 'estadoFisico', 'orgao', 'unidadeMedida'];

    requiredFields.forEach((field) => {
      if (!form[field as keyof IProdutoQuimico]) {
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
      ? () => ProdutoQuimicoService.editarProdutoQuimico(Number(id), form)
      : () => ProdutoQuimicoService.cadastrarProdutoQuimico(form);

    service()
      .then(() => {
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: isEdit ? 'Produto Químico atualizado com sucesso' : 'Produto Químico cadastrado com sucesso',
          life: 2000,
        });

        setTimeout(() => {
          navigate('/produtos');
        }, 1000);
      })
      .catch((err) => {
        const validationErrors = err.response?.data?.validationErrors;

        const backendMsg = validationErrors?.password || 'Erro ao salvar usuário.';
        toast.current?.show({
          severity: 'error',
          summary: 'Erro do servidor',
          detail: backendMsg,
          life: 4000,
        });
      });
  };

  const estadosFisicos = [
    { label: "Sólido", value: "SOLIDO" },
    { label: "Líquido", value: "LIQUIDO" },
    { label: "Gasoso", value: "GASOSO" },
  ];

  const caracteristicas = [
    { label: "Ácido", value: "ACIDO" },
    { label: "Alcalino", value: "ALCALINO" },
    { label: "Inflamável", value: "INFLAMAVEL" },
    { label: "Corrosivo", value: "CORROSIVO" },
    { label: "Tóxico", value: "TOXICO" },
    { label: "Reativo", value: "REATIVO" },
    { label: "Explosivo", value: "EXPLOSIVO" },
    { label: "Radioativo", value: "RADIOATIVO" },
    { label: "Oxidante", value: "OXIDANTE" },
    { label: "Estável", value: "ESTAVEL" },
    { label: "Volátil", value: "VOLATIL" },
    { label: "Higroscópico", value: "HIGROSCOPICO" },
  ];

  return (
    <>
      <Toast ref={toast} />
      <div className="container">
        <h2>{isEdit ? 'Editar Produto Químico' : 'Cadastrar novo Produto Químico'}</h2>

        <div className="p-fluid">
          <div className="field">
            <label>Nome Produto Químico</label>
            <InputText
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className={classNames({ 'p-invalid': errors.name })}
            />
          </div>

          <div className="field">
            <label>CAS</label>
            <InputText
              value={form.cas}
              onChange={(e) => setForm({ ...form, cas: e.target.value })}
              className={classNames({ 'p-invalid': errors.email })}
            />
          </div>

          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="estadoFisico">Estado Físico</label>
              <Dropdown
                id="estadoFisico"
                value={form.estadoFisico}
                options={estadosFisicos}
                onChange={(e) => setForm({ ...form, estadoFisico: e.value })}
                placeholder="Selecione o estado físico"
                className={classNames({ 'p-invalid': errors.estadoFisico })}
              />
            </div>
          </div>

          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="caracteristica">Caracteristica</label>
              <Dropdown
                id="caracteristica"
                value={form.caracteristica}
                options={caracteristicas}
                onChange={(e) => setForm({ ...form, caracteristica: e.value })}
                placeholder="Selecione uma caracteristica"
                className={classNames({ 'p-invalid': errors.caracteristica })}
              />
            </div>
          </div>   

          <div className="field">
            <label>Órgão Controlador</label>
            <Dropdown
              value={form.orgao}
              onChange={(e) => setForm({ ...form, orgao: e.value })}
              options={[
                { label: 'Policia Federal', value: 'POLICIA_FEDERAL' },
                { label: 'Policia Militar', value: 'POLICIA_MILITAR' },
                { label: 'Exército', value: 'EXERCITO' },
              ]}
              placeholder="Selecione um Órgão Controlador"
              className={classNames({ 'p-invalid': errors.orgao })}
            />
          </div>

          <div className="field">
            <label>Unidade de Medida</label>
            <Dropdown
              value={form.unidadeMedida.id}
              options={unidade}
              optionLabel="nome"
              optionValue="id"
              placeholder="Selecione a Unidade de medida"
              onChange={(e) =>
                setForm({ ...form, unidadeMedida: { id: e.value } })
              }
            />
          </div>

          <div className="field">
            <label htmlFor="validade">Validade (dias)</label>
            <InputText
              id="validade"
              type="number"
              value={String(form.validade)}
              onChange={(e) => setForm({ ...form, validade: Number(e.target.value) })}
              placeholder="Ex: 30"
              className={classNames({ 'p-invalid': errors.validade })}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <Button label="Salvar" icon="pi pi-check" onClick={handleSubmit} />
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => navigate('/produtos')}
            />
          </div>
        </div>
      </div>
    </>
  );
}
