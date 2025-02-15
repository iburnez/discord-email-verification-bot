const { MessageFlags } = require('discord.js')
const { log } = require('../services/logger')

module.exports = {
  handleCommand : async (interaction, command) => {
    try {
      if (!command) {
        log.error(`No command matching ${interaction.commandName} was found.`)
        console.error(`No command matching ${interaction.commandName} was found.`)
        await interaction.followUp({ content: `No command matching ${interaction.commandName} was found.`, flags: MessageFlags.Ephemeral })
        return
      }
      await command.execute(interaction)
    } catch (error) {
      console.error('An error occurred while executing a command: ', error)
      log.error('An error occurred while executing a command: ', error)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral })
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral })
      }
    }
  }
}