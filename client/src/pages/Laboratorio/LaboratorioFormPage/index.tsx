import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { ILaboratorio } from '@/commons/LaboratorioInterface';
import { IDepartamento } from '@/commons/DepartamentoInterface';
import LaboratorioService from '@/service/LaboratorioService';
import DepartamentoService from '@/service/DepartamentoService';
import UserService from '@/service/UserService';
import { IUser } from '@/commons/UserInterfaces';

export function LaboratorioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ILaboratorio>({
    nomeLaboratorio: '',
    sala: '',
    departamento: { id: 0 },
    responsavel: { id: 0 },
  });

  const [usuarios, setUsuarios] = useState<IUser[]>([]);
  const [departamentos, setDepartamentos] = useState<IDepartamento[]>([]);

  useEffect(() => {
    UserService.listarUser().then((res) => setUsuarios(res.data));
    DepartamentoService.listarDepartamentos().then((res) => setDepartamentos(res.data));

    if (isEdit) {
      LaboratorioService.buscarLaboratorioPorId(Number(id)).then((res) => {
        setForm(res.data);
      });
    }
  }, [id]);

  const handleSubmit = () => {
    const service = isEdit
      ? () => LaboratorioService.editarLaboratorio(Number(id), form)
      : () => LaboratorioService.cadastrarLaboratorio(form);

    service().then(() => {
      navigate('/laboratorios');
    });
  };

  return (
    <div className="container">
      <h2>{isEdit ? 'Editar Laboratório' : 'Cadastro de Novo Laboratório'}</h2>

      <div className="p-fluid">
        <div className="field">
          <label>Nome do Laboratório</label>
          <InputText
            value={form.nomeLaboratorio}
            onChange={(e) => setForm({ ...form, nomeLaboratorio: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Sala</label>
          <InputText
            value={form.sala}
            onChange={(e) => setForm({ ...form, sala: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Departamento</label>
          <Dropdown
            value={form.departamento.id}
            options={departamentos}
            optionLabel="nomeDepartamento"
            optionValue="id"
            placeholder="Selecione o departamento"
            onChange={(e) =>
              setForm({ ...form, departamento: { id: e.value } })
            }
          />
        </div>

        <div className="field">
          <label>Responsável</label>
          <Dropdown
            value={form.responsavel.id}
            options={usuarios}
            optionLabel="name"
            optionValue="id"
            placeholder="Selecione o responsável"
            onChange={(e) =>
              setForm({ ...form, responsavel: { id: e.value } })
            }
          />
        </div>

        <div className="mt-4 flex gap-2">
          <Button label="Salvar" icon="pi pi-check" onClick={handleSubmit} />
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={() => navigate('/laboratorios')}
          />
        </div>
      </div>
    </div>
  );
}
