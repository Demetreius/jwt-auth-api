import type { Application } from "express";
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import SwaggerParser from '@apidevtools/swagger-parser';


export const setupSwagger = async (app: Application) => {
  try {
    const masterYamlPath = path.join(process.cwd(), 'docs/openapi.yaml');
    const swaggerDocument = await SwaggerParser.bundle(masterYamlPath);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (error) {
    console.error('Failed to load Swagger documentation:', error);
  }
};