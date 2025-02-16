const attemptsRemainingByUserId = new Map()
const timeoutsByUserId = new Map()
const MAX_ATTEMPTS = 3

const { log } = require('./logger')

//TODO: Update this so when attempts remaining == 0 it starts the timeout and does not allow user 
//to attempt again until timeout is complete
module.exports = {
  getAttemptInfo: (userId) => {
    try {
      trackAttempt(userId)

      if(attemptsRemainingByUserId.get(userId) <= 0) {
        if(!timeoutsByUserId.has(userId)) {
          const fiveMin = 300000
          setTimeout(() => {
            timeoutsByUserId.delete(userId)
            attemptsRemainingByUserId.delete(userId)
          }, fiveMin)
          timeoutsByUserId.set(userId, Date.now() + fiveMin)
        }
      }
      return {
        remaining: attemptsRemainingByUserId.get(userId),
        timeout: getTimeUntilNextAttempt( timeoutsByUserId.get(userId) )
      }
    } catch (error) {
      console.error('Error tracking users verification attempts: ', error)
      log.error('Error tracking users verification attempts: ', error)
    }
  }
}

function trackAttempt(userId) {
  if(!attemptsRemainingByUserId.has(userId)) {
    attemptsRemainingByUserId.set(userId, MAX_ATTEMPTS)
  } else {
    let attempts = attemptsRemainingByUserId.get(userId)
    if(attempts > 0) {
      attemptsRemainingByUserId.set(userId, --attempts)
    }
  }
}

function getTimeUntilNextAttempt(timeoutMs) {
  if(!timeoutMs) return '0:00'
  let timeRemainingMs = timeoutMs - Date.now()
  let minRemaining = Math.floor(timeRemainingMs / 60000)
  let secRemaining = Math.floor((timeRemainingMs % 60000) / 1000)
  secRemaining = secRemaining < 10 ? `0${secRemaining}` : secRemaining
  return `${minRemaining}:${secRemaining}`
}