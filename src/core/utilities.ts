import ora, { Options } from "ora"
import { Color, Ora } from "ora"

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
export function logging(text: string, type: LoggingType) {
  switch (type) {
    case "info": console.log(ansi(`%light_blue%\u2139 ${text}%end%`)); break;
    case "success": console.log(ansi(`%light_green%✓ ${text}%end%`)); break;
    case "warn": console.error(ansi(`%yellow%[WARN] ${text}%end%`)); break;
    case "error": console.error(ansi(`%light_red%✖ ${text}%end%`)); break;
    case "minimal": console.log(ansi(`%dark_gray% ${text}%end%`)); break;
  }
}