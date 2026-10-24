# NEXUS

Plataforma corporativa de gamificação para motivar funcionários por meio de tarefas, squads, pontuação, níveis, rankings e conquistas.

<!-- Cole aqui os links da demonstração e, se quiser, prints das telas (por exemplo, em docs/):
- Aplicação: https://SEU-APP.netlify.app
- API: https://SEU-BACKEND.onrender.com/health
-->

## Sumário

- [Visão geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar localmente](#como-executar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Deploy](#deploy)
- [Perfis de usuário](#perfis-de-usuário)
- [Regras do jogo](#regras-do-jogo)
- [API](#api)
- [Segurança](#segurança)
- [Requisitos](#requisitos)
- [Limitações conhecidas e próximos passos](#limitações-conhecidas-e-próximos-passos)
- [Versionamento](#versionamento)
- [Licença](#licença)

## Visão geral

Cada colaborador pertence a um **squad**, recebe **tarefas** de um gestor e ganha **pontos** ao concluí-las. Os pontos viram **XP e nível**, alimentam o **ranking** de colaboradores e de squads e desbloqueiam **conquistas**. Gestores acompanham e distribuem o trabalho do próprio squad, e administradores cuidam de usuários, squads, pontuação e do catálogo de conquistas.

Principais telas:

| Tela | Quem acessa | O que mostra |
|---|---|---|
| Login | Todos | Autenticação com e-mail e senha |
| Dashboard do usuário | Usuário | Nível e progresso, pontos, sequência, minhas tarefas, tarefas do squad, ranking dos squads, conquistas recentes |
| Painel do squad | Usuário | Métricas, missões, integrantes, insígnias e atividades do próprio squad |
| Dashboard do gestor | Gestor | Métricas do squad, criação e gestão de tarefas, ranking e atividades |
| Gerenciar squad | Gestor | Escalação, ficha de cada integrante, adicionar e remover membros |
| Painel admin | Administrador | Indicadores, usuários, squads, conquistas e ajustes de pontuação |
| Ranking | Todos | Colaboradores e squads por período, com pódio e sua posição |
| Notificações (sino) | Todos | Avisos de tarefas, pontos, conquistas, nível e squad |

## Tecnologias

**Backend:** Node.js, Fastify 5, TypeScript, Prisma ORM 7 (adaptador `pg`), PostgreSQL, JWT em cookie HttpOnly, bcryptjs, Zod, `@fastify/helmet`, `@fastify/cors`, `@fastify/rate-limit` e `@fastify/cookie`.

**Frontend:** React 19, Vite, TypeScript, Tailwind CSS 4, React Router e lucide-react.

**Infraestrutura:** backend no **Render**, frontend no **Netlify** e banco no **Neon**.

## Estrutura do projeto

```text
nexus/
├── docker-compose.yml        # PostgreSQL para desenvolvimento
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts           # admin, squads, tarefas e conquistas de exemplo (dev)
│   ├── prisma.config.ts
│   └── src/
│       ├── app.ts            # plugins globais, tratamento de erros e registro das rotas
│       ├── server.ts
│       ├── env.ts            # validação das variáveis de ambiente (Zod)
│       ├── lib/              # prisma, erros, paginação, níveis, períodos
│       ├── plugins/          # autenticação/JWT e verificação de origem (CSRF)
│       └── modules/
│           ├── auth/  users/  squads/  tasks/  points/
│           └── rankings/  achievements/  notifications/  admin/
└── frontend/
    └── src/
        ├── pages/            # uma página por tela
        ├── components/       # por tela: AdminDashboard, ManagerDashboard, UserDashboard...
        ├── layouts/          # AppLayout (sidebar, header, rodapé)
        ├── routes/           # rotas por perfil (usuário, gestor, admin)
        ├── contexts/         # autenticação, pontos e notificações
        ├── hooks/
        └── lib/              # cliente da API e tipos
```

Cada módulo do backend segue o mesmo desenho: `*.routes.ts` (rotas e validação com Zod) e, quando há regra reutilizável, `*.service.ts`.

## Como executar localmente

Pré-requisitos: Node.js 20 ou superior, Docker (ou um PostgreSQL próprio) e Git.

```bash
# 1. Banco de dados (PostgreSQL via Docker)
docker compose up -d

# 2. Backend
cd backend
npm install
cp .env.example .env          # no PowerShell: copy .env.example .env
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev                   # http://localhost:3000

# 3. Frontend (em outro terminal)
cd frontend
npm install
cp .env.example .env
npm run dev                   # http://localhost:5173
```

O `docker-compose.yml` cria o banco `apinexus`. Um `DATABASE_URL` compatível é `postgresql://docker:docker@localhost:5432/apinexus`.

### Usuários de teste (somente desenvolvimento)

O seed cria estes acessos, além de 5 squads, 3 tarefas de exemplo e 9 conquistas:

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@nexus.com` | `Admin1234` |
| Gestor (squad CyberTitans) | `gestor@nexus.com` | `Gestor1234` |
| Usuário (squad CyberTitans) | `usuario@nexus.com` | `Usuario1234` |

Em produção o seed cria **apenas** o administrador, usando `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` (a senha é obrigatória). Troque a senha no primeiro acesso.

Não há cadastro público: os usuários são criados pelo administrador.

## Variáveis de ambiente

### Backend (`backend/.env`)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `NODE_ENV` | Não | `development` (padrão) ou `production` |
| `PORT` | Não | Porta da API (padrão `3000`) |
| `DATABASE_URL` | Sim | URL de conexão do PostgreSQL |
| `JWT_SECRET` | Sim | Segredo do token, com 16 caracteres ou mais. Use um valor longo e aleatório |
| `JWT_EXPIRES_IN_SECONDS` | Não | Validade do token e do cookie (padrão `86400`, ou seja, 24 h) |
| `FRONTEND_URL` | Sim | Origem exata do frontend, sem barra no final. Usada no CORS e na verificação de origem |
| `SEED_ADMIN_EMAIL` | Não | E-mail do admin criado pelo seed (padrão `admin@nexus.com`) |
| `SEED_ADMIN_PASSWORD` | Em produção | Senha do admin criado pelo seed |
| `DEMO_USER_EMAIL` | Não | Se definido, a senha dessa conta de demonstração não pode ser alterada |

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://docker:docker@localhost:5432/apinexus"
JWT_SECRET="troque-por-uma-chave-longa-e-aleatoria"
JWT_EXPIRES_IN_SECONDS=86400
FRONTEND_URL="http://localhost:5173"
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL="http://localhost:3000/api"
```

O Vite lê essa variável **na hora do build**: se a URL da API mudar em produção, é preciso gerar um novo deploy do frontend.

Nunca envie arquivos `.env` ao repositório.

## Scripts

### Backend

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor com recarga automática |
| `npm run build` | Gera o Prisma Client e compila o TypeScript |
| `npm start` | Inicia a versão compilada |
| `npx prisma migrate dev` | Cria e aplica migrations em desenvolvimento |
| `npx prisma migrate deploy` | Aplica as migrations já versionadas (produção) |
| `npx prisma generate` | Gera o Prisma Client (rode depois de mudar o `schema.prisma`) |
| `npx prisma db seed` | Popula o banco |
| `npx prisma studio` | Interface para ver os dados |

### Frontend

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Verifica os tipos e gera a versão de produção |
| `npm run preview` | Serve a versão de produção localmente |

## Deploy

A aplicação roda em três serviços separados. Ajuste os comandos aos scripts do seu `package.json`.

### 1. Banco de dados (Neon)

1. Crie o projeto e copie a string de conexão (com `sslmode=require`).
2. Aplique as migrations: `npx prisma migrate deploy`, na sua máquina com o `DATABASE_URL` do Neon, ou no comando de build do Render.
3. Se o `migrate` travar ao usar a URL com pooler (host com `-pooler`), use a URL de conexão direta só para as migrations.
4. Rode o seed uma vez, com `SEED_ADMIN_PASSWORD` definido, para criar o administrador.

### 2. Backend (Render, Web Service)

| Campo | Valor sugerido |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install --include=dev && npm run build && npx prisma migrate deploy` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

Variáveis: `NODE_ENV=production`, `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` (a URL exata do Netlify, por exemplo `https://seu-app.netlify.app`) e, opcionalmente, as demais da tabela acima.

O `--include=dev` garante que `prisma` e `typescript` estejam disponíveis no build.

### 3. Frontend (Netlify)

| Campo | Valor |
|---|---|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `frontend/dist` |
| Variável | `VITE_API_URL=https://SEU-BACKEND.onrender.com/api` |

Como o app usa `BrowserRouter`, o Netlify precisa redirecionar todas as rotas para o `index.html`. Sem isso, atualizar a página em `/squad` dá erro 404. Crie `frontend/public/_redirects` com:

```text
/*  /index.html  200
```

### Observações de produção

- **Cookies entre domínios.** O frontend (`netlify.app`) e a API (`onrender.com`) ficam em sites diferentes, então em produção o cookie de sessão usa `SameSite=None; Secure`. Isso exige HTTPS nos dois lados e o `FRONTEND_URL` exatamente igual à origem do frontend.
- **Planos gratuitos hibernam.** O Render (web service) e o Neon (computação) podem suspender depois de um tempo sem acessos. A primeira requisição depois disso demora mais. O rodapé do app mostra se a API está respondendo.
- **IP do cliente.** O limite de tentativas de login usa o IP de quem acessa. Em produção o servidor confia só no primeiro proxy (o do Render).

## Perfis de usuário

| Capacidade | Usuário | Gestor | Admin |
|---|:---:|:---:|:---:|
| Ver o próprio perfil, trocar a senha e editar nome e avatar | ✅ | ✅ | ✅ |
| Ver e concluir as próprias tarefas | ✅ | ✅ | — |
| Ver pontos, nível, sequência e conquistas | ✅ | ✅ | — |
| Ver o painel do próprio squad | ✅ | ✅ | ✅ |
| Ver rankings | ✅ | ✅ | ✅ |
| Criar, editar e cancelar tarefas | — | ✅ (só do seu squad) | ✅ |
| Gerenciar responsáveis das tarefas | — | ✅ (só do seu squad) | ✅ |
| Adicionar e remover membros do squad | — | ✅ (só do seu squad) | ✅ |
| Cadastrar, editar, ativar e desativar usuários | — | — | ✅ |
| Criar, editar e desativar squads e definir o gestor | — | — | ✅ |
| Lançar bônus, ajustes e penalidades de pontos | — | — | ✅ |
| Criar e editar conquistas, conceder e recalcular | — | — | ✅ |

## Regras do jogo

### Pontos, XP e nível

- Pontos por tarefa concluída: **Fácil 5**, **Médio 10**, **Difícil 15**.
- **1 ponto = 1 XP.** O nível vem do XP acumulado: o nível 2 exige 100 XP, o 3 exige 300, o 4 exige 600, o 5 exige 1.000 e assim por diante (`50 × nível × (nível − 1)`).
- Os pontos de uma conclusão saem **uma única vez**, mesmo com cliques simultâneos.
- O total de pontos vem do **histórico de transações**, que nunca é apagado. Bônus, ajustes e penalidades viram novas transações, e o motivo é obrigatório. A pontuação negativa só existe como penalidade, que não pode deixar o saldo abaixo de zero.
- A pontuação de um squad é a soma dos pontos dos seus membros ativos.

### Tarefas

- Um gestor só cria tarefas para o próprio squad, e os responsáveis precisam ser membros ativos dele.
- A tarefa tem título, dificuldade e prazo (no futuro). A data final não pode ser anterior à inicial.
- Tarefa **atrasada** é calculada pelo prazo, não gravada no banco.
- Uma tarefa concluída ou cancelada não pode ser editada, nem voltar a ficar aberta. Tarefa cancelada não recebe responsáveis.
- A dificuldade trava depois que alguém concluiu, porque os pontos já foram pagos.
- Quem já concluiu não pode ser removido da tarefa, e a tarefa não pode ficar sem responsável.

### Sequência (streak)

São os dias seguidos com pelo menos uma pontuação positiva, contados no fuso de Brasília. A sequência continua valendo se o último dia ativo foi ontem.

### Ranking

- Lista só colaboradores e squads **ativos** (administradores não pontuam).
- Períodos: **últimos 7 dias**, **mês corrente** (desde o dia 1º) e **geral**.
- No empate, vale a ordem alfabética.
- A **variação** compara a posição com a do período anterior (os 7 dias antes, o mês passado ou, no ranking geral, a posição de uma semana atrás).

### Conquistas

| Tipo | Desbloqueia quando |
|---|---|
| Missões concluídas | A pessoa conclui a quantidade de tarefas da meta |
| Pontos acumulados | O total de pontos atinge a meta |
| Sequência de dias | A sequência atinge a meta |
| Posição no ranking | A pessoa chega ao top N da empresa (exige ter pontos) |
| Missões em equipe | Conclui tarefas que tinham dois ou mais responsáveis |
| Manual | Só o admin concede |

O desbloqueio é automático, ao concluir tarefas ou receber pontos, e também quando o admin cria, reativa ou recalcula uma conquista. Cada conquista paga um **bônus de pontos** como transação própria. Ninguém ganha a mesma conquista duas vezes. Depois que alguém desbloqueia, a regra (tipo e meta) não muda mais. Conquistas desativadas não são concedidas, mas o histórico fica.

### Notificações

O sino avisa: nova tarefa atribuída, tarefa editada, cancelada ou removida, tarefa concluída por alguém (para o gestor que a criou), bônus, ajuste ou penalidade, conquista desbloqueada, subida de nível, e entrada ou saída de squad. O contador é atualizado a cada minuto com a aba aberta.

## API

Base: `/api`. Respostas em JSON, listas paginadas (`page`, `perPage`, padrão de 20 itens) e erros no formato `{ "message": "...", "errors": [...] }`. A autenticação usa o cookie `nexus_token` (HttpOnly).

### Autenticação

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/login` | Público | Entra e grava o cookie de sessão |
| POST | `/auth/logout` | Público | Encerra a sessão |
| GET | `/auth/me` | Autenticado | Dados do usuário logado |
| PATCH | `/auth/change-password` | Autenticado | Troca a própria senha (exige a senha atual) |

### Usuários

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/users` | Admin | Lista com busca, filtros (perfil, status, setor, squad) e ordenação |
| GET | `/users/:id` | Admin, o próprio, gestor do mesmo squad | Dados de um usuário |
| POST | `/users` | Admin | Cadastra um usuário |
| PATCH | `/users/:id` | O próprio (nome e avatar) ou Admin | Edita |
| PATCH | `/users/:id/status` | Admin | Ativa ou desativa |

### Squads

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/squads` | Admin, Gestor | Lista simples dos squads ativos |
| GET | `/squads/all` | Admin | Lista completa, paginada |
| POST | `/squads` | Admin | Cria (nome e descrição, com gestor opcional) |
| PATCH | `/squads/:id` | Admin | Edita nome, descrição e gestor |
| PATCH | `/squads/:id/status` | Admin | Ativa ou desativa |
| GET | `/squads/:id/overview` | Membros do squad e Admin | Painel do squad |
| GET | `/squads/:id/members` | Gestor do squad, Admin | Escalação com desempenho |
| GET | `/squads/:id/candidates` | Gestor do squad, Admin | Colaboradores sem squad |
| POST | `/squads/:id/members` | Gestor do squad, Admin | Adiciona um membro |
| DELETE | `/squads/:id/members/:userId` | Gestor do squad, Admin | Remove um membro |

### Tarefas

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/tasks` | Autenticado | Usuário vê as suas, gestor as do squad, admin todas. Filtros: status, dificuldade, prazo, busca, atrasadas |
| POST | `/tasks` | Gestor, Admin | Cria e atribui |
| PATCH | `/tasks/:id` | Gestor do squad, Admin | Edita |
| PATCH | `/tasks/:id/status` | Responsável, Gestor, Admin | Iniciar, concluir (gera pontos) ou cancelar |
| POST | `/tasks/:id/assignments` | Gestor do squad, Admin | Adiciona responsáveis |
| DELETE | `/tasks/:id/assignments/:userId` | Gestor do squad, Admin | Remove um responsável |

### Pontuação

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/points/me` | Autenticado | Resumo: total, semana, nível, sequência e posições |
| GET | `/points/me/history` | Autenticado | Histórico de pontos |
| GET | `/points/users/:id/history` | Admin | Histórico de qualquer usuário |
| POST | `/points/adjustments` | Admin | Bônus, ajuste ou penalidade (com motivo) |

### Rankings

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/rankings/users` | Autenticado | Colaboradores. Parâmetros: `period` (`week`, `month`, `all`) e `squadId` |
| GET | `/rankings/squads` | Autenticado | Squads. Parâmetro: `period` |

Ambas devolvem também a posição de quem está logado (`me`).

### Conquistas

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/achievements/me` | Autenticado | Últimas desbloqueadas e a próxima da fila |
| GET | `/achievements` | Admin | Catálogo completo |
| POST | `/achievements` | Admin | Cria |
| PATCH | `/achievements/:id` | Admin | Edita |
| PATCH | `/achievements/:id/status` | Admin | Ativa ou desativa |
| POST | `/achievements/:id/award` | Admin | Concede a um usuário |
| POST | `/achievements/recalculate` | Admin | Reaplica as regras a todos |

### Notificações, métricas e saúde

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/notifications` | Autenticado | Lista as suas, com o total de não lidas |
| GET | `/notifications/unread-count` | Autenticado | Só o contador |
| PATCH | `/notifications/:id/read` | Autenticado | Marca uma como lida |
| PATCH | `/notifications/read-all` | Autenticado | Marca todas como lidas |
| GET | `/admin/metrics` | Admin | Indicadores gerais da plataforma |
| GET | `/health` | Público | Verificação de saúde (na raiz, fora de `/api`) |

## Segurança

- Senhas com **bcrypt**, entre 8 e 72 caracteres, com letras e números. O hash nunca é devolvido pela API.
- Sessão por **JWT em cookie HttpOnly**, com expiração. Usuário desativado perde o acesso na hora, mesmo com token válido.
- Login com **limite de tentativas** (por IP e e-mail) e comparação de hash mesmo quando o e-mail não existe, para não revelar quais e-mails estão cadastrados. A tela mostra a mesma mensagem para e-mail ou senha incorretos.
- Troca de senha limitada por usuário, exigindo a senha atual.
- **CORS** restrito ao frontend, **Helmet** para os cabeçalhos de segurança e **verificação do cabeçalho `Origin`** nas requisições que alteram dados, como defesa contra CSRF com cookie `SameSite=None`.
- Validação de todas as entradas com **Zod**, tratamento de erros centralizado e logs sem cookies nem cabeçalhos de autorização.
- Controle de acesso por perfil no backend (as telas também escondem o que cada perfil não pode usar, mas a regra vale na API).

## Requisitos

### Requisitos funcionais

**Autenticação e usuários**

- [x] Cadastrar um usuário (feito pelo administrador)
- [x] Autenticar um usuário
- [x] Obter o perfil do usuário autenticado
- [x] Atualizar os dados do próprio perfil
- [x] Visualizar a lista de usuários
- [x] Consultar um usuário pelo ID
- [x] Editar, desativar e reativar um usuário
- [x] Definir cargo e setor
- [x] Associar um usuário a um squad

**Squads**

- [x] Cadastrar, obter, listar e editar squads
- [x] Adicionar e remover usuários de um squad
- [x] Definir um gestor
- [x] Visualizar os membros, a pontuação e o desempenho de um squad

**Tarefas**

- [x] Criar, editar e cancelar uma tarefa
- [x] Listar as tarefas de um usuário e de um squad
- [x] Atribuir a um ou mais usuários e remover um usuário
- [x] Atualizar o status e concluir uma tarefa
- [ ] Atualizar o progresso de uma tarefa (hoje a conclusão leva a atribuição direto a 100%)
- [ ] Obter os dados de uma tarefa por ID (a listagem já traz todos os dados)
- [x] Filtrar por status, dificuldade e prazo, e paginar

**Pontuação**

- [x] Atribuir pontos ao concluir uma tarefa
- [x] Consultar a pontuação de um usuário e de um squad
- [x] Visualizar o histórico de pontos
- [x] Bônus, ajustes administrativos e penalidades
- [x] Visualizar a pontuação recebida por tarefa

**Rankings**

- [x] Ranking geral de usuários, de um squad e geral de squads
- [x] Posição de um usuário e de um squad
- [x] Variação de posição entre períodos (semanal e mensal), sem gráfico
- [x] Destacar os três primeiros
- [x] Filtrar o ranking por período

**Conquistas**

- [x] Cadastrar e listar conquistas
- [x] Desbloquear, ver as conquistas de um usuário e a data do desbloqueio
- [x] Pontos extras por conquista
- [x] Conquistas para metas individuais
- [ ] Conquistas para metas coletivas (o squad só exibe o que os membros desbloquearam)

**Dashboards**

- [x] Dashboard do usuário, do gestor e do administrador
- [ ] Relatórios gerais da plataforma (hoje há indicadores, sem relatórios exportáveis)

### Regras de negócio

- [x] E-mail único e válido, senha com requisitos mínimos, acesso só com login
- [x] Usuário desativado não faz login
- [x] Só administradores alteram cargo, ativam ou desativam usuários e cadastram gestores
- [x] Um gestor administra apenas o próprio squad e precisa estar associado a um
- [x] Nome de squad único, e squad desativado não recebe tarefas
- [x] Um usuário em apenas um squad ativo, e nunca duas vezes no mesmo
- [x] O gestor não se remove do squad sem o administrador
- [x] Tarefas com título, dificuldade e prazo válidos, só para membros do squad
- [x] Pontos por dificuldade (5, 10 e 15), uma vez por conclusão, sem alteração direta pelo usuário
- [x] Ajustes manuais só do administrador, sempre com descrição
- [x] Ranking apenas de ativos, com critério de desempate
- [x] Conquista desbloqueada uma única vez, com bônus registrado como transação

### Requisitos não funcionais

- [x] Backend em Node.js, Fastify e TypeScript; frontend em React, Vite e TypeScript; Tailwind CSS
- [x] PostgreSQL com Prisma ORM, migrations versionadas
- [x] Senhas com hash seguro, JWT com expiração, cookie HttpOnly
- [x] HTTPS em produção, CORS restrito, cabeçalhos de segurança, variáveis de ambiente
- [x] Validação de entrada com schemas, respostas em JSON, códigos HTTP e erros centralizados
- [x] Logs de erro sem informações sensíveis
- [x] Listas paginadas (padrão de 20), com filtros e ordenação
- [x] Interface responsiva e consistente entre os perfis
- [x] Controle de acesso por cargo
- [x] Documentação de instalação e execução
- [ ] Testes automatizados das principais regras de negócio

## Limitações conhecidas e próximos passos

- **Cookies entre domínios.** Como o frontend e a API ficam em sites diferentes, navegadores que bloqueiam cookies de terceiros por padrão (como o Safari) podem impedir o login. A solução é servir o app e a API no mesmo domínio registrável (por exemplo, `app.seudominio.com` e `api.seudominio.com`), o que permite usar `SameSite=Lax`.
- **Testes automatizados.** Ainda não existem. As regras mais críticas para cobrir são: pontos concedidos uma só vez, desbloqueio de conquistas sem duplicidade e permissões por cargo.
- **Troca de senha não invalida tokens já emitidos.** Eles valem até expirar. Uma coluna `passwordChangedAt` resolveria.
- **Notificações:** atualizadas por consulta a cada minuto (sem tempo real), sem lembretes de prazo e sem limpeza das antigas.
- **Conquistas coletivas**, **progresso parcial de tarefas**, **endpoint de tarefa por ID** e **relatórios exportáveis** ainda não foram feitos.
- O recálculo de conquistas roda um usuário por vez, o que serve para equipes pequenas e médias.

## Versionamento

O projeto adota **Conventional Commits**:

```text
feat(auth): add login endpoint
feat(tasks): add task creation
fix(auth): reject inactive users
fix(tasks): prevent duplicate completion
refactor(users): separate user service
docs: update setup instructions
chore(deps): update dependencies
```

E **Semantic Versioning** nas tags (`MAJOR.MINOR.PATCH`), por exemplo `v0.5.0` para tarefas, `v0.6.0` para pontuação e ranking, `v0.7.0` para conquistas e `v1.0.0` para a primeira versão estável.

## Licença

Este projeto foi desenvolvido para fins educacionais e de portfólio.
