import { prisma } from '../../index.js'

const memberAdd = async (member) => {
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
}

export default memberAdd
