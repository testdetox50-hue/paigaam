import { Router } from 'express';
import { itemRoutes } from './itemRoutes.js';
import { healthRoutes } from './healthRoutes.js';

export const routes = Router();

routes.use('/health', healthRoutes);
routes.use('/items', itemRoutes);
