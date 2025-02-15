const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { clientId, guildId, botToken } = require('./config.json')
const { log } = require('./services/logger')

const rest = new REST({ version: '9' }).setToken(botToken)
const commandId = '1340443902074683403' //verify commandId

rest.delete(Routes.applicationGuildCommand(clientId, guildId, commandId))
	.then(() => {
		console.log('Successfully deleted guild command')
		log.info('Successfully deleted guild command')
	})
	.catch( err => {
		console.error('Unable to delete commands from guild: ', err)
		log.error('Unable to delete commands from guild: ', err)
	})

// // for global commands
// rest.delete(Routes.applicationCommand(clientId, "commandId"))
// 	.then(() => console.log('Successfully deleted application command'))
// 	.catch(console.error)
