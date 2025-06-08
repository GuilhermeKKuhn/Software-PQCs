import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useState } from "react";
import { api } from "@/lib/axios";
import { saveAs } from "file-saver";

type ExportarXlsxProps = {
  titulo?: string;
  endpoint: string;
  nomeArquivo?: string;
  semData?: boolean; // << ADICIONADO: permite não exigir datas
};

export function ExportarXlsx({
  titulo = "Exportar dados",
  endpoint,
  nomeArquivo = "relatorio",
  semData = false,
}: ExportarXlsxProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [inicio, setInicio] = useState<Date | null>(null);
  const [fim, setFim] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const baixar = async () => {
    if (!semData && (!inicio || !fim)) {
      alert("Preencha o período corretamente.");
      return;
    }

    setLoading(true);

    try {
      let url = endpoint;
      if (!semData) {
        const params = new URLSearchParams({
          inicio: inicio!.toISOString().split("T")[0],
          fim: fim!.toISOString().split("T")[0],
        });
        url += `?${params.toString()}`;
      }

      const res = await api.get(url, {
        responseType: "blob",
      });

      saveAs(res.data, `${nomeArquivo}.xlsx`);
      setShowDialog(false);
    } catch (error: any) {
      alert("Erro ao gerar relatório.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        icon="pi pi-download"
        label="Exportar XLSX"
        onClick={() => (semData ? baixar() : setShowDialog(true))}
        className="p-button-sm"
        loading={loading}
      />

      {!semData && (
        <Dialog
          header={titulo}
          visible={showDialog}
          onHide={() => setShowDialog(false)}
          modal
          style={{ width: "400px" }}
        >
          <div className="d-flex flex-column gap-3">
            <div>
              <label className="form-label">Data Início</label>
              <Calendar
                value={inicio}
                onChange={(e) => setInicio(e.value as Date)}
                dateFormat="dd/mm/yy"
                showIcon
                className="w-100"
              />
            </div>

            <div>
              <label className="form-label">Data Fim</label>
              <Calendar
                value={fim}
                onChange={(e) => setFim(e.value as Date)}
                dateFormat="dd/mm/yy"
                showIcon
                className="w-100"
              />
            </div>

            <Button
              label="Gerar Excel"
              icon="pi pi-check"
              loading={loading}
              onClick={baixar}
              className="mt-3"
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
