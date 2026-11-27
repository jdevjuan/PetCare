# 🐾 PetCare — Sistema de Gestão Veterinária

Sistema web de gerenciamento para clínicas veterinárias e pet shops, desenvolvido para facilitar o controle de clientes, animais, serviços, agendamentos, consultas e pagamentos.

O projeto utiliza uma arquitetura organizada em monorepo, com frontend, API e código compartilhado, além de PostgreSQL como banco de dados e Prisma ORM para gerenciamento das informações.

---

## 📋 Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| React | Construção da interface |
| TypeScript | Tipagem e segurança do código |
| Vite | Ambiente de desenvolvimento e build |
| Node.js | Ambiente de execução do backend |
| Express | Desenvolvimento da API REST |
| PostgreSQL | Banco de dados relacional |
| Prisma ORM | Acesso e gerenciamento do banco |
| Docker | Execução do PostgreSQL em container |
| Zod | Validação de dados |
| JWT | Autenticação de usuários |

---

## 🏗️ Arquitetura do projeto

O PetCare utiliza uma estrutura de monorepo, mantendo os principais componentes da aplicação em um único repositório.

```text
PetCare/
│
├── api/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   └── src/
│
├── shared/
│   └── index.ts
│
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

### Responsabilidade dos componentes

- **Frontend:** interface utilizada pelos clientes e administradores.
- **API:** responsável pela comunicação entre frontend e banco de dados.
- **Controllers:** organização do processamento das requisições.
- **Services:** regras de negócio e autenticação.
- **Repositories:** acesso aos dados.
- **Middlewares:** validação e verificações das requisições.
- **Shared:** compartilhamento de schemas e tipos TypeScript.
- **Prisma:** modelagem e gerenciamento do banco de dados.

---

## ⚙️ Funcionalidades

### Área do cliente
- Cadastro e autenticação de usuários.
- Gerenciamento de animais.
- Visualização dos serviços disponíveis.
- Agendamento de atendimentos.
- Consulta ao histórico de agendamentos.
- Visualização de consultas e informações do perfil.

### Área administrativa
- Painel de gerenciamento.
- Gerenciamento de clientes.
- Gerenciamento de animais.
- Cadastro e gerenciamento de serviços.
- Controle de agendamentos e seus status.
- Registro de consultas veterinárias.
- Gerenciamento de pagamentos.

---

## 💻 Requisitos para execução

Antes de iniciar o projeto, é necessário instalar:

- [Node.js 22](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- npm (instalado junto com Node.js).
- Git (caso o projeto seja obtido por clonagem).

Recomenda-se utilizar o VS Code para editar o código.

---

## 🚀 Instalação e execução

### 1. Clonar o repositório

```bash
git clone https://github.com/jdevjuan/PetCare.git
cd PetCare
```

### 2. Instalar as dependências

Na raiz do projeto:

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `api`, utilizando o `.env.example` como referência.

Exemplo para o ambiente local:

```env
DATABASE_URL="postgresql://petcare:petcare_dev@localhost:5432/petcare?schema=public"
JWT_SECRET="sua_chave_secreta_local"
FRONTEND_ORIGIN="http://localhost:5173"
```

Utilize valores próprios para o ambiente de desenvolvimento. Não compartilhe segredos ou arquivos `.env` pessoais.

### 4. Iniciar o banco de dados com Docker

Na raiz do projeto:

```bash
docker compose up -d
```

O Docker Compose inicia o PostgreSQL utilizando a imagem oficial da versão 16.

Configuração local:

| Configuração | Valor |
|---|---|
| Banco | petcare |
| Usuário | petcare |
| Senha | petcare_dev |
| Porta | 5432 |

Os dados são persistidos em um volume Docker chamado `pgdata`.

### 5. Gerar o Prisma Client

```bash
npm run generate -w api
```

Esse comando gera o cliente utilizado pela API para acessar o banco de dados.

### 6. Executar as migrations

```bash
npx prisma migrate deploy --schema=api/prisma/schema.prisma
```

As migrations aplicam ao PostgreSQL as alterações de estrutura definidas pelo projeto.

### 7. Iniciar a aplicação

```bash
npm run dev
```

O comando inicia simultaneamente o frontend e a API.

---

## 🌐 Endereços locais

Após iniciar corretamente a aplicação:

| Serviço | Endereço |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001 |
| Documentação Swagger | http://localhost:3001/docs |
| PostgreSQL | localhost:5432 |

---

## 🐳 Docker

O Docker é utilizado para padronizar a execução do PostgreSQL, evitando a necessidade de configurar manualmente o servidor de banco de dados.

Comandos úteis:

Iniciar o banco:

```bash
docker compose up -d
```

Verificar os containers:

```bash
docker compose ps
```

Visualizar os logs:

```bash
docker compose logs -f postgres
```

Parar os containers:

```bash
docker compose down
```

O volume persistente mantém os dados mesmo depois que os containers são desligados.

---

## 🗄️ Prisma ORM

O Prisma é responsável pela comunicação entre a API e o PostgreSQL.

Principais recursos utilizados:

- **Schema:** define os modelos e relacionamentos do banco.
- **Migrations:** registra e aplica alterações na estrutura do banco.
- **Prisma Client:** permite executar consultas e operações utilizando TypeScript.
- **Seed:** permite inserir dados iniciais no banco, conforme a implementação do projeto.

Os arquivos relacionados ao Prisma estão localizados em:

```text
api/prisma/
```

---

## 🧪 Verificação do projeto

Para gerar o build do frontend:

```bash
npm run build
```

Para verificar os tipos do frontend:

```bash
npm run typecheck
```

Para verificar os tipos da API:

```bash
npx tsc -p api/tsconfig.json --noEmit
```

---

## 📌 Observações importantes

- O arquivo `api/.env` deve ser criado individualmente em cada máquina.
- A pasta `node_modules` não precisa ser compartilhada.
- O PostgreSQL precisa estar ativo antes de executar operações que dependam do banco.
- As migrations devem ser aplicadas antes da utilização da aplicação em um banco novo.
- O Docker Compose disponibiliza o banco de dados; frontend e API são executados pelo Node.js.

---

## 👨‍💻 Projeto

**PetCare — Sistema de Gestão Veterinária**

Projeto desenvolvido utilizando React, TypeScript, Node.js, Express, Prisma e PostgreSQL.

Repositório: https://github.com/jdevjuan/PetCare
