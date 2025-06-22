import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import ExportarXlsxService from "@/service/ExportarXlsxService";


export function RelatorioPage() {
  const navigate = useNavigate();

  const [visible, setVisible] = useState(true);
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);
  const [tipos, setTipos] = useState<string[]>([]);

  const tiposMovimentacao = [
    { label: "Entrada", value: "ENTRADA" },
    { label: "Saída", value: "SAIDA" },
    { label: "Transferência", value: "TRANSFERENCIA" },
  ];

  const fechar = () => {
    setVisible(false);
    navigate("/");
  };

  const gerarRelatorio = async () => {
    if (!dataInicio || !dataFim || tipos.length === 0) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      await ExportarXlsxService.exportarMovimentacoesPersonalizado(
        dataInicio,
        dataFim,
        tipos
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar relatório.");
    }
  };

  return (
    <Dialog
      header="Relatório de Movimentações"
      visible={visible}
      style={{ width: "40vw" }}
      modal
      closable
      onHide={fechar}
    >
      <div className="container">
        <div className="mb-3">
          <label className="form-label">Data Início</label>
          <Calendar
            value={dataInicio}
            onChange={(e) => setDataInicio(e.value!)}
            dateFormat="dd/mm/yy"
            className="w-100"
            placeholder="Selecione a data de início"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Data Fim</label>
          <Calendar
            value={dataFim}
            onChange={(e) => setDataFim(e.value!)}
            dateFormat="dd/mm/yy"
            className="w-100"
            placeholder="Selecione a data de fim"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo de Movimentação</label>
          <MultiSelect
            value={tipos}
            onChange={(e) => setTipos(e.value)}
            options={tiposMovimentacao}
            placeholder="Selecione"
            className="w-100"
            display="chip"
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <Button
            label="Fechar"
            icon="pi pi-times"
            className="p-button-secondary"
            onClick={fechar}
          />
          <Button
            label="Gerar Relatório"
            icon="pi pi-download"
            className="p-button-success"
            onClick={gerarRelatorio}
          />
        </div>
      </div>
    </Dialog>
  );
}
