package br.edu.utfpr.pb.pqcs.server.service.impl;

import br.edu.utfpr.pb.pqcs.server.model.Departamento;
import br.edu.utfpr.pb.pqcs.server.model.Laboratorio;
import br.edu.utfpr.pb.pqcs.server.model.TipoPerfil;
import br.edu.utfpr.pb.pqcs.server.model.User;
import br.edu.utfpr.pb.pqcs.server.repository.DepartamentoRepository;
import br.edu.utfpr.pb.pqcs.server.repository.LaboratorioRepository;
import br.edu.utfpr.pb.pqcs.server.service.AuthService;
import br.edu.utfpr.pb.pqcs.server.service.IlaboratorioService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaboratorioServiceImpl extends CrudServiceImpl<Laboratorio, Long>
        implements IlaboratorioService {

    private final LaboratorioRepository laboratorioRepository;
    private final AuthService authService;
    private final DepartamentoRepository departamentoRepository;


    public LaboratorioServiceImpl(
            LaboratorioRepository laboratorioRepository,
            AuthService authService,
            DepartamentoRepository departamentoRepository
    ) {
        this.laboratorioRepository = laboratorioRepository;
        this.authService = authService;
        this.departamentoRepository = departamentoRepository;
    }

    public List<Laboratorio> listarPermitidosPorUsuarioLogado() {
        User user = authService.getUsuarioLogado();

        if (user.getTipoPerfil().equals(TipoPerfil.ADMINISTRADOR)) {
            return laboratorioRepository.findAll();
        }

        if (user.getTipoPerfil().equals(TipoPerfil.RESPONSAVEL_LABORATORIO)) {
            return laboratorioRepository.findAllByResponsavelId(user.getId());
        }

        if (user.getTipoPerfil().equals(TipoPerfil.RESPONSAVEL_DEPARTAMENTO)) {
            List<Long> depIds = departamentoRepository.findAllByResponsavelId(user.getId())
                    .stream()
                    .map(Departamento::getId)
                    .toList();

            return laboratorioRepository.findAll().stream()
                    .filter(lab -> lab.getDepartamento() != null && depIds.contains(lab.getDepartamento().getId()))
                    .toList();
        }

        return List.of();
    }

    @Override
    protected JpaRepository<Laboratorio, Long> getRepository() {
        return laboratorioRepository;
    }
}
