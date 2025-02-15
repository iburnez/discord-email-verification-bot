const { got } = require('got')
const { squareToken } = require('../config.json')
const { log } = require('./logger')

const squareUrl = 'https://connect.squareup.com/v2'
const customerSearchEndpoint = squareUrl + '/customers/search'

module.exports = {
  searchCustomer : async (email) => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + squareToken,
        'Content-Type': 'application/json'
      }
      const payload = {
        "query": {
          "filter": {
            "email_address": {
              "exact": email
            }
          }
        }
      }
      const res = await got( customerSearchEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      }).json()
      return res?.customers
    } catch (error) {
      console.error(`Error attempting to query customer by email: ${email}`, error)
      log.error(`Error attempting to query customer by email: ${email}`, error)
    }
  }
}