import { InputText } from "primereact/inputtext";
import "./styles.css"

type SearchBarProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChange, placeholder = "Buscar..." }: SearchBarProps) {
  return (
      <span className="p-input-icon-left">
        <InputText
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </span>
  );
}
