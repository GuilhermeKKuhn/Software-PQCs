import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import UnidadeService from '@/service/UnidadeMedidaService';
import { IUnidadeMedida } from '@/commons/UnidadeMedidaInterface';

export function UnidadeMedidaFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

   const [form, setForm] = useState<IUnidadeMedida>({
   nome: '',
   sigla: '',
   });

  useEffect(() => {
    if (isEdit) {
      UnidadeService.buscarUnidadeMedidaPorId(Number(id)).then((res) => {
        setForm(res.data);
      });
    }
  }, [id]);

 const handleSubmit = () => {
  const service = isEdit
    ? () => UnidadeService.editarUnidadeMedida(Number(id), form)
    : () => UnidadeService.cadastrarUnidadeMedida(form);

  service().then(() => {
    navigate('/unidademedida');
  });
};


  return (
    <div className="container">
      <h2>{isEdit ? 'Editar Unidade de medida' : 'Cadastro de Nova Unidade de medida'}</h2>

      <div className="p-fluid">
        <div className="field">
          <label>Nome</label>
          <InputText
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </div>

        <div className="field">
          <label>Sigla</label>
          <InputText
            value={form.sigla}
            onChange={(e) => setForm({ ...form, sigla: e.target.value })}
          />
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            label="Salvar"
            icon="pi pi-check"
            onClick={handleSubmit}
          />
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={() => navigate('/unidademedida')}
          />
        </div>
      </div>
    </div>
  );
}
