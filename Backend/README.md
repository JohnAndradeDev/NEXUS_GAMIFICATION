# NEXUS

Plataforma corporativa de gamificação para motivar funcionários por meio de tarefas, squads, pontuação, rankings e conquistas.

## Tecnologias

- Node.js
- Fastify
- TypeScript
- React
- Vite
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- JWT
- Bcrypt

## Requisitos Funcionais

### Autenticação e usuários

- [x] Deve ser possível cadastrar um usuário;
- [x] Deve ser possível autenticar um usuário;
- [x] Deve ser possível obter o perfil do usuário autenticado;
- [x] Deve ser possível atualizar os dados do próprio perfil;
- [ ] Deve ser possível visualizar a lista de usuários;
- [ ] Deve ser possível consultar um usuário pelo ID;
- [ ] Deve ser possível editar um usuário;
- [ ] Deve ser possível desativar um usuário;
- [ ] Deve ser possível reativar um usuário;
- [ ] Deve ser possível definir o cargo do usuário;
- [ ] Deve ser possível definir o setor do usuário;
- [ ] Deve ser possível associar um usuário a um squad.

### Squads

- [ ] Deve ser possível cadastrar um squad;
- [ ] Deve ser possível obter os dados de um squad;
- [ ] Deve ser possível listar os squads da empresa;
- [ ] Deve ser possível editar um squad;
- [ ] Deve ser possível adicionar usuários a um squad;
- [ ] Deve ser possível remover usuários de um squad;
- [ ] Deve ser possível definir um gestor para um squad;
- [ ] Deve ser possível visualizar os membros de um squad;
- [ ] Deve ser possível visualizar a pontuação de um squad;
- [ ] Deve ser possível visualizar o desempenho de um squad.

### Tarefas

- [ ] Deve ser possível criar uma tarefa;
- [ ] Deve ser possível obter os dados de uma tarefa;
- [ ] Deve ser possível listar as tarefas de um usuário;
- [ ] Deve ser possível listar as tarefas de um squad;
- [ ] Deve ser possível editar uma tarefa;
- [ ] Deve ser possível cancelar uma tarefa;
- [ ] Deve ser possível atribuir uma tarefa a um ou mais usuários;
- [ ] Deve ser possível remover um usuário de uma tarefa;
- [ ] Deve ser possível atualizar o status de uma tarefa;
- [ ] Deve ser possível atualizar o progresso de uma tarefa;
- [ ] Deve ser possível concluir uma tarefa;
- [ ] Deve ser possível filtrar tarefas por status;
- [ ] Deve ser possível filtrar tarefas por dificuldade;
- [ ] Deve ser possível filtrar tarefas por prazo;
- [ ] Deve ser possível paginar a lista de tarefas.

### Pontuação

- [ ] Deve ser possível atribuir pontos ao concluir uma tarefa;
- [ ] Deve ser possível consultar a pontuação total de um usuário;
- [ ] Deve ser possível consultar a pontuação total de um squad;
- [ ] Deve ser possível visualizar o histórico de pontos de um usuário;
- [ ] Deve ser possível adicionar bônus de pontuação;
- [ ] Deve ser possível realizar ajustes administrativos de pontuação;
- [ ] Deve ser possível registrar penalidades de pontuação;
- [ ] Deve ser possível visualizar a pontuação recebida por tarefa.

### Rankings

- [ ] Deve ser possível visualizar o ranking geral de usuários;
- [ ] Deve ser possível visualizar o ranking dos usuários de um squad;
- [ ] Deve ser possível visualizar o ranking geral dos squads;
- [ ] Deve ser possível consultar a posição de um usuário;
- [ ] Deve ser possível consultar a posição de um squad;
- [ ] Deve ser possível visualizar a evolução semanal do ranking;
- [ ] Deve ser possível visualizar a evolução mensal do ranking;
- [ ] Deve ser possível destacar os três primeiros colocados;
- [ ] Deve ser possível filtrar o ranking por período.

### Conquistas

- [ ] Deve ser possível cadastrar uma conquista;
- [ ] Deve ser possível listar as conquistas disponíveis;
- [ ] Deve ser possível desbloquear uma conquista;
- [ ] Deve ser possível visualizar as conquistas de um usuário;
- [ ] Deve ser possível visualizar a data em que uma conquista foi desbloqueada;
- [ ] Deve ser possível atribuir pontos extras por uma conquista;
- [ ] Deve ser possível criar conquistas para metas individuais;
- [ ] Deve ser possível criar conquistas para metas coletivas.

### Dashboard do usuário

