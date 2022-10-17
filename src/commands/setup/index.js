import { EmbedBuilder } from 'discord.js'
import { prisma } from '../../index.js'
import reply from '../../interactions/interactionReply.js'
const iconURL = 'https://cloud.mirailisc.me/s/3FTSq43bDcXXQeL/preview'

const setup = async (interaction) => {
  const welcomeChannel = interaction.options.get('welcome-channel')
  const introduceChannel = interaction.options.get('introduce-channel')
  const joinRole = interaction.options.get('join-role')
  const memberRole = interaction.options.get('member-role')

  const guildId = await interaction.guildId

  console.log(`Starting setup server for ${interaction.member.guild.name}`)

  if (interaction.user.id !== interaction.member.guild.ownerId) {
    return reply(interaction, 'You are not allowed to use this command', 10000)
  } else {
    await prisma.guild_info
      .upsert({
        where: {
          guildId,
        },
        update: {
          welcomeChannel: welcomeChannel.value,
          introduceChannel: introduceChannel.value,
          joinRole: joinRole.value,
          memberRole: memberRole.value,
        },
        create: {
          welcomeChannel: welcomeChannel.value,
          introduceChannel: introduceChannel.value,
          joinRole: joinRole.value,
          memberRole: memberRole.value,
          guildId,
        },
      })
      .catch(async (err) => {
        const embed = new EmbedBuilder()
          .setColor('#f55442')
          .setTitle('Failed!')
          .setThumbnail(interaction.member.guild.iconURL({ dynamic: true }))
          .setDescription('There is a problem with the server. Please try again later.')
          .setTimestamp()
          .setFooter({ text: '© 2022 Phubordin Poolnai', iconURL })
        await interaction
          .reply({ embeds: [embed] })
          .then(() =>
            setTimeout(() => {
              interaction.deleteReply()
            }, 10000)
          )
          .catch((err) => console.log(err))
        return console.log(err)
      })
    const embed = new EmbedBuilder()
      .setColor('#90f542')
      .setTitle('Success!')
      .setThumbnail(interaction.member.guild.iconURL({ dynamic: true }))
      .setDescription('Yotsuba is ready to use!')
      .setTimestamp()
      .setFooter({ text: '© 2022 Phubordin Poolnai', iconURL })

    console.log(`${interaction.member.guild.name} Setup completed!`)
    return await interaction
      .reply({ embeds: [embed] })
      .then(() =>
        setTimeout(() => {
          interaction.deleteReply()
        }, 10000)
      )
      .catch((err) => console.log(err))
  }
}

export { setup }
