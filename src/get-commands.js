const fs = require('node:fs')
const path = require('node:path')
const { Collection } = require('discord.js')

const { log } = require('./services/logger')

const commandsColletion = new Collection()
const commandsJson = []

module.exports = {
  getCommands : (format) => {
    try {
      if(commandsJson.length == 0) {
        const foldersPath = path.join(__dirname, 'commands')
        const commandFolders = fs.readdirSync(foldersPath)
        for (const folder of commandFolders) {
          // Grab all the command files from the commands directory you created earlier
          const commandsPath = path.join(foldersPath, folder)
          const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
          // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
          for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const command = require(filePath)
            if ('data' in command && 'execute' in command) {
              commandsJson.push(command.data.toJSON())
              commandsColletion.set(command.data.name, command)
            } else {
              console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
              log.error(`The command at ${filePath} is missing a required "data" or "execute" property.`)
            }
          }
        }
      }
      if(format == 'json') {
        return commandsJson
      } else {
        return commandsColletion
      }
    } catch (error) {
      console.error('Error getting guild commands: ', error)
      log.error('Error getting guild commands: ', error)
    }
  }
}
