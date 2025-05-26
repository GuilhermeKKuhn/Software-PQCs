-- Usuário (ADMIN)
INSERT INTO tb_user (username, name, password, email, ativo, tipo_perfil, siape) VALUES ('admin@teste.com', 'Administrador', '$2a$12$Pw0RrSNoRtZ/somMyoQEYeZqVu27jNoKzseHU0zLllOQTJ2WBTKvC', 'admin@teste.com', true, 'ADMINISTRADOR', '0000001');

-- Unidade de Medida
INSERT INTO tb_unidade_medida (nome, sigla) VALUES ('Litro', 'L');
INSERT INTO tb_unidade_medida (nome, sigla) VALUES ('Mililitro', 'ml');
INSERT INTO tb_unidade_medida (nome, sigla) VALUES ('Grama', 'g');

-- Departamento
INSERT INTO tb_departamento (nome_departamento, responsavel_id) VALUES ('Departamento de Química', 1);
INSERT INTO tb_departamento (nome_departamento, responsavel_id) VALUES ('Departamento de Física', 1);

-- Laboratório
INSERT INTO tb_laboratorio (nome_laboratorio, sala, departamento_id, responsavel_id) VALUES ('Lab Química', 'A1', 1, 1);
INSERT INTO tb_laboratorio (nome_laboratorio, sala, departamento_id, responsavel_id) VALUES ('Lab Física', 'B1', 2, 1);

-- Fornecedor
INSERT INTO tb_fornecedor (nome, cnpj, endereco, numero, cidade, estado, telefone, email) VALUES ('Fornecedor de Gás', '12345678901234', 'Rua do Gás', '100', 'Pato Branco', 'PR', '(43) 98888-7777', 'gas@fornecedor.com');
INSERT INTO tb_fornecedor (nome, cnpj, endereco, numero, cidade, estado, telefone, email) VALUES ('Fornecedor de Ácido', '43210987654321', 'Av. dos Produtos', '200', 'Curitiba', 'PR', '(41) 97777-8888', 'acido@fornecedor.com');
INSERT INTO tb_fornecedor (nome, cnpj, endereco, numero, cidade, estado, telefone, email) VALUES ('Fornecedor de Reagentes', '11122233344455', 'Travessa da Química', '50', 'Maringá', 'PR', '(44) 95555-1111', 'reagentes@fornecedor.com');

-- Produto Químico
INSERT INTO tb_produto_quimico (nome, cas, validade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Ácido Sulfúrico', '7664-93-9', 24, 'Corrosivo', 'Líquido', 1);
INSERT INTO tb_produto_quimico (nome, cas, validade, caracteristica, estado_fisico, unidademedida_id) VALUES ('Ácido Clorídrico', '7647-01-0', 12, 'Corrosivo', 'Líquido', 2);
