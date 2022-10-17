import { prisma } from '../../index.js'
import reply from '../../interactions/interactionReply.js'

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

  if (interaction.member.guild.ownerId !== interaction.user.id)
    return await reply(interaction, 'You dont have a permission to use this command', 3000)
  else if (isExist) {
    // return await reply(interaction, 'This server is already setup', 3000)
    await prisma.guild_info.update({
      where: {
        guildId,
      },
      data: {
        welcomeChannel: welcomeChannel.value,
        introduceChannel: introduceChannel.value,
        joinRole: joinRole.value,
        memberRole: memberRole.value,
      },
    })
    return await reply(interaction, 'Setup updated, Yotsuba is now ready to use!', 10000)
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

      return await reply(interaction, 'Setup completed, Yotsuba is now ready to use!', 10000)
    } catch (err) {
      console.log(err)
      return await reply(interaction, 'Setup Failed, Theres something wrong with the server!', 10000)
    }
  }
}

export { setup }
