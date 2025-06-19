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
import { IProdutoQuimico, OrgaoControlador } from '@/commons/ProdutoQuimicoInterface';
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
    caracteristica: '',
    estadoFisico: '',
    concentracao: '',
    densidade: '',
    orgaos: [],
    unidadeMedida: { id: 0 },
  });

  const [unidade, setUnidade] = useState<IUnidadeMedida[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    UnidadeMedidaService.listarUnidadesMedida().then((res) => setUnidade(res.data))
    if (isEdit) {
      ProdutoQuimicoService.buscarProdutoQuimicoPorId(Number(id)).then((res) => {
        const productData = {
        ...res.data,
        orgaos: res.data.orgaos ?? [],
      };
        setForm(productData);
      });
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    const requiredFields = [
      'nome', 'cas', 'concentracao', 'densidade',
      'caracteristica', 'estadoFisico', 'orgaos', 'unidadeMedida'
    ];

    requiredFields.forEach((field) => {
      const value = form[field as keyof IProdutoQuimico];

      if (Array.isArray(value)) {
        if (value.length === 0) {
          newErrors[field] = true;
        }
      } else if (!value || (typeof value === 'object' && value.id === 0)) {
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
        const errorMessage =
          err.response?.data?.message || 'Erro ao salvar produto. Verifique os dados.';

        toast.current?.show({
          severity: 'error',
          summary: 'Atenção',
          detail: errorMessage,
          life: 5000,
        });
      });
  };

  const estadosFisicos = [
    { label: "Sólido", value: "SOLIDO" },
    { label: "Líquido", value: "LIQUIDO" },
    { label: "Gasoso", value: "GASOSO" },
  ];

  const orgaosControladores: { label: string; value: OrgaoControlador }[] = [
  { label: 'Polícia Federal', value: 'POLICIA_FEDERAL' },
  { label: 'Polícia Militar', value: 'POLICIA_MILITAR' },
  { label: 'Exército', value: 'EXERCITO' },
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
              className={classNames({ 'p-invalid': errors.nome })}
            />
          </div>

          <div className="field">
            <label>CAS</label>
            <InputText
              value={form.cas}
              onChange={(e) => setForm({ ...form, cas: e.target.value })}
              className={classNames({ 'p-invalid': errors.cas })}
            />
          </div>

          <div className="field">
            <label>Concentração</label>
            <InputText
              value={form.concentracao}
              onChange={(e) => setForm({ ...form, concentracao: e.target.value })}
              className={classNames({ 'p-invalid': errors.concentracao })}
            />
          </div>

          <div className="field">
            <label>Densidade</label>
            <InputText
              value={form.densidade}
              onChange={(e) => setForm({ ...form, densidade: e.target.value })}
              className={classNames({ 'p-invalid': errors.densidade })}
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
              className={classNames({ 'p-invalid': errors.unidadeMedida })}
            />
          </div>

          <div className="field">
            <label>Órgãos Controladores</label>
            <div className="flex flex-column gap-2">
              {orgaosControladores.map((orgao) => (
                <div key={orgao.value} className="flex align-items-center">
                  <input
                    type="checkbox"
                    checked={form.orgaos.includes(orgao.value)}
                    onChange={(e) => {
                      const selected = form.orgaos.includes(orgao.value)
                        ? form.orgaos.filter((o) => o !== orgao.value)
                        : [...form.orgaos, orgao.value];
                      setForm({ ...form, orgaos: selected });
                    }}
                  />
                  <label className="ml-2">{orgao.label}</label>
                </div>
              ))}
            </div>
            {errors.orgaos && <small className="p-error">Selecione pelo menos um órgão.</small>}
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
