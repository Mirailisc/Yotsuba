const call = async (interaction, context) => {
  if (!context) await interaction.reply({ content: 'Server is not setup yet' })
  else {
    const calledUser = interaction.options.get('user')
    await interaction.reply({ content: `<@${calledUser.value}> มึงเป็นเหี้ยอะไรไอ้สัส` })
  }
}

export { call }
