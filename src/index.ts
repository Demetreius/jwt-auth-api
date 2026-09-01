import express, { type Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import authRoutes from './routes/auth.routes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Mobile Auth API is running smoothly!',
    data: null,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});