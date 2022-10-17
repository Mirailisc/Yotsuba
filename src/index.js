import { Routes } from 'discord.js'
import { PrismaClient } from '@prisma/client'
import { TOKEN, CLIENT_ID, client, rest } from '../config.js'

// commands
import { commands } from './commands/command.js'

// functions
import interactionCreate from './interactions/interactionCreate.js'
import memberAdd from './commands/memberAdd/index.js'

export const prisma = new PrismaClient()

// Register slash commands

client.once('ready', async () => {
  // Connect to Database
  await prisma.$connect()
  console.log('Prisma client is connected to the database!')

  // Initialize Discord bot
  client.user.setPresence({
    activities: [{ name: 'with Uesugi-san' }],
    status: 'dnd',
  })
  console.log(`I'll support you with everything I've got!`)
})

client.on('interactionCreate', (interaction) => {
  interactionCreate(interaction)
})

client.on('guildMemberAdd', (member) => {
  memberAdd(member)
})

async function main() {
  try {
    console.log('Started refreshing application (/) commands.')
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
      body: commands,
    })
  } catch (err) {
    console.log(err)
  }
}

main()
client.login(TOKEN)
