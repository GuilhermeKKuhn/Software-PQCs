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

INSERT INTO tb_fornecedor (razao_social, cnpj, endereco, numero, cidade, estado, telefone, email, data_validade_licenca) VALUES ('Fornecedor de Gás', '12345678901234', 'Rua do Gás', '100', 'Pato Branco', 'PR', '(43) 98888-7777', 'gas@fornecedor.com', '2025-04-30');
INSERT INTO tb_fornecedor (razao_social, cnpj, endereco, numero, cidade, estado, telefone, email, data_validade_licenca) VALUES ('Fornecedor de Ácido', '43210987654321', 'Av. dos Produtos', '200', 'Curitiba', 'PR', '(41) 97777-8888', 'acido@fornecedor.com', '2025-11-30');
INSERT INTO tb_fornecedor (razao_social, cnpj, endereco, numero, cidade, estado, telefone, email, data_validade_licenca) VALUES ('Fornecedor de Reagentes', '11122233344455', 'Travessa da Química', '50', 'Maringá', 'PR', '(44) 95555-1111', 'reagentes@fornecedor.com', '2025-10-15');
INSERT INTO tb_fornecedor (razao_social, cnpj, endereco, numero, cidade, estado, telefone, email, data_validade_licenca) VALUES ('Laboratório Central de Suprimentos', '99988877766655', 'Rua Central', '500', 'Londrina', 'PR', '(43) 91234-5678', 'suprimentos@labcentral.com', '2026-01-31');

INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Ácido Sulfúrico', '7664-93-9', '98%', '1.84', 'CORROSIVO', 'LIQUIDO', 1);
INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Ácido Clorídrico', '7647-01-0', '37%', '1.19', 'CORROSIVO', 'LIQUIDO', 2);
INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Hidróxido de Sódio', '1310-73-2', '100%', '2.13', 'CORROSIVO', 'SOLIDO', 2);
INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Etanol', '64-17-5', '95%', '0.789', 'INFLAMÁVEL', 'LIQUIDO', 1);
INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Metanol', '67-56-1', '99.9%', '0.792', 'INFLAMÁVEL, TÓXICO', 'LIQUIDO', 1);
INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Acetona', '67-64-1', '99.5%', '0.791', 'INFLAMÁVEL', 'LIQUIDO', 1);
INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Cloreto de Sódio', '7647-14-5', '100%', '2.16', 'NEUTRO', 'SOLIDO', 3);
INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Água Destilada', '7732-18-5', '100%', '1.00', 'NEUTRO', 'LIQUIDO', 1);
INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Peróxido de Hidrogênio', '7722-84-1', '30%', '1.11', 'OXIDANTE', 'LIQUIDO', 1);
INSERT INTO tb_produto_quimico (nome, cas, concentracao, densidade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Nitrato de Prata', '7761-88-8', '100%', '4.35', 'OXIDANTE, TÓXICO', 'SOLIDO', 3);

INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (1, 'POLICIA_FEDERAL');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (1, 'EXERCITO');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (2, 'EXERCITO');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (3, 'POLICIA_FEDERAL');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (4, 'EXERCITO');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (5, 'POLICIA_FEDERAL');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (5, 'EXERCITO');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (6, 'POLICIA_FEDERAL');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (7, 'EXERCITO');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (8, 'POLICIA_FEDERAL');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (9, 'EXERCITO');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (10, 'POLICIA_FEDERAL');
INSERT INTO produto_quimico_orgao (produto_id, orgao) VALUES (10, 'EXERCITO');
