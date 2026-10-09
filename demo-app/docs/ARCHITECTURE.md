# Architecture

Layered Express app:

```
routes -> controllers -> services -> models
```

- **routes**: HTTP endpoint wiring
- **controllers**: request/response handling
- **services**: business logic
- **models**: in-memory data storage (swap for a real DB later)
- **middleware**: cross-cutting concerns (logging, errors, 404)