- [ ] Deve ser possível visualizar um resumo do desempenho pessoal;
- [ ] Deve ser possível visualizar o nível atual;
- [ ] Deve ser possível visualizar o progresso para o próximo nível;
- [ ] Deve ser possível visualizar a pontuação total;
- [ ] Deve ser possível visualizar as tarefas pendentes;
- [ ] Deve ser possível visualizar as tarefas concluídas;
- [ ] Deve ser possível visualizar as tarefas do squad;
- [ ] Deve ser possível visualizar a posição no ranking;
- [ ] Deve ser possível visualizar as conquistas recentes;
- [ ] Deve ser possível visualizar a sequência de dias ativos.

### Dashboard do gestor

- [ ] Deve ser possível visualizar o desempenho do squad;
- [ ] Deve ser possível visualizar a pontuação total do squad;
- [ ] Deve ser possível visualizar as tarefas pendentes do squad;
- [ ] Deve ser possível visualizar as tarefas concluídas do squad;
- [ ] Deve ser possível criar tarefas para o squad;
- [ ] Deve ser possível acompanhar o progresso dos membros;
- [ ] Deve ser possível visualizar o ranking do squad;
- [ ] Deve ser possível gerenciar os membros do squad;
- [ ] Deve ser possível visualizar atividades recentes do squad;
- [ ] Deve ser possível visualizar indicadores de engajamento.

### Dashboard do administrador

- [ ] Deve ser possível visualizar os indicadores gerais da empresa;
- [ ] Deve ser possível cadastrar usuários;
- [ ] Deve ser possível editar usuários;
- [ ] Deve ser possível ativar usuários;
- [ ] Deve ser possível desativar usuários;
- [ ] Deve ser possível cadastrar squads;
- [ ] Deve ser possível editar squads;
- [ ] Deve ser possível visualizar todos os usuários;
- [ ] Deve ser possível visualizar todos os squads;
- [ ] Deve ser possível ajustar a pontuação de um usuário;
- [ ] Deve ser possível cadastrar conquistas;
- [ ] Deve ser possível visualizar relatórios gerais da plataforma.

## Regras de Negócio

### Autenticação e usuários

- [ ] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [ ] O e-mail deve possuir um formato válido;
- [ ] A senha deve atender aos requisitos mínimos de segurança;
- [ ] O usuário não pode acessar recursos sem estar autenticado;
- [ ] O usuário desativado não pode realizar login;
- [ ] O usuário só pode alterar os próprios dados, salvo quando possuir permissão administrativa;
- [ ] Apenas administradores podem alterar o cargo de um usuário;
- [ ] Apenas administradores podem ativar ou desativar usuários;
- [ ] Um usuário não pode possuir mais de um cadastro com o mesmo e-mail;
- [ ] Um gestor deve estar associado a um squad para administrar suas tarefas;
- [ ] Apenas administradores podem cadastrar gestores;
- [ ] Os dados sensíveis do usuário não devem ser retornados pela API.

### Squads

- [ ] O nome do squad não pode ser duplicado;
- [ ] Apenas administradores podem cadastrar squads;
- [ ] Apenas administradores podem excluir ou desativar squads;
- [ ] Um gestor só pode administrar o squad ao qual está associado;
- [ ] Um gestor não pode administrar tarefas de outro squad;
- [ ] Um usuário pode pertencer a apenas um squad ativo;
- [ ] Um usuário não pode ser adicionado duas vezes ao mesmo squad;
- [ ] Um gestor não pode remover a si próprio do squad sem confirmação administrativa;
- [ ] Um squad desativado não pode receber novas tarefas;
- [ ] A pontuação do squad deve ser calculada com base na pontuação dos seus membros.

### Tarefas

- [ ] Apenas gestores e administradores podem criar tarefas;
- [ ] Um gestor só pode criar tarefas para o próprio squad;
- [ ] Uma tarefa deve possuir título, dificuldade e prazo;
- [ ] A data final não pode ser anterior à data inicial;
- [ ] Uma tarefa não pode ser criada com prazo inválido;
- [ ] Uma tarefa pode ser atribuída a um ou mais usuários;
- [ ] Apenas membros do squad podem receber tarefas daquele squad;
- [ ] O mesmo usuário não pode ser atribuído duas vezes à mesma tarefa;
- [ ] Um usuário não pode concluir uma tarefa que não foi atribuída a ele;
- [ ] Uma tarefa concluída não pode voltar para pendente sem permissão de gestor ou administrador;
- [ ] Uma tarefa cancelada não pode receber novos responsáveis;
- [ ] Tarefas atrasadas devem ser identificadas automaticamente;
- [ ] A pontuação deve ser definida com base na dificuldade da tarefa;
- [ ] O usuário só recebe pontos uma vez por conclusão;
- [ ] A exclusão de uma tarefa deve preservar o histórico de pontuação, quando aplicável.

### Pontuação

