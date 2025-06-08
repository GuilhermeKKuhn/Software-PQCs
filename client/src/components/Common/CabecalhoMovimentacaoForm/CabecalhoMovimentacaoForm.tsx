import { Controller, UseFormWatch, Control } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useEffect } from "react";
import { IMovimentacaoForm } from "@/commons/MovimentacoesInterface";

  interface Props {
    control: Control<IMovimentacaoForm>;
    watch: UseFormWatch<IMovimentacaoForm>;
    fornecedores: { id: number; razaoSocial: string }[];
    laboratorios: { id: number; nomeLaboratorio: string }[];
    disableTipo?: boolean;
    hideNotaFiscal?: boolean;
    hideDestino?: boolean;
  }

  export function CabecalhoMovimentacaoForm({
    control,
    watch,
    fornecedores,
    laboratorios,
    disableTipo = false,
    hideNotaFiscal = false,
    hideDestino = false,
  }: Props) {
    const tipo = watch("tipo");

  useEffect(() => {
    console.log("Tipo de movimentação atual:", tipo, " | Edição habilitada:", !disableTipo);
  }, [tipo, disableTipo]);

  const formatarDateLocal = (data: Date | null) => {
    if (!data) return null;
    const tzOffset = data.getTimezoneOffset() * 60000; // em milissegundos
    const localISOTime = new Date(data.getTime() - tzOffset).toISOString();
    return localISOTime.split("T")[0]; // só a data
  };

  return (
    <div className="container border rounded bg-white p-4">
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Tipo de Movimentação</label>
          <Controller
            name="tipo"
            control={control}
            rules={{ required: "Selecione um tipo" }}
            render={({ field }) => (
              <Dropdown
                {...field}
                disabled={disableTipo}
                options={[
                  { label: "Entrada", value: "ENTRADA" },
                  { label: "Saída", value: "SAIDA" },
                  { label: "Transferência", value: "TRANSFERENCIA" },
                ]}
                placeholder="Selecione"
                className="w-100"
              />
            )}
          />
        </div>

        {tipo === "ENTRADA" && !hideNotaFiscal && (
          <>
            <div className="col-md-4">
              <label className="form-label">Número da Nota Fiscal</label>
              <Controller
                name="notaFiscal.numeroNotaFiscal"
                control={control}
                render={({ field }) => (
                  <InputText
                    {...field}
                    value={field.value?.toString() || ""}
                    className="form-control"
                  />
                )}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Data de Recebimento</label>
              <Controller
                name="notaFiscal.dataRecebimento"
                control={control}
                render={({ field }) => (
                  <Calendar
                    {...field}
                    value={field.value ? new Date(field.value) : null}
                    dateFormat="dd/mm/yy"
                    showIcon
                    onChange={(e) => field.onChange(e.value)}
                    className="w-100"
                  />
                )}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Fornecedor</label>
              <Controller
                name="notaFiscal.fornecedor.id"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={fornecedores.map((f) => ({
                      label: f.razaoSocial,
                      value: f.id,
                    }))}
                    placeholder="Selecione o fornecedor"
                    className="w-100"
                  />
                )}
              />
            </div>
          </>
        )}

        {((tipo === "ENTRADA" || tipo === "TRANSFERENCIA") && !hideDestino) && (
          <div className="col-md-6">
            <label className="form-label">Laboratório de Destino</label>
            <Controller
              name="laboratorioDestino.id"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={laboratorios.map((lab) => ({
                    label: lab.nomeLaboratorio,
                    value: lab.id,
                  }))}
                  placeholder="Selecione"
                  className="w-100"
                />
              )}
            />
          </div>
        )}

        {(tipo === "TRANSFERENCIA" || tipo === "SAIDA") && (
          <div className="col-md-6">
            <label className="form-label">Laboratório de Origem</label>
            <Controller
              name="laboratorioOrigem.id"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={laboratorios.map((lab) => ({
                    label: lab.nomeLaboratorio,
                    value: lab.id,
                  }))}
                  placeholder="Selecione"
                  className="w-100"
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
