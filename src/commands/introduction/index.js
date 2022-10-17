import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js'
import { prisma } from '../../index.js'
import { successIntroduced, failIntroduced } from './embed.js'
import reply from '../../interactions/interactionReply.js'
const introduction = async (interaction, context) => {
  if (interaction.channelId !== context.introduceChannel) {
    return await reply(
      interaction,
      `You used a command in the wrong channel. Please go to <#${context.introduceChannel}> and try again`,
      10000
    )
  } else {
    if (interaction.member.roles.cache.some((role) => role.id === context.memberRole)) {
      return await reply(interaction, `${interaction.user} Role are already assigned to you`, 10000)
    } else {
      const modal = new ModalBuilder().setCustomId('introduce').setTitle('Introduction')
      const nameInput = new TextInputBuilder()
        .setCustomId('username')
        .setLabel("What's your name?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder('Enter your name')

      const ageInput = new TextInputBuilder()
        .setCustomId('age')
        .setLabel('How old are you?')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder('Enter your age')

      const hobbiesInput = new TextInputBuilder()
        .setCustomId('guildFound')
        .setLabel('How did you find this server?')
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(256)

      const row1 = new ActionRowBuilder().addComponents(nameInput)
      const row2 = new ActionRowBuilder().addComponents(ageInput)
      const row3 = new ActionRowBuilder().addComponents(hobbiesInput)
      modal.addComponents(row1, row2, row3)

      return await interaction.showModal(modal)
    }
  }
}

const submission = async (interaction, context) => {
  // Values from Modal
  const name = interaction.fields.getTextInputValue('username')
  const age = interaction.fields.getTextInputValue('age')
  const guildFound = interaction.fields.getTextInputValue('guildFound')

  const isExist = await prisma.guild_user
    .findMany({
      where: {
        userId: interaction.user.id,
        guild_id: context.id,
      },
    })
    .catch((err) => console.log(err))

  if (isExist.length !== 0) {
    return interaction
      .reply({
        embeds: [failIntroduced],
      })
      .then(() =>
        setTimeout(() => {
          interaction.deleteReply()
        }, 10000)
      )
      .catch((err) => console.log(err))
  } else {
    const guildId = await interaction.guildId
    const userId = await interaction.user.id
    await prisma.guild_user
      .create({
        data: {
          userId,
          formName: name,
          formAge: parseInt(age),
          formFoundGuild: guildFound,
          guild_id: guildId,
        },
      })
      .catch((err) => console.log(err))

    console.log(`Added ${interaction.user.username + '#' + interaction.user.discriminator} to Database`)

    const addRole = await interaction.guild.roles.cache.find((role) => role.id === context.memberRole)
    const rmRole = await interaction.guild.roles.cache.find((role) => role.id === context.joinRole)
    await interaction.member.roles.add(addRole)
    await interaction.member.roles.remove(rmRole)

    return interaction
      .reply({
        embeds: [successIntroduced],
      })
      .then(() =>
        setTimeout(() => {
          interaction.deleteReply()
        }, 10000)
      )
      .catch((err) => console.log(err))
  }
}

export { introduction, submission }
