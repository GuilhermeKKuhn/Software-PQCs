package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.UnidadeMedidaDTO;
import br.edu.utfpr.pb.pqcs.server.model.UnidadeMedida;
import br.edu.utfpr.pb.pqcs.server.service.ICrudService;
import br.edu.utfpr.pb.pqcs.server.service.IUnidadeMedidaService;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "unidademedida")
public class UnidadeMedidaController extends CrudController<UnidadeMedida, UnidadeMedidaDTO, Long>{

    private static IUnidadeMedidaService service;
    private static ModelMapper modelMapper;

    public UnidadeMedidaController(IUnidadeMedidaService service, ModelMapper modelMapper) {
        super(UnidadeMedida.class, UnidadeMedidaDTO.class);
        this.service = service;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<UnidadeMedida, Long> getService() {
        return UnidadeMedidaController.service;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return UnidadeMedidaController.modelMapper;
    }
}
