INSERT INTO tb_user (username, name, password, email, ativo, tipo_perfil, siape) VALUES ('admin@teste.com', 'Administrador', '$2a$12$Pw0RrSNoRtZ/somMyoQEYeZqVu27jNoKzseHU0zLllOQTJ2WBTKvC', 'admin@teste.com', true, 'ADMINISTRADOR', '0000001');
INSERT INTO tb_user (username, name, password, email, ativo, tipo_perfil, siape) VALUES ('chefe@quimica.com', 'Chefe Química', '$2a$12$Pw0RrSNoRtZ/somMyoQEYeZqVu27jNoKzseHU0zLllOQTJ2WBTKvC', 'chefe@quimica.com', true, 'RESPONSAVEL_DEPARTAMENTO', '0000002');
INSERT INTO tb_user (username, name, password, email, ativo, tipo_perfil, siape) VALUES ('resp.lab1@teste.com', 'Responsável Lab Química', '$2a$12$Pw0RrSNoRtZ/somMyoQEYeZqVu27jNoKzseHU0zLllOQTJ2WBTKvC', 'resp.lab1@teste.com', true, 'RESPONSAVEL_LABORATORIO', '0000003');
INSERT INTO tb_user (username, name, password, email, ativo, tipo_perfil, siape) VALUES ('resp.lab2@teste.com', 'Responsável Lab Física', '$2a$12$Pw0RrSNoRtZ/somMyoQEYeZqVu27jNoKzseHU0zLllOQTJ2WBTKvC', 'resp.lab2@teste.com', true, 'RESPONSAVEL_LABORATORIO', '0000004');

INSERT INTO tb_unidade_medida (nome, sigla) VALUES ('Litro', 'L');
INSERT INTO tb_unidade_medida (nome, sigla) VALUES ('Mililitro', 'ml');
INSERT INTO tb_unidade_medida (nome, sigla) VALUES ('Grama', 'g');

INSERT INTO tb_departamento (nome_departamento, sigla, responsavel_id) VALUES ('Departamento de Química', 'DQ', 2);
INSERT INTO tb_departamento (nome_departamento, sigla, responsavel_id) VALUES ('Departamento de Física', 'DF', 1);

INSERT INTO tb_laboratorio (nome_laboratorio, sala, departamento_id, responsavel_id) VALUES ('Lab Química', 'A1', 1, 3);
INSERT INTO tb_laboratorio (nome_laboratorio, sala, departamento_id, responsavel_id) VALUES ('Lab Física', 'B1', 2, 4);

INSERT INTO tb_fornecedor (razao_Social, cnpj, endereco, numero, cidade, estado, telefone, email, data_validade_licenca) VALUES ('Fornecedor de Gás', '12345678901234', 'Rua do Gás', '100', 'Pato Branco', 'PR', '(43) 98888-7777', 'gas@fornecedor.com', '2025-04-30');
INSERT INTO tb_fornecedor (razao_Social, cnpj, endereco, numero, cidade, estado, telefone, email, data_validade_licenca) VALUES ('Fornecedor de Ácido', '43210987654321', 'Av. dos Produtos', '200', 'Curitiba', 'PR', '(41) 97777-8888', 'acido@fornecedor.com', '2025-11-30');
INSERT INTO tb_fornecedor (razao_Social, cnpj, endereco, numero, cidade, estado, telefone, email, data_validade_licenca) VALUES ('Fornecedor de Reagentes', '11122233344455', 'Travessa da Química', '50', 'Maringá', 'PR', '(44) 95555-1111', 'reagentes@fornecedor.com', '2025-10-15');

INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Ácido Sulfúrico', '7664-93-9', '98%', '1.84', 'CORROSIVO', 'LIQUIDO', 1);
INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Ácido Clorídrico', '7647-01-0', '37%', '1.19', 'CORROSIVO', 'LIQUIDO', 2);

INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (1, 'POLICIA_FEDERAL');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (1, 'EXERCITO');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (2, 'EXERCITO');