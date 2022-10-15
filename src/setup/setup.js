import { prisma } from '../index.js'

const setup = async (interaction) => {
  const welcomeChannel = interaction.options.get('welcome-channel')
  const introduceChannel = interaction.options.get('introduce-channel')
  const joinRole = interaction.options.get('join-role')
  const memberRole = interaction.options.get('member-role')

  const guildId = await interaction.guildId

  const isExist = await prisma.guild_info.findUnique({
    where: {
      guildId,
    },
  })

  if (isExist) {
    await interaction.reply({ content: 'This server is already setup' })
  } else {
    console.log(`initialized setup server for '${interaction.member.guild.name}'`)

    try {
      await prisma.guild_info.create({
        data: {
          welcomeChannel: welcomeChannel.value,
          introduceChannel: introduceChannel.value,
          joinRole: joinRole.value,
          memberRole: memberRole.value,
          guildId,
        },
      })

      await interaction
        .reply({ content: 'Setup completed, Yotsuba is now ready to use!' })
        .then(() =>
          setTimeout(() => {
            interaction.deleteReply()
          }, 10000)
        )
        .catch((err) => console.log(err))
    } catch (err) {
      console.log(err)
      await interaction
        .reply({ content: 'Setup Failed, Theres something wrong with the server!' })
        .then(() =>
          setTimeout(() => {
            interaction.deleteReply()
          }, 10000)
        )
        .catch((err) => console.log(err))
    }
  }
}

export { setup }
