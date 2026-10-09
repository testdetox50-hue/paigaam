import { Item } from '../models/item.js';

export const itemService = {
  list: () => Item.all(),
  get: (id) => Item.find(Number(id)),
  create: (data) => Item.create(data),
  update: (id, data) => Item.update(Number(id), data),
  remove: (id) => Item.remove(Number(id)),
};
