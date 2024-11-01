const fs = require('fs');

const excludeString = [
    'px',
    'headerShown',
    'YYYY',
    '{',
    '}',
    'rgb',
    '~',
    'use strict',
    'log',
    './',
    '//',
    '><',
    'MoMo',
    '*',
];

function checkRegex(content, regex, paramChar = '???') {
    const matches = content.match(regex);
    if (!matches) return;
    matches.forEach((match) => {
        if (excludeString.some((item) => match.includes(item))) return;
        // count character in string
        const countCharacter = match.split(paramChar).length - 1;
        if (countCharacter > 2) return;
        console.log('start====', match, '====end');
    });
}

function checkSpaceString(content, paramChar) {
    const regex = new RegExp(`${paramChar}.*\\s.*${paramChar}`, 'g');
    checkRegex(content, regex, paramChar);
}

function checkLine(data) {
    const lines = data.split('\n');
    const excludeLine = [
        ';',
        'import',
        '<',
        '>',
        '{',
        '}',
        'const',
        'export',
        'function',
        'return',
        'if',
        'else',
        '//',
        'await',
        '+',
        ':',
        '=',
        '?.',
        '[',
        ']',
        '*',
        '&&',
        'Buffer',
    ];
    lines.forEach((line) => {
        if (!line) return;
        const firstChar = line.trim().charAt(0);
        if (firstChar !== firstChar.toUpperCase()) return;
        // check first char is not alphabet
        if (!firstChar.toLowerCase().match(/[a-z]/i)) return;
        //check any two uppercase character adjacent
        if (line.match(/[A-Z][A-Z]/)) return;
        // check dot character is between two lowercase character
        if (line.match(/[a-z]\.[a-z]/)) return;
        // if line.trim not contain space but contain comma
        if (!line.trim().includes(' ') && line.includes(',')) return;
        if (excludeLine.some((item) => line.includes(item))) return;
        console.log('line====', line, '====end');
    });
}

function handleFile(path) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        // get all pattern that is string and containe space character inside
        checkSpaceString(data, "'");
        checkSpaceString(data, '"');
        checkSpaceString(data, '`');
        checkRegex(data, />.*<\/Text>/g);
        checkRegex(data, />.*<\/Button>/g);
        checkLine(data);
    });
}

function scanAllFiles(path) {
    const files = fs.readdirSync(path);
    files.forEach((file) => {
        const filePath = `${path}/${file}`;
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            scanAllFiles(filePath);
        } else {
            if (filePath.includes('Icons')) return;
            if (filePath.includes('libs')) return;
            if (filePath.includes('redux')) return;
            if (filePath.includes('Swiper')) return;
            if (filePath.includes('Mtn')) return;
            if (filePath.includes('newFollows')) return;
            if (filePath.includes('script')) return;

            if (filePath.endsWith('.js')) {
                // read file content
                handleFile(filePath);
            }
        }
    });
}

const main = async () => {
    const path = './src';
    scanAllFiles(path);
};

main();
