import { Button } from "primereact/button";

type ActionButtonCreateProps = {
  label?: string;
  onClick: () => void;
};

export function ActionButtonCreate({
  label = "Novo",
  onClick,
}: ActionButtonCreateProps) {
  return (
    <Button
      label={label}
      icon="pi pi-plus"
      className="p-button-success p-button-rounded"
      onClick={onClick}
    />
  );
}
