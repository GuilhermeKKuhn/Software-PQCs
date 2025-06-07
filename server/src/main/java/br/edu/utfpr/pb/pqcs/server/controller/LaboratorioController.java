package br.edu.utfpr.pb.pqcs.server.controller;

import br.edu.utfpr.pb.pqcs.server.dto.LaboratorioDTO;
import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;
import br.edu.utfpr.pb.pqcs.server.service.ICrudService;
import br.edu.utfpr.pb.pqcs.server.service.IlaboratorioService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "laboratorio")
public class LaboratorioController extends CrudController<Laboratorio, LaboratorioDTO, Long>{

    private static IlaboratorioService service;
    private static ModelMapper modelMapper;

    public LaboratorioController(IlaboratorioService service, ModelMapper modelMapper) {
        super(Laboratorio.class, LaboratorioDTO.class);
        this.service = service;
        this.modelMapper = modelMapper;
    }

    @Override
    protected ICrudService<Laboratorio, Long> getService() {
        return LaboratorioController.service;
    }

    @Override
    protected ModelMapper getModelMapper() {
        return LaboratorioController.modelMapper;
    }

    @GetMapping("/permitidos")
    public ResponseEntity<List<LaboratorioDTO>> listarPermitidos() {
        List<Laboratorio> permitidos = service.listarPermitidosPorUsuarioLogado();

        List<LaboratorioDTO> dtos = permitidos.stream().map(lab -> {
            LaboratorioDTO dto = new LaboratorioDTO();
            dto.setId(lab.getId());
            dto.setNomeLaboratorio(lab.getNomeLaboratorio());
            dto.setSala(lab.getSala());
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }
}
