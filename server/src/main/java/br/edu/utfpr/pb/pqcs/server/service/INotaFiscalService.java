package br.edu.utfpr.pb.pqcs.server.service;

import br.edu.utfpr.pb.pqcs.server.dto.ItemNotaDTO;
import br.edu.utfpr.pb.pqcs.server.model.NotaFiscal;

import java.util.List;

public interface INotaFiscalService extends ICrudService<NotaFiscal, Long>{
    List<ItemNotaDTO> buscarItensPorNota(Long notaId);
}
