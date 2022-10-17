import { introduction, submission } from '../commands/introduction/index.js'
import { setup } from '../commands/setup/index.js'
import { prisma } from '../index.js'
import { call } from '../commands/call/index.js'

const interactionCreate = async (interaction) => {
  // Get Guild info from MongoDB
  const data = await prisma.guild_info.findUnique({
    where: {
      guildId: interaction.guildId,
    },
  })

  if (interaction.isChatInputCommand()) {
    // Commands
    switch (interaction.commandName) {
      case 'setup':
        return setup(interaction, data)
      case 'call':
        return call(interaction, data)
      case 'introduction':
        if (!data) await interaction.reply({ content: 'Server is not setup yet' })
        else return introduction(interaction, data)
    }
  } else if (interaction.isModalSubmit()) {
    switch (interaction.customId) {
      case 'introduce':
        return submission(interaction, data)
    }
  }
}

export default interactionCreate
