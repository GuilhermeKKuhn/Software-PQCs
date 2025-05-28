import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

type ConfirmDialogDeleteProps = {
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
  message?: string;
};

export function DeleteConfirm({
  visible,
  onHide,
  onConfirm,
  message = 'Deseja realmente excluir este item?',
}: ConfirmDialogDeleteProps) {
  const footer = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={onHide}
      />
      <Button
        label="Excluir"
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={onConfirm}
      />
    </div>
  );

  return (
    <Dialog
      header="Confirmação"
      visible={visible}
      style={{ width: '350px' }}
      onHide={onHide}
      footer={footer}
      modal
    >
      <p>{message}</p>
    </Dialog>
  );
}
