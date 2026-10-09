import test from 'node:test';
import assert from 'node:assert';
import { createApp } from '../src/app.js';

test('items CRUD flow', async () => {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://localhost:${port}/api/items`;

  const created = await (await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Widget' }),
  })).json();
  assert.strictEqual(created.name, 'Widget');

  const fetched = await (await fetch(`${base}/${created.id}`)).json();
  assert.strictEqual(fetched.id, created.id);

  const del = await fetch(`${base}/${created.id}`, { method: 'DELETE' });
  assert.strictEqual(del.status, 204);

  server.close();
});
