let items = [];
let nextId = 1;

export const Item = {
  all: () => items,
  find: (id) => items.find((i) => i.id === id),
  create: (data) => {
    const item = { id: nextId++, ...data };
    items.push(item);
    return item;
  },
  update: (id, data) => {
    const item = Item.find(id);
    if (!item) return null;
    Object.assign(item, data);
    return item;
  },
  remove: (id) => {
    const before = items.length;
    items = items.filter((i) => i.id !== id);
    return items.length < before;
  },
};
