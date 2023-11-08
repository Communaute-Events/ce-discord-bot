import "dotenv/config"
import { ansi } from "./utilities";
console.log(ansi(`%light_green%https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=applications.commands%20bot`))
console.log(ansi("%end%"))