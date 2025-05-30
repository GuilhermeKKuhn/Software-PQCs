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

export function DepartamentoFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<IDepartamento>({
    nomeDepartamento: '',
    sigla: '',
    responsavel: { id: 0 },
  });

  const [usuarios, setUsuarios] = useState<IUser[]>([]);

  useEffect(() => {
    UserService.listarUser().then((res) => setUsuarios(res.data));
    if (isEdit) {
      DepartamentoService.buscarDepartamentoPorId(Number(id)).then((res) => {
        setForm(res.data);
      });
    }
  }, [id]);

  const handleSubmit = () => {
    const service = isEdit
      ? () => DepartamentoService.editarDepartamento(Number(id), form)
      : () => DepartamentoService.cadastrarDepartamento(form);

    service().then(() => {
      navigate('/departamentos');
    });
  };

  return (
    <div className="container">
      <h2>{isEdit ? 'Editar Departamento' : 'Cadastro de Novo Departamento'}</h2>

      <div className="p-fluid">
        <div className="field">
          <label>Nome do Departamento</label>
          <InputText
            value={form.nomeDepartamento}
            onChange={(e) => setForm({ ...form, nomeDepartamento: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Sigla do Departamento</label>
          <InputText
            value={form.sigla}
            onChange={(e) => setForm({ ...form, sigla: e.target.value })}
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
            onClick={() => navigate('/departamentos')}
          />
        </div>
      </div>
    </div>
  );
}