- [ ] Tarefas fáceis devem valer 5 pontos;
- [ ] Tarefas médias devem valer 10 pontos;
- [ ] Tarefas difíceis devem valer 15 pontos;
- [ ] Uma tarefa concluída só pode gerar uma transação de pontuação;
- [ ] A pontuação não pode ser alterada diretamente pelo usuário;
- [ ] Apenas administradores podem realizar ajustes manuais;
- [ ] Todo ajuste manual deve possuir uma descrição;
- [ ] Pontuações negativas devem ser registradas como penalidades;
- [ ] O histórico de pontuação não deve ser apagado;
- [ ] A pontuação do usuário deve ser calculada a partir do histórico de transações;
- [ ] A pontuação do squad deve ser calculada com base nos seus membros ativos.

### Rankings

- [ ] Usuários desativados não devem aparecer no ranking ativo;
- [ ] Squads desativados não devem aparecer no ranking ativo;
- [ ] O ranking deve ser ordenado pela pontuação total;
- [ ] Em caso de empate, deve ser utilizado um critério secundário definido pela aplicação;
- [ ] O ranking deve informar a posição do usuário autenticado;
- [ ] O ranking não deve permitir que o usuário altere sua própria pontuação;
- [ ] O ranking semanal deve considerar apenas o período correspondente;
- [ ] O ranking mensal deve considerar apenas o mês correspondente;
- [ ] O ranking geral deve considerar todo o histórico válido de pontuação.

### Conquistas

- [ ] Uma conquista não pode ser desbloqueada duas vezes pelo mesmo usuário;
- [ ] O usuário deve receber a conquista somente após cumprir sua condição;
- [ ] Conquistas desbloqueadas devem permanecer no histórico do usuário;
- [ ] O bônus de uma conquista deve ser registrado como transação de pontuação;
- [ ] Apenas administradores podem criar ou editar conquistas;
- [ ] Conquistas desativadas não devem ser atribuídas novamente;
- [ ] O sistema deve evitar duplicidade de bônus por uma mesma conquista.

## Requisitos Não Funcionais

- [ ] O backend deve ser desenvolvido com Node.js, Fastify e TypeScript;
- [ ] O frontend deve ser desenvolvido com React, Vite e TypeScript;
- [ ] A estilização deve utilizar Tailwind CSS;
- [ ] O banco de dados deve utilizar PostgreSQL;
- [ ] O acesso ao banco de dados deve ser realizado por meio do Prisma ORM;
- [ ] A senha do usuário deve ser armazenada utilizando hash seguro;
- [ ] As senhas nunca devem ser armazenadas em texto puro;
- [ ] O usuário deve ser identificado por um JWT;
- [ ] O JWT deve possuir tempo de expiração;
- [ ] O token de autenticação deve ser armazenado preferencialmente em cookie HttpOnly;
- [ ] A API deve utilizar HTTPS em produção;
- [ ] A API deve possuir validação dos dados de entrada;
- [ ] A API deve utilizar schemas para validação das requisições;
- [ ] A API deve retornar respostas em formato JSON;
- [ ] A API deve utilizar códigos HTTP apropriados;
- [ ] A API deve possuir tratamento centralizado de erros;
- [ ] Todas as listas de dados devem ser paginadas;
- [ ] O tamanho padrão das páginas deve ser de 20 itens;
- [ ] A API deve permitir filtros, quando aplicável;
- [ ] A API deve permitir ordenação, quando aplicável;
- [ ] A API deve possuir logs de erros;
- [ ] Informações sensíveis não devem ser registradas nos logs;
- [ ] O CORS deve permitir apenas origens autorizadas;
- [ ] O backend deve utilizar headers de segurança;
- [ ] As variáveis sensíveis devem ser armazenadas em variáveis de ambiente;
- [ ] O arquivo `.env` não deve ser enviado ao repositório;
- [ ] O projeto deve possuir migrations do banco de dados;
- [ ] O ambiente de produção deve aplicar migrations versionadas;
- [ ] O frontend deve ser responsivo para desktop, tablet e celular;
- [ ] A interface deve manter consistência visual entre os perfis;
- [ ] O sistema deve possuir controle de acesso baseado em cargo;
- [ ] Usuários comuns não devem acessar rotas administrativas;
- [ ] Gestores não devem acessar recursos administrativos;
- [ ] A API deve estar preparada para deploy no Render;
- [ ] O sistema deve possuir documentação de instalação e execução;
- [ ] O código deve ser versionado utilizando Git;
- [ ] Os commits devem seguir uma convenção padronizada;
- [ ] O projeto deve possuir testes para as principais regras de negócio.

## Perfis de Usuário

### Usuário comum

Pode:

