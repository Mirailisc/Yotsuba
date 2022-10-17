function reply(interaction, message, timeout) {
  return interaction
    .reply({ content: message ?? null })
    .then(() =>
      setTimeout(() => {
        interaction.deleteReply()
      }, timeout ?? 0)
    )
    .catch((err) => console.log(err))
}

export default reply
