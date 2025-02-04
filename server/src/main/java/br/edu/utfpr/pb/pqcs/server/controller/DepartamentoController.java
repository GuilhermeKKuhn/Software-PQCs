package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.DepartamentoDTO;
import br.edu.utfpr.pb.pqcs.server.model.Departamento;
import br.edu.utfpr.pb.pqcs.server.service.ICrudService;
import br.edu.utfpr.pb.pqcs.server.service.IdepartamentoService;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "departamento")
public class DepartamentoController extends CrudController<Departamento, DepartamentoDTO, Long>{

    private static IdepartamentoService service;
    private static ModelMapper modelMapper;

    public DepartamentoController(IdepartamentoService service, ModelMapper modelMapper) {
        super(Departamento.class, DepartamentoDTO.class);
        this.service = service;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<Departamento, Long> getService() {
        return DepartamentoController.service;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return DepartamentoController.modelMapper;
    }
}
