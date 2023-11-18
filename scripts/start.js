const { existsSync, copyFileSync } = require("fs")
const { join, dirname } = require("path")

try {
    if (!existsSync(join(dirname(__dirname)), ".env")) {
        copyFileSync(join(__dirname, "assets/.env.template"), join(dirname(__dirname),".env"))
        throw new Error("You did not have a .env in your project root. It has automatically been created. Please fill the mising variables.")
    }
} catch (error) {
    console.log(error)
}