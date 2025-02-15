const { REST, Routes } = require('discord.js');
const { clientId, guildId, botToken } = require('./config.json');

const { getCommands } = require('./get-commands.js');
const { log } = require('./services/logger');

const rest = new REST().setToken(botToken);

(async () => {
	const commands = getCommands('json');
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		log.info(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		log.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error('Unable to deploy commands guild: ', error);
		log.error('Unable to deploy commands guild: ', error);
	}
})();
