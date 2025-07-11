package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.ItemNotaDTO;
import br.edu.utfpr.pb.pqcs.server.dto.NotaFiscalDTO;
import br.edu.utfpr.pb.pqcs.server.model.NotaFiscal;
import br.edu.utfpr.pb.pqcs.server.service.ICrudService;
import br.edu.utfpr.pb.pqcs.server.service.INotaFiscalService;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "notafiscal")
public class NotaFiscalController extends CrudController<NotaFiscal, NotaFiscalDTO, Long>{

    private static INotaFiscalService service;
    private static ModelMapper modelMapper;

    public NotaFiscalController(INotaFiscalService service, ModelMapper modelMapper) {
        super(NotaFiscal.class, NotaFiscalDTO.class);
        this.service = service;
        this.modelMapper = modelMapper;
    }
    @GetMapping("/{notaId}/itens")
    public List<ItemNotaDTO> listarItensPorNota(@PathVariable Long notaId) {
        return service.buscarItensPorNota(notaId);
    }

    @Override
    protected ICrudService<NotaFiscal, Long> getService() {
        return NotaFiscalController.service;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return NotaFiscalController.modelMapper;
    }
}
