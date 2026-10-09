import { itemService } from '../services/itemService.js';

export const itemController = {
  list: (req, res) => res.json(itemService.list()),

  get: (req, res) => {
    const item = itemService.get(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  },

  create: (req, res) => {
    const item = itemService.create(req.body);
    res.status(201).json(item);
  },

  update: (req, res) => {
    const item = itemService.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  },

  remove: (req, res) => {
    const removed = itemService.remove(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Item not found' });
    res.status(204).end();
  },
};
