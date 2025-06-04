import { Dialog } from 'primereact/dialog';
import { FaTimesCircle } from 'react-icons/fa';

interface Campo {
  label: string;
  field: string;
  suffix?: string;
  body?: (data: any) => React.ReactNode;
}

interface DetalhesDialogProps {
  data: any;
  visible: boolean;
  onHide: () => void;
  campos: Campo[];
  titulo?: string;
}

export const DetalhesDialog = ({ data, visible, onHide, campos, titulo = "Detalhes" }: DetalhesDialogProps) => {
  const getValue = (obj: any, path: string): any =>
    path.split('.').reduce((acc, part) => acc?.[part], obj);

  const dialogFooter = (
    <div className="text-end">
      <button onClick={onHide} className="btn btn-secondary">
        <FaTimesCircle className="me-2" /> Fechar
      </button>
    </div>
  );

  return (
    <Dialog
      header={titulo}
      visible={visible}
      style={{ width: '600px', maxWidth: '90%' }}
      modal
      onHide={onHide}
      footer={dialogFooter}
    >
      <div className="container-fluid">
        <div className="row gy-3">
          {campos.map((campo, idx) => (
            <div key={idx} className="col-12 border-bottom pb-2">
              <small className="text-muted">{campo.label}</small>
              <div className="fw-bold">
                {campo.body ? campo.body(data) : getValue(data, campo.field)} {campo.suffix ?? ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
};
