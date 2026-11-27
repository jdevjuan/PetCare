# 🐾 PetCare — Sistema de Gestão Veterinária

## Link do vídeo no YouTube
https://www.youtube.com/watch?v=UC4T6_nTVyk

---

## Tema

**PetCare** é um sistema web para uma **clínica veterinária e pet shop**. Ele controla os tutores, os animais, os serviços oferecidos (banho, tosa, vacina, consulta), os agendamentos e o histórico de consultas veterinárias.

O projeto utiliza uma arquitetura organizada em monorepo, com frontend, API e código compartilhado, além de PostgreSQL como banco de dados e Prisma ORM para gerenciamento das informações.

---

## Equipe e divisão de trabalho

| Integrante | RGM | Papel principal |
| --- | --- | --- |
| Francisco Juan | 44184913 | Estrutura do projeto, regras de negócio e banco de dados |
| Artur Mota | 43726844 | Interface, identidade visual, conteúdo e documentação |

### Juan — base técnica
- Definição da arquitetura do projeto (frontend, API e pacote `shared`)
- Modelagem do banco de dados com Prisma e PostgreSQL (tabelas, relacionamentos, migrations e seed)
- Autenticação, permissões e regras de agendamento
- Publicação do projeto

### Artur — interface e experiência do usuário
- Refinamento visual das páginas públicas: Home, Sobre e Contato
- Escrita dos textos e do conteúdo institucional da clínica
- Seção "Como funciona", perguntas frequentes e rodapé de navegação
- Telas de login e cadastro
- Busca de serviços e ajustes dos painéis do cliente e do administrador
- Revisão de cores, ícones e responsividade (celular e computador)
- Testes manuais dos fluxos de cliente e administrador
- Elaboração e revisão deste README

### Trabalho em conjunto
- Definição das funcionalidades e do tema do projeto
- Revisão e testes antes da entrega
- Preparação da apresentação

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

## 🗃️ Tabelas do banco e ligações

O banco é PostgreSQL, modelado com Prisma (`api/prisma/schema.prisma`). O sistema tem **5 tabelas de negócio** (Pet, Service, Appointment, Consultation e Payment) e uma tabela de **usuários para o login** (User).

| Tabela | Descrição | Campos principais | Ligações (chave estrangeira) |
| --- | --- | --- | --- |
| `User` | Usuários que fazem login (tutores e administradores) | name, **email (único)**, phone, passwordHash (hash bcrypt), role (`CLIENT` ou `ADMIN`) | Um usuário tem vários pets |
| `Pet` | Animais atendidos | name, species, breed, birthDate, weight, observations | `ownerId` → `User` |
| `Service` | Serviços da clínica | **name (único)**, description, price, duration, active | Um serviço aparece em vários agendamentos |
| `Appointment` | Serviço marcado para um pet | date, status, notes | `petId` → `Pet` e `serviceId` → `Service` (liga **duas** tabelas) |
| `Consultation` | Histórico veterinário | veterinarian, diagnosis, notes, date | `petId` → `Pet` e `appointmentId` → `Appointment` (opcional) |
| `Payment` | Registro de pagamento de um agendamento | amount, status, paymentMethod | `appointmentId` → `Appointment` (**único**, relação 1 para 1) |

### Relacionamentos

- Um **User** possui vários **Pets** (1 para N).
- Um **Pet** possui vários **Appointments** e várias **Consultations** (1 para N).
- Um **Service** está em vários **Appointments** (1 para N).
- Um **Appointment** pode originar várias **Consultations** (1 para N, opcional).
- Um **Appointment** tem no máximo um **Payment** (1 para 1).

### Diagrama

```mermaid
erDiagram
    USER ||--o{ PET : possui
    PET ||--o{ APPOINTMENT : tem
    SERVICE ||--o{ APPOINTMENT : "é solicitado em"
    PET ||--o{ CONSULTATION : recebe
    APPOINTMENT |o--o{ CONSULTATION : origina
    APPOINTMENT ||--o| PAYMENT : gera
    USER {
        string id PK
        string email UK
        string passwordHash
        string role
    }
    SERVICE {
        string id PK
        string name UK
    }
    PAYMENT {
        string id PK
        string appointmentId UK
    }
```

### Campos únicos (`@unique`)

- `User.email`: não permite dois usuários com o mesmo e-mail.
- `Service.name`: não permite dois serviços com o mesmo nome.
- `Payment.appointmentId`: cada agendamento tem no máximo um pagamento.

### Regras de exclusão

O banco impede apagar um registro que tenha outros ligados a ele (por exemplo, um pet com agendamentos). A exceção é `Consultation.appointmentId`, que é opcional: se o agendamento for apagado, a consulta continua, com o campo vazio.

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
- **Routes → Controllers → Services → Repositories:** as camadas da API. As rotas definem os endereços, os controllers recebem e respondem as requisições, os services concentram as regras de negócio e os repositories acessam o banco.
- **Middlewares:** validação dos dados (Zod) e verificação do token de login.
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
npm run migrate -w api
```
Esse comando aplica as migrations ao PostgreSQL (cria as tabelas). Se o Prisma perguntar um nome para uma nova migration, não deve acontecer em um banco novo.


### 7. Popular o banco com dados de exemplo (seed)

```bash
npm run seed -w api
```

O seed preenche todas as tabelas com dados de exemplo e cria o usuário de teste descrito na seção abaixo.

### 8. Iniciar a aplicação

```bash
npm run dev
```

O comando inicia simultaneamente o frontend e a API.

---

## 🔑 Acesso para o professor

Depois de rodar o seed, use um destes usuários para entrar no sistema:

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador (acesso completo) | `professor@petcare.com` | `Professor123!` |
| Cliente (área do tutor) | `cliente@petcare.com` | `Professor123!` |

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
- **Seed:** insere dados iniciais de exemplo no banco.

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
