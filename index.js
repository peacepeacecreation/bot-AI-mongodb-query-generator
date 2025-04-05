
require('dotenv').config()
const { runAgent } = require('./agent')

const userText = 'Покажи мені всі збиткові трейди за березень'
runAgent(userText)
