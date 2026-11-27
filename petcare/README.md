# PetCare — monorepo

React/Vite + Express + Prisma + PostgreSQL. Node 22 e Docker Compose recomendados.

## Executar localmente

Na raiz, execute:

```bash
npm install
docker compose up -d
```

Copie `api/.env.example` para `api/.env` (Windows PowerShell: `Copy-Item api/.env.example api/.env`; Linux/macOS: `cp api/.env.example api/.env`). Troque JWT_SECRET por uma chave aleatória longa.

```bash
npm run migrate -w api -- --name init
npm run seed -w api
npm run dev
```

Frontend: http://localhost:5173. Swagger: http://localhost:3001/docs. API: http://localhost:3001/api.

## Acesso de demonstração

Professor (administrador): `professor@petcare.com` / `Professor123!`.
Cliente: `cliente@petcare.com` / `Professor123!`.
Credenciais apenas para desenvolvimento. Cadastros públicos sempre criam clientes.

## Organização

- shared: schemas Zod e tipos de entrada.
- api: routes, controllers, services, repositories, middlewares e Prisma.
- frontend: interface original, conectada à API via proxy Vite. Dados persistem no PostgreSQL; token de sessão no sessionStorage.

CRUD GET/POST `/api/{pets,services,appointments,consultations,payments}` e GET/PUT/DELETE `/:id`. Use o token retornado pelo login no botão Authorize do Swagger. Clientes acessam seus próprios animais, agendamentos e histórico; alterações administrativas exigem perfil ADMIN. Exclusões de registros referenciados são bloqueadas com 400 para preservar histórico. O cadastro de serviço e usuário tem campos únicos. Agendamentos relacionam animais e serviços; consultas e pagamentos também possuem chaves estrangeiras.

## Verificação

`npm run typecheck` e `npm run build` na raiz. Teste login, CRUD, duplicidade, validação e autorização no Swagger. A migration SQL inicial foi preparada manualmente porque o ambiente de edição não possui PostgreSQL/Docker nem acesso ao npm. Execute `prisma migrate dev` conforme acima e confira se o Prisma identifica divergências antes de publicar. Não foi possível executar testes de integração neste ambiente.

## GitHub

Copie os arquivos para o repositório original, revise `git status`, inclua `api/prisma/migrations` e o lockfile gerado por npm install. Nunca inclua `api/.env`, node_modules ou dist. Nenhum push foi realizado.
