const { verifiedRoleName } = require('../config.json')
const { log } = require('./logger')

module.exports = {
  assignVerifiedRole: async function updateMemberRole(member) {
    try {
      const roles = await member.guild.roles.fetch().then(roles => { return roles })
      const verifiedRole = roles.find(role => role.name.toLowerCase() === verifiedRoleName.toLowerCase())
      await member.roles.add(verifiedRole)
      log.info(`Role: \'${verifiedRole.name}\' has been added to member: \'${member.user.username}\'`)
    } catch (error) {d
      console.error(`Unable to update member roles for: ${member}`, error)
      log.error(`Unable to update member roles for: ${member}`, error)
      throw error
    }
  }
}