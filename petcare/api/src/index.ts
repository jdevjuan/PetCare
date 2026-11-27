
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swagger from 'swagger-ui-express';

import { router, paths } from './routes/index';
import { identify } from './services/auth';

if (!process.env.JWT_SECRET) {
  throw new Error('Configure JWT_SECRET no .env');
}

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
  })
);

app.use(express.json());

app.use(
  '/docs',
  swagger.serve,
  swagger.setup({
    openapi: '3.0.3',
    info: {
      title: 'PetCare API',
      version: '1.0.0',
    },
    paths,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  })
);

app.use('/api', identify, router);

app.use((req, res) => {
  res.status(404).json({
    message: 'Rota não encontrada.',
  });
});

app.use((err: any, req: any, res: any, next: any) => {
  if (err.code === 'P2002') {
    return res.status(400).json({
      message: 'Valor já cadastrado.',
      errors: Object.fromEntries(
        (err.meta?.target ?? ['campo']).map((key: string) => [
          key,
          ['Valor já cadastrado.'],
        ])
      ),
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      message: 'Registro não encontrado.',
    });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      message: 'Relacionamento inválido ou registro em uso.',
    });
  }

  if (err.status) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    message: 'Erro interno.',
  });
});

// Exportação para o Vercel
export default app;

// Inicialização local
if (process.env.VERCEL !== '1') {
  const port = Number(process.env.PORT || 3001);

  app.listen(port, () => {
    console.log(`PetCare API /docs - porta ${port}`);
  });
}
