import { Button } from "primereact/button";

type ActionButtonsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export function ActionButtons({ onEdit, onDelete }: ActionButtonsProps) {
  return (
    <div className="d-flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text p-button-info"
        tooltip="Editar"
        onClick={onEdit}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-text p-button-danger"
        tooltip="Excluir"
        onClick={onDelete}
      />
    </div>
  );
}
