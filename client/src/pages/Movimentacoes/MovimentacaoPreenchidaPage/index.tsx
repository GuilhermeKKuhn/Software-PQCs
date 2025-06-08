import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovimentacaoService from "@/service/MovimentacaoService";
import { PageHeader } from "@/components/Common/PageHeader/PageHeader";
import { ILaboratorio } from "@/commons/LaboratorioInterface";
import { IItemMovimentacao } from "@/commons/ItemMovimentacaoInterface";
import LaboratorioService from "@/service/LaboratorioService";

export function MovimentacaoPreenchidaPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tipoMovimentacao, setTipoMovimentacao] = useState("TRANSFERENCIA");
  const [laboratorioDestino, setLaboratorioDestino] = useState<number | null>(null);
  const [laboratorioOrigem, setLaboratorioOrigem] = useState<number | null>(null);
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [itens, setItens] = useState<IItemMovimentacao[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    LaboratorioService.listarLaboratorios().then((res) => {
      setLaboratorios(res.data);
    });

    if (id) {
      MovimentacaoService.gerarMovimentacaoPreenchida(Number(id)).then((res) => {
        setTipoMovimentacao(res.data.tipo);
        setLaboratorioDestino(res.data.laboratorioDestino?.id || null);
        setItens(res.data.itens);
        setCarregando(false);
      });
    }
  }, [id]);

  const atualizarItem = (index: number, campo: "lote" | "quantidade", valor: string) => {
    const novos = [...itens];
    novos[index] = {
      ...novos[index],
      [campo]: campo === "quantidade" ? Number(valor) : valor,
    };
    setItens(novos);
  };

  const removerItem = (index: number) => {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  };

  const handleConfirmar = () => {
    if (!laboratorioDestino || !laboratorioOrigem) return;

    const dto = {
      tipo: tipoMovimentacao,
      laboratorioOrigem: { id: laboratorioOrigem },
      laboratorioDestino: { id: laboratorioDestino },
      itens
    };

    MovimentacaoService.novaMovimentacao(dto).then(() => {
      navigate("/movimentacoes");
    });
  };

  if (carregando) return <div>Carregando dados da solicitação...</div>;

  return (
    <div className="container">
      <PageHeader title="Aprovar Solicitação - Criar Movimentação" />

      <div className="card p-3 mb-4">
        <div className="row mb-3">
          <div className="col-md-6">
            <label>Tipo de Movimentação</label>
            <select className="form-control" value={tipoMovimentacao} disabled>
              <option value="TRANSFERENCIA">Transferência</option>
            </select>
          </div>

          <div className="col-md-6">
            <label>Laboratório de Destino</label>
            <select className="form-control" value={laboratorioDestino || ""} disabled>
              {laboratorios.map((lab) => (
                <option key={lab.id} value={lab.id}>{lab.nomeLaboratorio}</option>
              ))}
            </select>
          </div>

          <div className="col-md-12 mt-3">
            <label>Laboratório de Origem</label>
            <select className="form-control" value={laboratorioOrigem || ""} onChange={(e) => setLaboratorioOrigem(Number(e.target.value))}>
              <option value="">Selecione...</option>
              {laboratorios.map((lab) => (
                <option key={lab.id} value={lab.id}>{lab.nomeLaboratorio}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <h5>Itens da Movimentação</h5>
      {itens.map((item, index) => (
        <div key={index} className="card p-3 mb-3 shadow-sm">
          <div><strong>{item.nomeProduto}</strong></div>
          <div className="row mt-2">
            <div className="col-md-6">
              <label>Quantidade</label>
              <input
                type="number"
                className="form-control"
                value={item.quantidadeAprovada}
                onChange={(e) => atualizarItem(index, "quantidade", e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label>Lote</label>
              <input
                type="text"
                className="form-control"
                value={item.lote || ""}
                onChange={(e) => atualizarItem(index, "lote", e.target.value)}
              />
            </div>
          </div>
          <div className="text-end mt-2">
            <button className="btn btn-sm btn-danger" onClick={() => removerItem(index)}>Remover</button>
          </div>
        </div>
      ))}

      <div className="text-end">
        <button className="btn btn-success" onClick={handleConfirmar}>
          ✔ Confirmar Movimentação
        </button>
      </div>
    </div>
  );
}
