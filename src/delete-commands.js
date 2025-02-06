const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { clientId, guildId, discordToken } = require('./config.json')

const rest = new REST({ version: '9' }).setToken(discordToken)
const commandId = '1337969939742457937' //verify commandId

rest.delete(Routes.applicationGuildCommand(clientId, guildId, commandId))
	.then(() => console.log('Successfully deleted guild command'))
	.catch( err => console.error('Unable to delete commands from guild: ', err))

// // for global commands
// rest.delete(Routes.applicationCommand(clientId, "commandId"))
// 	.then(() => console.log('Successfully deleted application command'))
// 	.catch(console.error)
