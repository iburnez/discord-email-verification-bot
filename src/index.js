const { Client, Events, GatewayIntentBits, MessageFlags } = require('discord.js')

const { adminRoleName, botToken, guildId, verificationChannelId } = require('./config')
const { log } = require('./services/logger')
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
client.login(botToken)

client.on('ready', (c) => {
  console.log(`Logged in as ${c.user.tag}!`)
  log.info(`Logged in as ${c.user.tag}!`)
})

client.on(Events.GuildMemberAdd, (member) => {
  try {
    const verificationChannel = member.guild.channels.cache.find(channel => channel.id === verificationChannelId)

    if(verificationChannel) {
      verificationChannel.send(`Welcome to NavTech, <@${member?.id}>! This server requires a paid subscription. \n` +
        `To verify your subscription please reply with your email address.`)
    } else {
      console.log(`Unable to find channelId: ${verificationChannelId}`)
      log.info(`Unable to find channelId: ${verificationChannelId}`)
    }
  } catch (error) {
    console.error(`Unable to post welcome message: `, error)
    log.error(`Unable to post welcome message: `, error)
  }
})

client.on(Events.MessageCreate, async (message) => {
  if(message.channelId !== verificationChannelId) return
  if(!message.author.bot) {
    try {
      if(isValidEmail(message.content)) {
        const attempts = getAttemptInfo(message.author.id)
        if(attempts.remaining == 0) {
          await message.reply({
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
          await assignVerifiedRole(member)
          console.log(`User @${member.user.username} has been verified! Welcome to NavTech!`)
          log.info(`User @${member.user.username} has been verified! Welcome to NavTech!`)
          await message.delete()
        } else {
          await message.reply({
            content: `The email address provided is not associated with an active subscription.`,
            withResponse: true
          })
        }
      } else {
        await message.reply(`\'${message.content}\' is not a valid email address. Please enter a valid email address.`)
      }
    } catch (error) {
      console.error('Unable to process user verification attempt: ', error)
      log.error('Unable to process user verification attempt: ', error)
      await interaction.reply({
        content: `Unable to process user verification attempt. Error ${error}`,
        withResponse: true
      })
    }
  }
})

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (!interaction.isChatInputCommand() && interaction.commandName != 'verify') return
    const isAdmin = interaction.member.roles.cache.some(role => role.name.toLowerCase() === adminRoleName.toLowerCase())
    if (isAdmin) {
      const command = interaction.client.commands.get(interaction.commandName)
      await handleCommand(interaction, command)
    } else {
      await interaction.reply({
        content: `You do not have permission to use the /verify command.`,
        flags: MessageFlags.Ephemeral
      })
    }
  } catch (error) {
    console.error('Unable to process command: ', error)
    log.error('Unable to process command: ', error)
    await interaction.reply({
      content: `Unable to process command. Error ${error}`,
      flags: MessageFlags.Ephemeral
    })
  }
})