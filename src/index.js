const { Client, Events, GatewayIntentBits, MessageFlags } = require('discord.js')

const { adminRoleName, discordToken, guildId, verificationChannelId } = require('./config')
const { getCommands } = require('./get-commands')
const { handleCommand } = require('./handlers/commandHandler')
const { isValidEmail } = require('./services/emailValidation')
const { searchCustomer } = require('./services/squareApi')
const { assignVerifiedRole } = require('./services/memberRoleService')
const { getAttemptInfo } = require('./services/rateLimiter')

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
})

client.commands = getCommands()
client.login(discordToken)

client.on('ready', (c) => {
  console.log(`Logged in as ${c.user.tag}!`)
})

client.on(Events.GuildMemberAdd, (member) => {
  try {
    const verificationChannel = member.guild.channels.cache.find(channel => channel.id === verificationChannelId)

    if(verificationChannel) {
      verificationChannel.send(`Welcome to NavTech, <@${member?.id}>! This server requires a paid subscription. \n` +
        `To verify your subscription please reply with your email address.`)
    } else {
      console.log(`Unable to find channelId: ${verificationChannelId}`)
    }
  } catch (error) {
    console.error(`Unable to post welcome message: `, error)
  }
})

client.on(Events.MessageCreate, async (message) => {
  if(message.channelId !== verificationChannelId) return
  if(!message.author.bot) {
    try {
      if(isValidEmail(message.content)) {
        const attempts = getAttemptInfo(message.author.id)
        if(attempts.remaining == 0) {
          message.reply({
            content: `You have exceeded the maximum number of attempts.\n `
                    + `Please try again in ${attempts.timeout} minutes.`,
            withResponse: true
          })
          return
        }

        const customers = await searchCustomer(message.content.trim())
        const customerFound = customers?.length > 0

        if(customerFound) {
          const member = client.guilds.cache.get(guildId).members.cache.get(message.author.id)
          assignVerifiedRole(member)
          message.reply({
            content: `User <@${member.id}> has been verified! Welcome to NavTech!`,
            withResponse: true
          })
        } else {
          message.reply({
            content: `The email address provided is not associated with a subscription.\n`
                    + `You have ${attempts.remaining} remaining.`,
            withResponse: true
          })
        }
      } else {
        message.reply(`\'${message.content}\' is not a valid email address. Please enter a valid email address.`)
      }
    } catch (error) {
      console.error('Unable to process user verification attempt: ', error)
      interaction.reply({
        content: `Unable to process user verification attempt. Error ${error}`,
        withResponse: true
      })
    }
  }
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand() && interaction.commandName != 'verify') return
	const isAdmin = interaction.member.roles.cache.some(role => role.name.toLowerCase() === adminRoleName.toLowerCase())
	if (isAdmin) {
    const command = interaction.client.commands.get(interaction.commandName)
    handleCommand(interaction, command)
	} else {
    await interaction.reply({
      content: `You do not have permission to use the /verify command.`,
      flags: MessageFlags.Ephemeral
    })
  }
})