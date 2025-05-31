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

export function UsuarioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const toast = useRef<Toast>(null); // 👈 Toast ref aqui

  const [form, setForm] = useState<IUser>({
    username: '',
    name: '',
    password: '',
    email: '',
    ativo: false,
    tipoPerfil: '',
    siape: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isEdit) {
      UserService.buscarUserPorId(Number(id)).then((res) => {
        const userData = { ...res.data, password: '' };
        setForm(userData);
      });
    }
  }, [id]);

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    const requiredFields = ['name', 'email', 'siape', 'tipoPerfil'];

    requiredFields.forEach((field) => {
      if (!form[field as keyof IUser]) {
        newErrors[field] = true;
      }
    });

    const senha = form.password;

    // Só valida a senha se for cadastro ou se o campo foi preenchido
    if (!isEdit && !senha) {
      newErrors['password'] = true;
    }

    if (senha) {
      const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!senhaForte.test(senha)) {
        newErrors['password'] = true;
      }
      if (senha !== confirmPassword) {
        newErrors['passwordMismatch'] = true;
      }
    }

    // Só exige confirmar senha se também estiver digitando senha
    if (senha && !confirmPassword) {
      newErrors['confirmPassword'] = true;
    }

    setErrors(newErrors);
    return newErrors;
  };


  const handleSubmit = () => {
    const validationErrors = validateForm();
    const isValid = Object.keys(validationErrors).length === 0;

    if (!isValid) {
      if (validationErrors.passwordMismatch) {
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'As senhas não coincidem.',
          life: 3000,
        });
      } else if (validationErrors.password) {
        toast.current?.show({
          severity: 'error',
          summary: 'Senha inválida',
          detail: 'A senha deve ter ao menos 6 caracteres, uma letra maiúscula, uma minúscula e um número.',
          life: 5000,
        });
      } else {
        toast.current?.show({
          severity: 'warn',
          summary: 'Campos obrigatórios',
          detail: 'Preencha todos os campos obrigatórios.',
          life: 3000,
        });
      }
      return;
    }

    const payload: Partial<IUser> = {
      ...form,
      username: form.email,
    };

    if (isEdit && (!form.password || form.password.trim() === '')) {
      delete payload.password;
    }

    const service = isEdit
      ? () => UserService.editarUser(Number(id), payload as IUser)
      : () => UserService.cadastrarUser(payload as IUser);

    service()
      .then(() => {
        toast.current?.show({
          severity: 'success',
          summary: 'Sucesso',
          detail: isEdit ? 'Usuário atualizado com sucesso' : 'Usuário cadastrado com sucesso',
          life: 2000,
        });

        setTimeout(() => {
          navigate('/usuarios');
        }, 1000);
      })
      .catch((err) => {
        const validationErrors = err.response?.data?.validationErrors;

        if (validationErrors?.username) {
          toast.current?.show({
            severity: 'error',
            summary: 'Email já cadastrado',
            detail: 'Este email já está sendo utilizado por outro usuário.',
            life: 4000,
          });

          setErrors((prev) => ({ ...prev, email: true }));
          return;
        }

        const backendMsg = validationErrors?.password || 'Erro ao salvar usuário.';
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
        <h2>{isEdit ? 'Editar Usuário' : 'Cadastrar novo usuário'}</h2>

        <div className="p-fluid">
          <div className="field">
            <label>Nome</label>
            <InputText
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={classNames({ 'p-invalid': errors.name })}
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

          <div className="formgrid grid">
            <div className="field col">
              <label>SIAPE</label>
              <InputText
                value={form.siape}
                onChange={(e) => setForm({ ...form, siape: e.target.value })}
                className={classNames({ 'p-invalid': errors.siape })}
              />
            </div>

            <div className="field col">
              <label>Tipo de Perfil</label>
              <Dropdown
                value={form.tipoPerfil}
                onChange={(e) => setForm({ ...form, tipoPerfil: e.value })}
                options={[
                  { label: 'Administrador', value: 'ADMINISTRADOR' },
                  { label: 'Responsável Departamento', value: 'RESPONSAVEL_DEPARTAMENTO' },
                  { label: 'Responsável Laboratório', value: 'RESPONSAVEL_LABORATORIO' },
                ]}
                placeholder="Selecione um perfil"
                className={classNames({ 'p-invalid': errors.tipoPerfil })}
              />
            </div>
          </div>

          <div className="formgrid grid">
            <div className="field col">
              <label>Senha</label>
              <Password
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                feedback={false}
                toggleMask
                className={classNames({ 'p-invalid': errors.password || errors.passwordMismatch })}
              />
            </div>

            <div className="field col">
              <label>Confirmar Senha</label>
              <Password
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                feedback={false}
                toggleMask
                className={classNames({ 'p-invalid': errors.confirmPassword || errors.passwordMismatch })}
              />
            </div>
          </div>

          <div className="field">
            <label>Situação</label>
            <Dropdown
              value={form.ativo ? 'ativo' : 'inativo'}
              onChange={(e) => setForm({ ...form, ativo: e.value === 'ativo' })}
              options={[
                { label: 'Ativo', value: 'ativo' },
                { label: 'Inativo', value: 'inativo' },
              ]}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <Button label="Salvar" icon="pi pi-check" onClick={handleSubmit} />
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-secondary"
              onClick={() => navigate('/usuarios')}
            />
          </div>
        </div>
      </div>
    </>
  );
}
