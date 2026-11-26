# PetCare

Site de clínica veterinária e pet shop (projeto acadêmico de Desenvolvimento Web).

**Stack:** React + TypeScript + Vite + Tailwind CSS + React Router + Zod.

> Versão simplificada para publicar direto na Vercel: **não tem servidor nem banco externo**.
> Os dados (usuários, animais, agendamentos...) ficam salvos no `localStorage` do navegador.
> Cada navegador/computador tem os seus próprios dados.

## Como rodar no seu PC

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Como publicar

```bash
npm run build
```

O resultado fica na pasta `dist/`. Na Vercel, basta importar o repositório do GitHub (o framework Vite é detectado automaticamente). O arquivo `vercel.json` garante que o React Router funcione ao recarregar a página.

## Como usar

1. Acesse **Criar conta**. **O primeiro cadastro vira administrador** (não existe senha padrão).
2. Os próximos cadastros são **clientes**.
3. Cliente: cadastra animais, agenda serviços, acompanha o status e vê o histórico.
4. Administrador: gerencia serviços, confirma/cancela agendamentos, registra consultas e pagamentos.

Para zerar os dados: login como administrador > Painel > **Restaurar dados iniciais**.

## Estrutura

```
src/
  lib/          storage.ts (dados), api.ts (regras e permissões), validators.ts (Zod), format.ts
  context/      AuthContext (login), ToastContext (mensagens)
  components/   layouts, rotas protegidas e componentes visuais
  pages/        public/, client/ e admin/
```

## Observação de segurança

Como tudo roda no navegador, esta versão é uma **demonstração**: as regras de permissão existem no código (`src/lib/api.ts`), mas um usuário técnico consegue alterar o `localStorage` do próprio navegador. Para um produto real, o ideal é mover `api.ts` para um backend (Node/Express + banco de dados).
