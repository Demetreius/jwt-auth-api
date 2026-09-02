import express, { type Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import 'dotenv/config';
import authRoutes from './routes/auth.routes';
import SwaggerParser from '@apidevtools/swagger-parser';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const setupSwagger = async () => {
  try {
    const masterYamlPath = path.join(process.cwd(), 'docs/openapi.yaml');
    const swaggerDocument = await SwaggerParser.bundle(masterYamlPath);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('Swagger documentation loaded successfully from multiple files.');
  } catch (error) {
    console.error('Failed to load Swagger documentation:', error);
  }
};

setupSwagger();

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
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});