package br.edu.utfpr.pb.pqcs.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tb_fornecedor")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Fornecedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String razaoSocial;

    @NotNull
    private String cnpj;

    @NotNull
    private String endereco;

    @NotNull
    private String numero;

    @NotNull
    private String cidade;

    @NotNull String estado;

    @NotNull
    private String telefone;

    @NotNull
    private String email;

    @NotNull
    @Column(name = "data_validade_licenca")
    private LocalDate dataValidadeLicenca;

}
