import { Routes } from 'discord.js'
import { PrismaClient } from '@prisma/client'
import { TOKEN, CLIENT_ID, client, rest } from '../config.js'

// commands
import { introduction, submission } from './introduction/modal.js'
import { setup } from './setup/setup.js'
import { commands } from './command.js'

export const prisma = new PrismaClient()

// Register slash commands

client.once('ready', async () => {
  try {
    // Connect to Database
    await prisma.$connect()
    console.log('Prisma client is connected to the database!')

    // Initialize Discord bot
    client.user.setPresence({
      activities: [{ name: 'with Uesugi-san' }],
      status: 'dnd',
    })
    console.log(`I'll support you with everything I've got!`)
  } catch (err) {
    console.log(err)
  }
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

// Slash command handlers
client.on('interactionCreate', async (interaction) => {
  // Get Guild info from MongoDB
  const data = await prisma.guild_info.findUnique({
    where: {
      guildId: interaction.guildId,
    },
  })

  if (interaction.isChatInputCommand()) {
    // Server setup
    if (interaction.commandName === 'setup') return setup(interaction)

    // Call command
    if (interaction.commandName === 'call') {
      if (!data) await interaction.reply({ content: 'Server is not setup yet' })
      else {
        const calledUser = interaction.options.get('user')
        await interaction.reply({ content: `<@${calledUser.value}> มึงเป็นเหี้ยอะไรไอ้สัส` })
      }
    }

    // Introduction
    if (interaction.commandName === 'introduction') {
      if (!data) await interaction.reply({ content: 'Server is not setup yet' })
      else return introduction(interaction)
    }
  } else if (interaction.isModalSubmit()) return submission(interaction, data) // Introduction Submit Handler
})

// Auto role when join the guild
client.on('guildMemberAdd', async (member) => {
  const data = await prisma.guild_info.findUnique({
    where: {
      guildId: member.guild.id,
    },
  })

  if (!data) return
  else {
    const role = member.guild.roles.cache.find((role) => role.id == data.joinRole)
    member.roles.add(role.id)

    setTimeout(() => {
      member.guild.channels.cache.get(data.welcomeChannel).send(`:wave: Welcome <@${member.user.id}> to MiraCommunity.`)
      member.guild.channels.cache
        .get(data.welcomeChannel)
        .send('Please introduce yourself by using `/introduction` command')
    }, 2000)
  }
})

main()
client.login(TOKEN)
