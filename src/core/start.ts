import { existsSync, writeFileSync } from "fs"
import { join, dirname } from "path"

try {
    if (!existsSync(join(join(dirname(dirname(__dirname))), ".env"))) {
        writeFileSync(join(join(dirname(dirname(__dirname))), ".env"), "BOT_TOKEN=\nCLIENT_ID=\nSOCKET_URL=")
        throw new Error("You did not have a .env in your project root. It has automatically been created. Please fill the mising variables.")
    }
} catch (error) {
    console.log(error)
}