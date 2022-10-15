import { EmbedBuilder } from 'discord.js'

const iconURL = 'https://cloud.mirailisc.me/s/3FTSq43bDcXXQeL/preview'

const failIntroduced = new EmbedBuilder()
  .setColor('#f55442')
  .setTitle('Failed!')
  .setDescription('User is already introduced')
  .setTimestamp()
  .setFooter({ text: '© 2022 Phubordin Poolnai', iconURL })

const successIntroduced = new EmbedBuilder()
  .setColor('#90f542')
  .setTitle('Success!')
  .setDescription('Your submission was received, Welcome to MiraCommunity!')
  .setTimestamp()
  .setFooter({ text: '© 2022 Phubordin Poolnai', iconURL })

export { successIntroduced, failIntroduced }
