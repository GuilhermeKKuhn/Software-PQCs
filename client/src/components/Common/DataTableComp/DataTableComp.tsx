import { DataTable, DataTableProps } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './Styles.css';

type ColumnMeta<T> = {
  field: keyof T | string;
  header: string;
  body?: (rowData: T) => React.ReactNode;
  bodyStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
};

type DataTableCompProps<T extends object> = {
  columns: ColumnMeta<T>[];
  data: T[];
} & Omit<DataTableProps<T>, 'value'>;

export function DataTableComp<T extends object>({
  columns,
  data,
  ...props
}: DataTableCompProps<T>) {
  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      rowsPerPageOptions={[5, 10, 20, 50]}
      stripedRows
      responsiveLayout="scroll"
      selectionMode="single"
      {...props}
    >
      {columns.map((col) => (
        <Column
          key={col.field.toString()}
          field={col.field.toString()}
          header={col.header}
          body={col.body}
          bodyStyle={col.bodyStyle}
          headerStyle={col.headerStyle}
        />
      ))}
    </DataTable>
  );
}