- Visualizar seu perfil;
- Visualizar suas tarefas;
- Atualizar o progresso das tarefas;
- Concluir tarefas atribuídas;
- Visualizar sua pontuação;
- Visualizar seu ranking;
- Visualizar o ranking do squad;
- Visualizar suas conquistas;
- Visualizar os dados do próprio squad.

Não pode:

- Criar tarefas;
- Gerenciar usuários;
- Gerenciar squads;
- Alterar pontuação;
- Acessar recursos administrativos.

### Gestor

Pode:

- Visualizar o próprio squad;
- Criar tarefas para o squad;
- Atribuir tarefas aos membros;
- Acompanhar o progresso dos membros;
- Visualizar o ranking do squad;
- Gerenciar membros do próprio squad;
- Visualizar relatórios do squad.

Não pode:

- Gerenciar usuários globalmente;
- Alterar cargos;
- Acessar dados administrativos;
- Gerenciar squads de outros gestores;
- Alterar pontuação manualmente, salvo se autorizado.

### Administrador

Pode:

- Gerenciar usuários;
- Gerenciar squads;
- Criar e editar conquistas;
- Ajustar pontuações;
- Visualizar todos os rankings;
- Visualizar relatórios gerais;
- Ativar ou desativar usuários;
- Definir cargos;
- Configurar os dados globais da plataforma.

## Principais Endpoints

### Autenticação

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Usuários

```text
GET    /api/users
GET    /api/users/:id
POST   /api/users
PATCH  /api/users/:id
PATCH  /api/users/:id/status
```

### Squads

```text
GET    /api/squads
GET    /api/squads/:id
POST   /api/squads
PATCH  /api/squads/:id
POST   /api/squads/:id/members
DELETE /api/squads/:id/members/:userId
```

### Tarefas

```text
GET   /api/tasks
GET   /api/tasks/:id
POST  /api/tasks
PATCH /api/tasks/:id
PATCH /api/tasks/:id/status
PATCH /api/tasks/:id/progress
POST  /api/tasks/:id/assignments
```

### Rankings

```text
GET /api/rankings/users
GET /api/rankings/squads
GET /api/rankings/users/:id
GET /api/rankings/squads/:id
```

### Pontuação

```text
GET  /api/points/me
GET  /api/points/me/history
POST /api/points/adjustments
```

### Conquistas

```text
GET  /api/achievements
GET  /api/achievements/me
POST /api/achievements
PATCH /api/achievements/:id
```

## Como executar o projeto

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Prisma

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

## Variáveis de ambiente

### Backend

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nexus"
JWT_SECRET="sua-chave-secreta"
JWT_EXPIRES_IN="1d"
FRONTEND_URL="http://localhost:5173"
```

### Frontend

```env
VITE_API_URL="http://localhost:3000/api"
```

## Versionamento

O projeto utiliza Conventional Commits:

```text
feat(auth): add login endpoint
feat(tasks): add task creation
feat(ranking): add squad ranking
fix(auth): reject inactive users
fix(tasks): prevent duplicate completion
refactor(users): separate user service
test(auth): add login tests
docs: update setup instructions
chore(deps): update dependencies
```

Tags seguem Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Exemplos:

```text
v0.1.0  Estrutura inicial do backend
v0.2.0  Autenticação
v0.3.0  Gerenciamento de usuários
v0.4.0  Squads
v0.5.0  Tarefas
v0.6.0  Pontuação e ranking
v0.7.0  Conquistas
v1.0.0  Primeira versão estável
```

## Status do projeto

### Frontend

- [x] Configuração inicial do React;
- [x] Configuração do Vite;
- [x] Configuração do Tailwind CSS;
- [x] Tela de login;
- [x] Tela inicial do usuário;
- [ ] Tela do gestor;
- [ ] Tela do administrador;
- [ ] Integração com a API;
- [ ] Controle de rotas protegidas;
- [ ] Tratamento de loading e erros da API.

### Backend

- [ ] Configuração do Fastify;
- [ ] Configuração do TypeScript;
- [ ] Configuração do Prisma;
- [ ] Configuração do PostgreSQL;
- [ ] Modelagem inicial do banco;
- [ ] Migrations;
- [ ] Cadastro de usuários;
- [ ] Login com JWT;
- [ ] Perfil do usuário autenticado;
- [ ] Middleware de autenticação;
- [ ] Controle de acesso por cargo;
- [ ] CRUD de squads;
- [ ] CRUD de tarefas;
- [ ] Sistema de pontuação;
- [ ] Ranking de usuários;
- [ ] Ranking de squads;
- [ ] Sistema de conquistas;
- [ ] Testes automatizados;
- [ ] Deploy no Render.

## Licença

Este projeto está em desenvolvimento para fins educacionais e de portfólio.
