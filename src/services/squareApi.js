const { fetch } = require('undici')
const { squareToken } = require('../config.json')

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
      const res = await fetch( customerSearchEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      return json?.customers
    } catch (error) {
      console.error(`Error attempting to query customer by email: ${email}`, error)
    }
  }
}