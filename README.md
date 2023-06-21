![ArgoCD](https://argocd.mirailisc.me/api/badge?name=yotsuba)

# Yotsuba

a utility bot for my discord server

## Prerequisite
- Node v16
- MongoDB
- Discord Application & Bot

## Setup
run this command
```bash
pnpm install && pnpm run prisma:generate
```

### Environment

Create `.env` and copy this

```env
DISCORD_TOKEN=<your_discord_bot_token>
CLIENT_ID=<your_discord_application_id>
DATABASE_URL=<your_database_url>
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

You can find discord token and application id at
https://discord.com/developers/applications/
