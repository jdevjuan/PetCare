# PetCare

Plataforma web para uma **clínica veterinária e pet shop**. Clientes cadastram seus animais, consultam serviços e preços e agendam atendimentos; a equipe da clínica gerencia serviços, agendamentos, consultas e pagamentos em um painel administrativo.

Projeto acadêmico de Desenvolvimento Web.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como rodar no seu computador](#como-rodar-no-seu-computador)
- [Como usar o sistema](#como-usar-o-sistema)
- [Como funciona por dentro](#como-funciona-por-dentro)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Rotas do site](#rotas-do-site)
- [Publicação (GitHub e Vercel)](#publicação-github-e-vercel)
- [Limitações](#limitações)
- [Possíveis evoluções](#possíveis-evoluções)

## Funcionalidades

### Área pública
- Página inicial, serviços (com preço e duração), sobre a clínica e contato
- Cadastro e login

### Cliente
- Painel com quantidade de animais, próximos agendamentos e histórico recente
- Editar o próprio perfil
- Cadastrar, editar e excluir animais (nome, espécie, raça, nascimento, peso e observações)
- Consultar serviços disponíveis e seus preços
- Solicitar agendamento escolhendo animal, serviço, data e horário
- Acompanhar o status e cancelar agendamentos (enquanto Pendente ou Confirmado)
- Consultar o histórico de consultas veterinárias dos seus animais

### Administrador
- Painel com total de clientes, animais, agendamentos pendentes e confirmados, consultas realizadas e serviços mais solicitados (dados calculados, não fixos)
- Visualizar clientes e todos os animais
- Criar, editar, ativar/desativar e excluir serviços (preço e duração configuráveis)
- Gerenciar agendamentos: confirmar, iniciar atendimento, concluir ou cancelar
- Registrar o pagamento de atendimentos concluídos (Dinheiro, Pix ou Cartão), apenas como controle administrativo
- Registrar e excluir consultas veterinárias

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| React 18 | Interface em componentes |
| TypeScript | Tipagem do código |
| Vite | Servidor de desenvolvimento e build |
| Tailwind CSS | Estilização e responsividade |
| React Router | Navegação e rotas protegidas |
| Zod | Validação dos dados dos formulários |
| Lucide React | Ícones |

> **Versão simplificada:** o projeto original previa backend Node/Express com PostgreSQL e Prisma. Para publicar direto na Vercel, o "backend" foi implementado como uma camada de código no próprio front (`src/lib/api.ts`) e os dados são salvos no `localStorage` do navegador. As regras de negócio, validações e permissões foram mantidas.

## Como rodar no seu computador

Pré-requisito: [Node.js](https://nodejs.org) 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente http://localhost:5173).

Outros comandos:

```bash
npm run build       # gera a versão de produção na pasta dist/
npm run preview     # testa a versão de produção localmente
npm run typecheck   # confere os tipos do TypeScript
```

## Como usar o sistema

1. Clique em **Criar conta**. **O primeiro cadastro vira administrador** (não existe senha padrão no código). Os seguintes são clientes.
2. **Como cliente:** cadastre um animal, vá em *Novo agendamento*, escolha animal, serviço e horário. O agendamento nasce como **Pendente**.
3. **Como administrador:** em *Agendamentos*, confirme, inicie e conclua o atendimento. Ao concluir, é gerado um pagamento pendente que pode ser marcado como pago. Em *Consultas*, registre o atendimento veterinário.
4. **De volta como cliente:** veja o novo status e o histórico de consultas.

Para zerar tudo (por exemplo, antes de uma apresentação): entre como administrador, vá em **Painel** e clique em **Restaurar dados iniciais**.

### Ciclo de vida de um agendamento

```
PENDING -> CONFIRMED -> IN_PROGRESS -> COMPLETED
   \            \             \
    +------------+-------------+--> CANCELLED
```

Apenas o administrador altera o status. O cliente só pode cancelar.

## Como funciona por dentro

- **Dados:** `src/lib/storage.ts` guarda um único objeto (`users`, `pets`, `services`, `appointments`, `consultations`, `payments`) no `localStorage`. Na primeira abertura são criados 6 serviços iniciais (Banho, Tosa higiênica, Tosa completa, Consulta veterinária, Vacinação e Exame clínico).
- **Regras e permissões:** `src/lib/api.ts` concentra a lógica. Toda função confere quem está logado (`requireUser`) e, quando necessário, se é administrador (`requireAdmin`). O cliente só enxerga e altera os próprios animais e agendamentos; ids vindos da tela nunca são aceitos sem checar o dono.
- **Validação:** `src/lib/validators.ts` define os schemas Zod com mensagens em português.
- **Login:** `src/context/AuthContext.tsx` mantém o usuário logado; `ProtectedRoute` bloqueia as áreas privadas. Senhas são salvas como hash SHA-256, nunca em texto puro.
- **Agendamento:** impede data no passado, animal de outro usuário, serviço inativo e **horários sobrepostos** (considera a duração de cada serviço).
- **Exclusão segura:** animal com histórico de agendamentos ou consultas não pode ser excluído; serviço já usado é apenas **desativado** (exclusão lógica).

## Estrutura do projeto

```
petcare/
├── index.html            página única do site
├── vercel.json           faz as rotas do React Router funcionarem na Vercel
├── tailwind.config.js
├── vite.config.ts
└── src/
    ├── main.tsx          ponto de entrada (providers e roteador)
    ├── App.tsx           definição de todas as rotas
    ├── types.ts          tipos User, Pet, Service, Appointment, Consultation, Payment
    ├── lib/
    │   ├── storage.ts    persistência no localStorage e serviços iniciais
    │   ├── api.ts        regras de negócio, autenticação e permissões
    │   ├── validators.ts schemas Zod
    │   └── format.ts     moeda, datas e rótulos de status
    ├── context/
    │   ├── AuthContext.tsx
    │   └── ToastContext.tsx
    ├── components/       layouts, rota protegida, botões, cards, modal, listas
    └── pages/
        ├── public/       Home, Serviços, Sobre, Contato, Login, Cadastro
        ├── client/       Painel, Perfil, Animais, Agendar, Agendamentos, Histórico
        └── admin/        Painel, Clientes, Serviços, Agendamentos, Consultas
```

## Rotas do site

| Rota | Página | Acesso |
| --- | --- | --- |
| `/` | Início | Todos |
| `/servicos`, `/sobre`, `/contato` | Serviços, Sobre, Contato | Todos |
| `/entrar`, `/cadastro` | Login e cadastro | Todos |
| `/app` | Painel do cliente | Cliente |
| `/app/animais`, `/app/animais/novo`, `/app/animais/:id` | Animais | Cliente |
| `/app/servicos` | Serviços disponíveis | Cliente |
| `/app/agendar` | Novo agendamento | Cliente |
| `/app/agendamentos` | Meus agendamentos | Cliente |
| `/app/historico` | Histórico de consultas | Cliente |
| `/app/perfil` | Meu perfil | Cliente |
| `/admin` | Painel administrativo | Admin |
| `/admin/clientes` | Clientes | Admin |
| `/admin/animais` | Animais de todos os clientes | Admin |
| `/admin/servicos` | Gestão de serviços | Admin |
| `/admin/agendamentos` | Gestão de agendamentos e pagamentos | Admin |
| `/admin/consultas` | Consultas veterinárias | Admin |

Um cliente que tenta abrir uma rota `/admin` é redirecionado para a própria área.

## Publicação (GitHub e Vercel)

1. Envie o projeto para um repositório no GitHub (com os arquivos na raiz do repositório).
2. Na [Vercel](https://vercel.com), use **Add New > Project** e importe o repositório.
3. O framework **Vite** é detectado automaticamente (build: `npm run build`, saída: `dist`). Não há variáveis de ambiente.
4. Clique em **Deploy**. A cada `git push`, a Vercel publica a nova versão sozinha.

## Limitações

- **Os dados ficam no navegador.** Cada navegador ou computador tem a sua própria "base de dados"; nada é compartilhado entre pessoas.
- **Segurança de demonstração.** As regras de permissão existem no código, mas, como tudo roda no navegador, uma pessoa técnica poderia alterar o `localStorage`. Em um sistema real, essa camada deve ficar em um servidor.
- O formulário de contato é apenas ilustrativo (não envia mensagens).
- Os dados de contato da clínica na página de contato são fictícios.

## Possíveis evoluções

- Mover `src/lib/api.ts` para um backend Node/Express com autenticação JWT
- Trocar o `localStorage` por PostgreSQL com Prisma (as telas já chamam funções isoladas, então quase não mudariam)
- Envio de e-mail/WhatsApp para confirmar agendamentos
- Agenda com horários disponíveis por profissional
- Upload de foto do animal e carteira de vacinação
