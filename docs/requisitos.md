# UniEats — Requisitos e Regras de Negócio

---

## ⚙️ Requisitos Funcionais

### Autenticação e Usuários

| ID   | Descrição                                                                                       |
| ---- | ----------------------------------------------------------------------------------------------- |
| RF01 | O sistema deve permitir o cadastro e autenticação de vendedores.                                |
| RF02 | O sistema deve permitir autenticação de administradores.                                        |
| RF03 | O sistema deve suportar diferentes tipos de usuários administrativos: vendedor e administrador. |

> **Observação:** O aluno não possuirá cadastro ou conta na plataforma. O marketplace será acessível publicamente.

---

### Vendedor — Credenciamento

| ID   | Descrição                                                                                                            |
| ---- | -------------------------------------------------------------------------------------------------------------------- |
| RF04 | O vendedor deve poder solicitar seu credenciamento junto à instituição.                                              |
| RF05 | O vendedor deve poder enviar documentos para análise.                                                                |
| RF06 | O vendedor deve poder acompanhar o status de seu credenciamento.                                                     |
| RF07 | O vendedor deve poder informar sua localização dentro do campus, utilizando pontos de venda previamente autorizados. |

---

### Vendedor — Gestão do Negócio

| ID   | Descrição                                                               |
| ---- | ----------------------------------------------------------------------- |
| RF08 | O vendedor deve poder cadastrar produtos.                               |
| RF09 | O vendedor deve poder editar seus produtos.                             |
| RF10 | O vendedor deve poder excluir seus produtos.                            |
| RF11 | O vendedor deve poder informar a disponibilidade de atendimento.        |

---

### Aluno — Marketplace e Reservas

| ID   | Descrição                                                                                                   |
| ---- | ----------------------------------------------------------------------------------------------------------- |
| RF12 | O aluno deve poder acessar o marketplace sem necessidade de cadastro ou autenticação.                       |
| RF13 | O aluno deve poder visualizar vendedores regularizados.                                                     |
| RF14 | O aluno deve poder visualizar os produtos disponíveis de cada vendedor.                                     |
| RF15 | O aluno deve poder consultar a localização do vendedor dentro do campus.                                    |
| RF16 | O aluno deve poder entrar em contato com o vendedor via WhatsApp.                                           |
| RF17 | O aluno deve poder visualizar informações de identificação e regularização do vendedor por meio do QR Code. |

---

### Administrador — Gestão e Controle

| ID   | Descrição                                                                               |
| ---- | --------------------------------------------------------------------------------------- |
| RF18 | O administrador deve poder analisar documentos enviados pelos vendedores.               |
| RF19 | O administrador deve poder aprovar ou reprovar vendedores.                              |
| RF20 | O administrador deve poder suspender vendedores.                                        |
| RF21 | O administrador deve poder cadastrar e gerenciar os pontos de venda autorizados.        |
| RF22 | O administrador deve poder acompanhar a validade dos documentos dos vendedores.         |
| RF23 | O administrador deve poder visualizar vendedores com documentos próximos do vencimento. |

---

### Sistema

| ID   | Descrição                                                                                              |
| ---- | ------------------------------------------------------------------------------------------------------ |
| RF24 | O sistema deve gerar um QR Code de identificação para cada vendedor regularizado.                      |
| RF25 | O sistema deve atualizar automaticamente o status do vendedor conforme a validade de sua documentação. |
| RF26 | O sistema deve remover vendedores não regularizados do marketplace.                                    |

---

## 🔒 Requisitos Não Funcionais

| ID    | Categoria        | Descrição                                                                                                           |
| ----- | ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| RNF01 | Usabilidade      | O sistema deve apresentar uma interface simples e intuitiva.                                                        |
| RNF02 | Portabilidade    | O sistema deve possuir interface responsiva, funcionando em computadores e dispositivos móveis.                     |
| RNF03 | Segurança        | O sistema deve possuir autenticação segura para vendedores e administradores.                                       |
| RNF04 | Segurança        | O sistema deve proteger os dados pessoais dos vendedores e administradores.                                         |
| RNF05 | Segurança        | O sistema deve armazenar senhas de maneira segura, utilizando técnicas adequadas de hash e proteção de credenciais. |
| RNF06 | Segurança        | O sistema deve possuir controle de acesso baseado no tipo de usuário.                                               |
| RNF07 | Desempenho       | O sistema deve apresentar tempo de resposta adequado para acesso ao marketplace e suas funcionalidades.             |
| RNF08 | Manutenibilidade | O sistema deve seguir boas práticas de desenvolvimento web.                                                         |
| RNF09 | Acessibilidade   | O marketplace deve ser acessível sem necessidade de autenticação ou cadastro.                                       |

---

# 📋 Regras de Negócio

### RN01 — Visibilidade no Marketplace

O vendedor somente poderá ter seu perfil, localização e produtos exibidos no marketplace após obter o status **Regular**, concedido pela administração da instituição.

---

### RN02 — Bloqueio por Suspensão

Um vendedor com status **Suspenso** deve ter seu perfil imediatamente removido do marketplace.

---

### RN03 — Bloqueio por Reprovação

Um vendedor com status **Reprovado** não poderá aparecer no marketplace sem iniciar um novo processo de credenciamento.

---

### RN04 — Documentação Obrigatória

O administrador não poderá aprovar um vendedor que possua documentos obrigatórios ausentes, inválidos ou vencidos.

---

### RN05 — Validade de Documentos

Quando um documento de um vendedor **Regular** vencer, seu status deve ser automaticamente alterado para **Pendente**, removendo-o do marketplace até que a documentação seja regularizada.

---

### RN06 — Alerta de Vencimento

O sistema deve emitir alertas para a administração quando documentos de vendedores estiverem próximos do vencimento, com antecedência mínima de **30 dias**.

---

### RN07 — Pedido Exclusivo a Vendedores Regulares

O aluno somente poderá realizar reservas com vendedores que estejam com status **Regular** e disponibilidade marcada como **Aberto** no momento da reserva.

---

### RN08 — Localização Restrita a Pontos Autorizados

O vendedor somente poderá informar como sua localização pontos de venda previamente cadastrados e autorizados pela administração da instituição.

---

### RN09 — QR Code Exclusivo por Vendedor

Cada vendedor aprovado receberá um QR Code único e intransferível. O QR Code ficará inativo enquanto o vendedor estiver com status diferente de **Regular**.

---

### RN10 — Unicidade de Cadastro

Não poderá existir mais de um cadastro ativo de vendedor ou administrador utilizando o mesmo CPF ou e-mail na plataforma.

---

### RN11 — Perfis de Acesso

Cada conta autenticada deverá estar vinculada a um único tipo de usuário: **vendedor** ou **administrador**.

---

### RN12 — Restrição de Acesso por Perfil

Cada tipo de usuário autenticado somente poderá acessar as funcionalidades correspondentes ao seu perfil.

---

### RN13 — Marketplace Público

O marketplace deverá permanecer acessível aos alunos sem necessidade de criação de conta, login ou fornecimento prévio de dados pessoais.
