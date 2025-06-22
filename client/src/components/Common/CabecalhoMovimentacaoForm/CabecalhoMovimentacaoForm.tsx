import { Controller, UseFormWatch, Control, UseFormSetValue } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";

import { IMovimentacaoForm } from "@/commons/MovimentacoesInterface";
import { IFornecedor } from "@/commons/FornecedorInterface";
import { DialogSelecionarFornecedor } from "../SelecionarFornecedor/DialogSelecionarFornecedor";


interface Props {
  control: Control<IMovimentacaoForm>;
  watch: UseFormWatch<IMovimentacaoForm>;
  fornecedores: IFornecedor[];
  laboratorios: { id: number; nomeLaboratorio: string }[];
  disableTipo?: boolean;
  hideNotaFiscal?: boolean;
  hideDestino?: boolean;
  setValue: UseFormSetValue<IMovimentacaoForm>;
}

export function CabecalhoMovimentacaoForm({
  control,
  watch,
  fornecedores,
  laboratorios,
  disableTipo = false,
  hideNotaFiscal = false,
  hideDestino = false,
  setValue,
}: Props) {
  const tipo = watch("tipo");
  const fornecedorId = watch("notaFiscal.fornecedor.id");
  const fornecedorSelecionado = fornecedores.find((f) => f.id === fornecedorId) ?? null;

  const [dialogFornecedorAberto, setDialogFornecedorAberto] = useState(false);

  useEffect(() => {
    console.log("Tipo de movimentação:", tipo);
  }, [tipo]);

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
              <div className="input-group">
                <InputText
                  value={fornecedorSelecionado?.razaoSocial || ""}
                  placeholder="Nenhum fornecedor selecionado"
                  disabled
                  className="form-control"
                />
                <Button
                  icon="pi pi-search"
                  className="p-button-secondary"
                  onClick={() => setDialogFornecedorAberto(true)}
                  tooltip="Selecionar Fornecedor"
                />
                {fornecedorSelecionado && (
                  <Button
                    icon="pi pi-times"
                    className="p-button-danger p-button-outlined"
                    onClick={() => setValue("notaFiscal.fornecedor.id", undefined)}
                    tooltip="Limpar Seleção"
                  />
                )}
              </div>
            </div>
            <DialogSelecionarFornecedor
              visible={dialogFornecedorAberto}
              onHide={() => setDialogFornecedorAberto(false)}
              fornecedores={fornecedores}
              onSelect={(fornecedor) => {
                setValue('notaFiscal.fornecedor.id', fornecedor.id);
                setDialogFornecedorAberto(false);
              }}
            />
          </>
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
      </div>
    </div>
  );
}
