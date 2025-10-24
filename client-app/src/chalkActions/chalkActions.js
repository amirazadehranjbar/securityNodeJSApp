import chalk from 'chalk';
// import fs from 'fs';

export const ChalkActions = ({ level = 'info', textColor = 'white', bgColor = 'bgBlue', message }) => {
    const colorMap = {
        info: { text: 'white', bg: 'bgBlue' },
        warn: { text: 'yellow', bg: 'bgYellow' },
        error: { text: 'red', bg: 'bgRed' },
    };

    const effectiveTextColor = chalk[textColor] || chalk[colorMap[level].text];
    const effectiveBgColor = chalk[bgColor] || chalk[colorMap[level].bg];

    const safeMessage = typeof message === 'string'
        ? message.replace(/password\s*=\s*[^,]+/gi, 'password = [HIDDEN]')
        : message;

    const icon = level === 'info' ? '✅' : level === 'warn' ? '⚠️' : '❌';
    const logMessage = `${icon} [${level.toUpperCase()}] [${new Date().toISOString()}] ${safeMessage}`;

    console.log(effectiveBgColor(effectiveTextColor.bold(logMessage)));

    // fs.appendFileSync('logs.txt', logMessage + '\n');

};
//
// ChalkActions({ message: 'Server started', level: 'info', textColor: 'green', bgColor: 'bgGreen' });