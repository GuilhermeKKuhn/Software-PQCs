import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SolicitacaoService from "@/service/SolicitacaoService";
import { ISolicitacao, IItemSolicitacao } from "@/commons/Solicitacaointerface";
import { Toast } from "primereact/toast";

export function Homepage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [solicitacao, setSolicitacao] = useState<ISolicitacao | null>(null);

  useEffect(() => {
    SolicitacaoService.buscarPorId(Number(id)).then((res) => {
      setSolicitacao(res.data);
    });
  }, [id]);

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...(solicitacao?.itens || [])];
    updated[index] = { ...updated[index], [field]: value };
    setSolicitacao({ ...solicitacao!, itens: updated });
  };

  const aprovar = () => {
    const itensParaAprovar = solicitacao!.itens.map(item => ({
      id: item.id,
      quantidadeAprovada: item.quantidadeAprovada,
      loteSelecionado: item.loteSelecionado,
      laboratorioOrigemId: item.laboratorioOrigemId
    }));

    SolicitacaoService.aprovarSolicitacao(solicitacao!.id, itensParaAprovar)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Aprovado!",
          detail: "Solicitação aprovada com sucesso.",
        });
        setTimeout(() => navigate("/solicitacoes"), 1500);
      })
      .catch(() => {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao aprovar a solicitação.",
        });
      });
  };

  return (
    <div className="container">
      <Toast ref={toast} />
      <h3>Aprovação de Solicitação</h3>
      {solicitacao ? (
        <>
          <p><strong>Solicitante:</strong> {solicitacao.solicitante}</p>
          <p><strong>Laboratório:</strong> {solicitacao.laboratorio}</p>
          <p><strong>Status:</strong> {solicitacao.status}</p>
          <hr />
          <h5>Itens</h5>
          {solicitacao.itens.map((item, index) => (
            <div key={index} className="mb-3 border p-2 rounded shadow-sm">
              <p><strong>Produto:</strong> {item.nomeProduto}</p>
              <p><strong>Qtd. Solicitada:</strong> {item.quantidadeSolicitada}</p>
              <input
                type="number"
                placeholder="Qtd. Aprovada"
                value={item.quantidadeAprovada || ""}
                onChange={(e) => handleChange(index, "quantidadeAprovada", Number(e.target.value))}
                className="form-control mb-1"
              />
              <input
                type="text"
                placeholder="Lote"
                value={item.loteSelecionado || ""}
                onChange={(e) => handleChange(index, "loteSelecionado", e.target.value)}
                className="form-control"
              />
            </div>
          ))}

          <button className="btn btn-success mt-3" onClick={aprovar}>Aprovar Solicitação</button>
        </>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}
