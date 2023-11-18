import fs from "fs"
import path from "path"
import { logging } from "./utilities"
import { spawn } from "child_process"

const logsFolder = path.join(path.dirname(path.dirname(__dirname)), "logs")
if (!fs.existsSync(logsFolder)) {
    try {
        fs.mkdirSync(logsFolder)
    } catch (error) {
        logging("Error while creating the 'logs' folder at '"+ logsFolder + "'.","error")
    }
}
const now = new Date()
const logStream = fs.createWriteStream(path.join(logsFolder,`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}.log`))
const ls = spawn('ls', ['-lh', '/usr'])

ls.stdout.pipe(logStream)
ls.stderr.pipe(logStream)

ls.on('close', function (code) {
    console.log('child process exited with code ' + code);
  });