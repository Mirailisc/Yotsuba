import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js'
import { prisma } from '../index.js'
import { successIntroduced, failIntroduced } from './embed.js'

const introduction = async (interaction) => {
  if (interaction.member.roles.cache.some((role) => role.name === 'Novice')) {
    await interaction
      .reply({ content: `${interaction.user} Role are already assigned to you` })
      .then(() => setTimeout(() => interaction.deleteReply(), 5000))
      .catch((err) => console.log(err))
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

    await interaction.showModal(modal)
  }
}

const submission = async (interaction, context) => {
  if (interaction.customId === 'introduce') {
    // Values from Modal
    const name = interaction.fields.getTextInputValue('username')
    const age = interaction.fields.getTextInputValue('age')
    const guildFound = interaction.fields.getTextInputValue('guildFound')

    const isExist = await prisma.guild_user.findMany({
      where: {
        userId: interaction.user.id,
        guild_id: context.id,
      },
    })

    if (isExist.length !== 0) {
      interaction
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
      try {
        await prisma.guild_user.create({
          data: {
            userId: interaction.user.id,
            formName: name,
            formAge: parseInt(age),
            formFoundGuild: guildFound,
            guild_id: context.id,
          },
        })

        console.log(`Added ${interaction.user.username + '#' + interaction.user.discriminator} to Database`)

        const addRole = await interaction.guild.roles.cache.find((role) => role.id == context.memberRole)
        const rmRole = await interaction.guild.roles.cache.find((role) => role.id == context.joinRole)
        await interaction.member.roles.add(addRole)
        await interaction.member.roles.remove(rmRole)

        interaction
          .reply({
            embeds: [successIntroduced],
          })
          .then(() =>
            setTimeout(() => {
              interaction.deleteReply()
            }, 10000)
          )
          .catch((err) => console.log(err))
      } catch (err) {
        console.log(err)
      }
    }
  }
}

export { introduction, submission }
