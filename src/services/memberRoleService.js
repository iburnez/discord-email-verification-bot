const { verifiedRoleName } = require('../config.json')
module.exports = {
  assignVerifiedRole: async function updateMemberRole(member) {
    try {
      const roles = await member.guild.roles.fetch().then(roles => { return roles })
      const verifiedRole = roles.find(role => role.name.toLowerCase() === verifiedRoleName.toLowerCase())
      member.roles.add(verifiedRole)
    } catch (error) {d
      console.error(`Unable to update member roles for: ${member}`, error)
      throw error
    }
  }
}