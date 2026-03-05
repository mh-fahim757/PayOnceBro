import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Auth routes
app.use('/api/auth', authRoutes);

app.use(errorHandler);
export default app;
