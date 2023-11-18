import ora from "ora"
import { Color, Ora } from "ora"
import { Console } from "console"
import path from "path"
import fs from "fs"

var logger: Console;

function initLogger() {
  const logsFolder = path.join(path.dirname(path.dirname(__dirname)), "logs")
  if (!fs.existsSync(logsFolder)) {
    try {
      fs.mkdirSync(logsFolder)
      logging("Created logs folder at: " + logsFolder, "success")
    } catch (error) {
      logging("Error while creating the 'logs' folder at '" + logsFolder + "'.", "error")
    }
  }
  const now = new Date()
  const logStream = fs.createWriteStream(path.join(logsFolder, `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}.log`))
  logger = new Console({
    stdout: logStream,
    stderr: logStream
  })
}

function stripAnsi(string: string): string {
  return string.replace(/[\x1b\x9b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, "")
}

const colors = {
  black: "\x1b[0;30m",
  red: "\x1b[0;31m",
  green: "\x1b[0;32m",
  brown: "\x1b[0;33m",
  blue: "\x1b[0;34m",
  purple: "\x1b[0;35m",
  cyan: "\x1b[0;36m",
  light_gray: "\x1b[0;37m",
  dark_gray: "\x1b[1;30m",
  light_red: "\x1b[1;31m",
  light_green: "\x1b[1;32m",
  yellow: "\x1b[0;33m",
  light_yellow: "\x1b[1;33m",
  light_blue: "\x1b[1;34m",
  light_purple: "\x1b[1;35m",
  light_cyan: "\x1b[1;36m",
  light_white: "\x1b[1;37m",
  bold: "\x1b[1m",
  faint: "\x1b[2m",
  italic: "\x1b[3m",
  underline: "\x1b[4m",
  blink: "\x1b[5m",
  negative: "\x1b[7m",
  crossed: "\x1b[9m",
  end: "\x1b[0m",
  bg_gray: "\x1b[100m"
};

export const ansi = (inputString) =>
  inputString.replace(/%([^%]+)%/g, (match, colorName) =>
    colors[colorName.toLowerCase()] ? colors[colorName.toLowerCase()] : match
  );

export function spinner(text: string, color: Color): Ora {
  const spin = ora({ text: text })
  spin.color = color
  spin.spinner = {
    interval: 80,
    frames: [
      "[    ]",
      "[=   ]",
      "[==  ]",
      "[=== ]",
      "[====]",
      "[ ===]",
      "[  ==]",
      "[   =]",
      "[    ]",
      "[   =]",
      "[  ==]",
      "[ ===]",
      "[====]",
      "[=== ]",
      "[==  ]",
      "[=   ]"
    ]
  }
  return spin
}

type LoggingType =
  | "info"
  | "success"
  | "warn"
  | "error"
  | "minimal";

function getCurrentFormattedTime(): string {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const hour = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const second = currentDate.getSeconds();
  const millisecond = currentDate.getMilliseconds();

  const formattedDay = padZero(day);
  const formattedHour = padZero(hour);
  const formattedMinute = padZero(minute);
  const formattedSecond = padZero(second);
  const formattedMillisecond = padZero(millisecond, 3); // Milliseconds need to have 3 digits

  const formattedString = `${formattedDay}-${formattedHour}-${formattedMinute}-${formattedSecond}-${formattedMillisecond}`;

  return formattedString;
}

function padZero(value, length = 2) {
  return String(value).padStart(length, '0');
}

export function logging(text: string, type: LoggingType, showInTerminal = true) {
  if (logger == null) {
    initLogger()
  }
  let output: string;
  const pre = `[${getCurrentFormattedTime()}]`
  if (showInTerminal) {
    switch (type) {
      case "info":
        console.log(`\x1b[1;34m\u2139 ${text}\x1b[0m`);
        logger.log(stripAnsi(`${pre} [INFO] ${text}`))
        break;
      case "success":
        console.log(`\x1b[1;32m✓ ${text}\x1b[0m`);
        logger.log(stripAnsi(`${pre} [INFO] ${text}`))
        break;
      case "warn":
        console.error(`\x1b[0;33m[WARN] ${text}\x1b[0m`);
        logger.warn(stripAnsi(`${pre} [WARN] ${text}`))
        break;
      case "error":
        console.error(`\x1b[1;31m✖ ${text}\x1b[0m`);
        logger.error(stripAnsi(`${pre} [ERROR] ${text}`))
        break;
      case "minimal":
        console.log(`\x1b[1;30m ${text}\x1b[0m`);
        logger.log(stripAnsi(`${pre} [min] ${text}`))
        break;
    }
  } else {
    switch (type) {
      case "info":
        logger.log(stripAnsi(`${pre} [INFO] ${text}`))
        break;
      case "success":
        logger.log(stripAnsi(`${pre} [INFO] ${text}`))
        break;
      case "warn":
        logger.warn(stripAnsi(`${pre} [WARN] ${text}`))
        break;
      case "error":
        logger.error(stripAnsi(`${pre} [ERROR] ${text}`))
        break;
      case "minimal":
        logger.log(stripAnsi(`${pre} [min] ${text}`))
        break;
    }
  }
}