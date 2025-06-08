type TableHeaderProps = {
  left?: React.ReactNode;
  right?: React.ReactNode | React.ReactNode[]; 
};

export function TableHeader({ left, right }: TableHeaderProps) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>{left}</div>
      <div className="d-flex gap-2">{right}</div> {/* gap entre botões */}
    </div>
  );
}
