# API Reference

## Health

`GET /api/health` — returns `{ status: "ok", uptime }`

## Items

- `GET /api/items` — list all items
- `GET /api/items/:id` — get one item
- `POST /api/items` — create item, body: `{ name }`
- `PUT /api/items/:id` — update item
- `DELETE /api/items/:id` — delete item
