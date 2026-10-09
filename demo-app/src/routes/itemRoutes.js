import { Router } from 'express';
import { itemController } from '../controllers/itemController.js';

export const itemRoutes = Router();

itemRoutes.get('/', itemController.list);
itemRoutes.get('/:id', itemController.get);
itemRoutes.post('/', itemController.create);
itemRoutes.put('/:id', itemController.update);
itemRoutes.delete('/:id', itemController.remove);
