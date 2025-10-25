import chalk from 'chalk';

// import fs from 'fs';

function getCallerFile() {
    try {
        const err = new Error();
        const stack = err.stack;

        if (!stack) {
            return '[unknown] ';
        }

        // Convert stack to array of lines
        const stackLines = stack.split('\n');

        // Debug: to see stack trace
        // console.log('Stack Lines:', stackLines);

        // Find first line that is not ChalkActions
        for (let i = 0; i < stackLines.length; i++) {
            const line = stackLines[i];

            // If line contains getCallerFile or ChalkActions, skip it
            if (line.includes('getCallerFile') || line.includes('ChalkActions')) {
                continue;
            }

            // Now this line is the real caller
            // Different stack trace formats:
            // Chrome/Node: "    at Object.<anonymous> (file:///path/to/file.js:10:5)"
            // Firefox: "    @file:///path/to/file.js:10:5"
            // Webpack: "    at Object../src/file.js (http://localhost:3000/main.js:123:45)"

            // Pattern 1: (file path)
            let match = line.match(/\(([^)]+)\)/);
            if (match) {
                const fullPath = match[1];
                return extractFileName(fullPath);
            }

            // Pattern 2: @ file path (Firefox)
            match = line.match(/@(.+)/);
            if (match) {
                const fullPath = match[1];
                return extractFileName(fullPath);
            }

            // Pattern 3: at file path (without parentheses)
            match = line.match(/at\s+(.+)/);
            if (match) {
                const fullPath = match[1].trim();
                return extractFileName(fullPath);
            }
        }

        return '[unknown] ';
    } catch (error) {
        console.error('Error in getCallerFile:', error);
        return '[unknown] ';
    }
}

function extractFileName(fullPath) {
    try {
        // Remove line and column numbers (like :10:5)
        let cleanPath = fullPath.split(':').slice(0, -2).join(':');

        // If still has :, probably protocol (http:// or file://)
        if (cleanPath.includes('://')) {
            cleanPath = fullPath.replace(/:\d+:\d+$/, '');
        } else if (!cleanPath) {
            // If empty, means only had one :, so remove only last number
            cleanPath = fullPath.split(':').slice(0, -1).join(':');
        }

        // Remove query string and hash
        cleanPath = cleanPath.split('?')[0].split('#')[0];

        // Get file name
        // For Windows and Linux
        const fileName = cleanPath.split('/').pop().split('\\').pop();

        // If file name is valid
        if (fileName && fileName.length > 0 && fileName !== 'anonymous') {
            return `[${fileName}] `;
        }

        return '[unknown] ';
    } catch (error) {
        return '[unknown] ';
    }
}

export const ChalkActions = ({level = 'info', textColor = 'white', bgColor = 'bgBlue', message}) => {
    const colorMap = {
        info: {text: 'white', bg: 'bgBlue'},
        warn: {text: 'yellow', bg: 'bgYellow'},
        error: {text: 'red', bg: 'bgRed'},
    };

    const effectiveTextColor = chalk[textColor] || chalk[colorMap[level].text];
    const effectiveBgColor = chalk[bgColor] || chalk[colorMap[level].bg];

    // Add file address to start of message
    const filePrefix = getCallerFile();
    const fullMessage = filePrefix + (typeof message === 'string' ? message : JSON.stringify(message));

    // Hide passwords for security
    const safeMessage = typeof fullMessage === 'string'
        ? fullMessage.replace(/password\s*[=:]\s*["']?[^"',}\s]+["']?/gi, 'password = [HIDDEN]')
        : fullMessage;

    const icon = level === 'info' ? '✅' : level === 'warn' ? '⚠️' : '❌';
    const logMessage = `${icon} [${level.toUpperCase()}] [${new Date().toISOString()}] ${safeMessage}`;

    console.log(effectiveBgColor(effectiveTextColor.bold(logMessage)));

    // fs.appendFileSync('logs.txt', logMessage + '\n');
};

// مثال استفاده:
// ChalkActions({ message: 'Server started', level: 'info', textColor: 'green', bgColor: 'bgGreen' });
// ChalkActions({ message: 'Warning message', level: 'warn' });
// ChalkActions({ message: 'Error occurred', level: 'error' });
// ChalkActions({ message: { username: 'ali', password: '123456' } }); // password will be hidden