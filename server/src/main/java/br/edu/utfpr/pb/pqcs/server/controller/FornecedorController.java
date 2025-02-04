package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.FornecedorDTO;
import br.edu.utfpr.pb.pqcs.server.model.Fornecedor;
import br.edu.utfpr.pb.pqcs.server.service.ICrudService;
import br.edu.utfpr.pb.pqcs.server.service.IFornecedorService;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "fornecedor")
public class FornecedorController extends CrudController<Fornecedor, FornecedorDTO, Long>{

    private static IFornecedorService service;
    private static ModelMapper modelMapper;

    public FornecedorController(IFornecedorService service, ModelMapper modelMapper) {
        super(Fornecedor.class, FornecedorDTO.class);
        this.service = service;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<Fornecedor, Long> getService() {
        return FornecedorController.service;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return FornecedorController.modelMapper;
    }
}
