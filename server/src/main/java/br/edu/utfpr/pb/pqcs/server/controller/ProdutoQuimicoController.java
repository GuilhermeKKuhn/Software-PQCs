package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.ProdutoQuimicoDTO;
import br.edu.utfpr.pb.pqcs.server.model.ProdutoQuimico;
import br.edu.utfpr.pb.pqcs.server.service.ICrudService;
import br.edu.utfpr.pb.pqcs.server.service.IProdutoQuimicoService;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "produtoquimico")
public class ProdutoQuimicoController extends CrudController<ProdutoQuimico, ProdutoQuimicoDTO, Long>{

    private static IProdutoQuimicoService iprodutoQuimicoService;
    private static ModelMapper modelMapper;


    public ProdutoQuimicoController(IProdutoQuimicoService iprodutoQuimicoService, ModelMapper modelMapper) {
        super(ProdutoQuimico.class, ProdutoQuimicoDTO.class);
        this.iprodutoQuimicoService = iprodutoQuimicoService;
        this.modelMapper = modelMapper;
    }


    @Override
    protected ICrudService<ProdutoQuimico, Long> getService() {
        return ProdutoQuimicoController.iprodutoQuimicoService;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return ProdutoQuimicoController.modelMapper;
    }
}
