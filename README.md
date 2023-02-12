# Yotsuba
a utility bot for my discord server

## Setup
### Dependencies
```bash
pnpm install
```

### Prisma
```bash
pnpm run prisma:generate
```

### Environment
```env
DISCORD_TOKEN=
CLIENT_ID=
DATABASE_URL=
```

## Development
```bash
pnpm run dev
```

## Production
**In `main` branch, production was handled by pipelines**
```bash
pnpm start
```