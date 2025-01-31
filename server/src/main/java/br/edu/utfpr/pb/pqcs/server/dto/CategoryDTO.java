package br.edu.utfpr.pb.pqcs.server.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
public class CategoryDTO {

    private Long id;

    @NotNull
    @Size(min = 2, max = 50)
    private String name;
}
