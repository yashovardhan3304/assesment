import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { toursRouter } from './routes/tours';
import { uploadsRouter } from './routes/uploads';
import path from 'path';

const app = express();

const allowedOrigins = process.env.CORS_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean);
app.use(cors(allowedOrigins && allowedOrigins.length ? { origin: allowedOrigins } : undefined));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRouter);
app.use('/api/tours', toursRouter);
app.use('/api/upload', uploadsRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});


