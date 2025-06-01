import { Dialog } from 'primereact/dialog';

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

  return (
    <Dialog
      header={titulo}
      visible={visible}
      style={{ width: '500px' }}
      modal
      onHide={onHide}
    >
      <div className="p-fluid">
        {campos.map((campo, idx) => (
          <p key={idx}>
            <strong>{campo.label}:</strong>{" "}
             {campo.body ? campo.body(data) : getValue(data, campo.field)} {campo.suffix ?? ""}
          </p>
        ))}
      </div>
    </Dialog>
  );
};
