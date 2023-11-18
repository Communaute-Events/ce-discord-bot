// Reads your config and logs a link to invite your bot

require("dotenv").config()
console.log(`\x1b[1;32mhttps://discord.com/api/oauth2/authorize?clientId=${process.env.clientId}&permissions=8&scope=applications.commands%20bot\x1b[0m`)