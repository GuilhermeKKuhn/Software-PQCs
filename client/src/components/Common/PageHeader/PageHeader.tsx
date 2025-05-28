import { Button } from "primereact/button";

type PageHeaderProps = {
  title: string;
};

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="m-0">{title}</h2>
    </div>
  );
}
