const { existsSync, copyFileSync } = require("fs")
const { join, dirname } = require("path")

try {
    if (!existsSync(join(dirname(__dirname), ".env"))) {
        copyFileSync(join(__dirname, "assets/.env.template"), join(dirname(__dirname),".env"))
        console.log("\x1b[0;31mYou did not have a .env in your project root. It has automatically been created. Please fill the mising variables.\x1b[0m")
        process.exit(1)
    }
} catch (error) {
    console.log(error)
}