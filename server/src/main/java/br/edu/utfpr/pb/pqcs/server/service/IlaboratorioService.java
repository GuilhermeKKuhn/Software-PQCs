package br.edu.utfpr.pb.pqcs.server.service;

import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;

import java.util.List;

public interface IlaboratorioService extends ICrudService<Laboratorio, Long>{

    public List<Laboratorio> listarPermitidosPorUsuarioLogado();

}
