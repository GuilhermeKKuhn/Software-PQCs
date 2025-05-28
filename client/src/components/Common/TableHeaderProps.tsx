type TableHeaderProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function TableHeader({ left, right }: TableHeaderProps) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  );
}
