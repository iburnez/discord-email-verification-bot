const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { assignVerifiedRole } = require('../../services/memberRoleService')

const { log } = require('../../services/logger')

module.exports = {
  data : new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your email address.'),
  async execute(interaction) {
    let res
    try {
      const unverifiedMembers = await getUnverifiedGuildMembers(interaction)

      if(unverifiedMembers.size === 0) {
        await interaction.reply('No unverified users found.')
        return
      }

      const options = []
      for(const member of unverifiedMembers.values()) {
        const label = member.user.globalName ?? member.user.username
        const option = new StringSelectMenuOptionBuilder()
          .setLabel(label)
          .setDescription(member.user.username)
          .setValue(member.user.username)
        options.push(option)
      }

      const userSelect = new  StringSelectMenuBuilder()
        .setCustomId('starter')
        .setPlaceholder('Make a selection!')
        .addOptions(options)

      const userRow = new ActionRowBuilder().addComponents(userSelect)

      res = await interaction.reply({
        content: 'Please select the users you would like to verify.',
        components: [userRow],
        withResponse: true
      })

      try {
        const collectorFilter = i => i.user.id === interaction.user.id;
        const result = await res.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
        const selectedMember = unverifiedMembers.values().find(member => {
          if( member.user.username.toLowerCase() === result.values[0].toLowerCase() ) {
            return  member
          }
        })
        assignVerifiedRole(selectedMember)
        await result.update({ content: `User <@${selectedMember.id}> has been verified`, components: [] });
      } catch (error) {
        await interaction.editReply({ content: 'No member selected to verify within 30s, cancelling...', components: [] });
      }
    } catch ( error ) {
      console.log('Error in verification component: ', error)
      log.error('Error in verification component: ', error)
      await interaction.reply( 'An error occured in the verification component: ' + error )
    }
  }
}

async function getUnverifiedGuildMembers(interaction) {
  const guildMembers = await interaction.guild.members.fetch()
  const unverifiedMembers = await guildMembers.filter(member => {
    if(member.roles.cache.size === 1) {
      let isUnverified = false
      for(const role of member.roles.cache.values()) {
        isUnverified = role.name === '@everyone' 
      }
      return isUnverified
    }
    return false
  })
  return unverifiedMembers
}