module.exports = {
  assignVerifiedRole: async function updateMemberRole(member) {
    try {
      const roles = await member.guild.roles.fetch().then(roles => { return roles })
      const verifiedRole = roles.find(role => role.name.toLowerCase() === 'verified')
      member.roles.add(verifiedRole)

      const unverifiedRole = roles.find(role => role.name.toLowerCase() === 'unverified')
      member.roles.remove(unverifiedRole)
    } catch (error) {d
      console.error(`Unable to update member roles for: ${member}`, error)
      throw error
    }
  }
}