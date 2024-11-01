const fs = require('fs');
const enJson = require('../src/i18n/en.json');
// let importText = `import useTranslate from '../../i18n/useTranslate';`;
let importText = `import useTranslate from '`;

const checkKey = (key, data) => {
    Object.keys(enJson[key]).forEach((key2) => {
        const value = enJson[key][key2];
        // replace text
        const replaceText = `t('${key}.${key2}')`;
        data = data.replace("{'" + value + "'", '{' + replaceText);
        data = data.replace("'" + value + "'}", replaceText + '}');
        data = data.replace('`' + value, '`${' + replaceText + '}');
        data = data.replace(' ' + value + '\n', ' ' + '{' + replaceText + '}\n');
        data = data.replace('>' + value + '<', '>{' + replaceText + '}<');
        if (value.includes(' ')) {
            data = data.replace('="' + value + '"', '={' + replaceText + '}');
            data = data.replace("'" + value + "'", replaceText);
            data = data.replace('`' + value + '`', replaceText);
        }
        // return;
    });
    return data;
};

const importTranslate = (data, fileName) => {
    //remove .js
    fileName = fileName.replace('.js', '');
    if (data.includes(importText)) {
        return data;
    }
    data = importText + '\n' + data;
    const t = `const t = useTranslate();`;
    // find the Component name position based on file name
    const componentName = ' ' + fileName;
    const componentNamePosition = data.indexOf(componentName);
    // find the first return ( position
    const returnPosition = data.indexOf('return (', componentNamePosition);
    data = data.slice(0, returnPosition) + t + '\n' + data.slice(returnPosition);
    return data;
};

const main = async () => {
    const path = './src/screen/Contract/components';
    // edit importText based on number of / in path
    const numberOfSlash = path.split('/').length - 2;
    for (let i = 0; i < numberOfSlash; i++) {
        importText += '../';
    }
    importText += "i18n/useTranslate';";

    // loop through all files in the folder
    fs.readdir(path, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        // // listing all files using forEach
        files.forEach(function (file) {
            const filePath = `${path}/${file}`;
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }

                let newData = data;
                newData = importTranslate(newData, file);

                // //loop through all keys in en.json
                // Object.keys(enJson.contract).forEach((key) => {
                //     const value = enJson.contract[key];
                //     //if value not contain space, return
                //     if (!value.includes(' ')) return;
                //     // replace text
                //     const replaceText = `t('contract.${key}')`;
                //     newData = newData.replace(value, replaceText);
                //     // return;
                // });
                newData = checkKey('certificate', newData);
                newData = checkKey('auth', newData);
                newData = checkKey('scanQr', newData);
                newData = checkKey('replacePhoneNumber', newData);
                newData = checkKey('status', newData);
                newData = checkKey('contract', newData);
                newData = checkKey('explore', newData);
                newData = checkKey('shareAndPermission', newData);
                newData = checkKey('plotStatusDetail', newData);
                newData = checkKey('forgotPass', newData);
                newData = checkKey('error', newData);
                newData = checkKey('components', newData);
                // newData = checkKey('invite', newData);
                newData = checkKey('button', newData);
                newData = checkKey('claimants', newData);
                newData = checkKey('plotStatus', newData);
                newData = checkKey('profile', newData);
                newData = checkKey('snap', newData);
                newData = checkKey('accountHistory', newData);
                newData = checkKey('plotInfo', newData);
                newData = checkKey('notification', newData);
                newData = checkKey('others', newData);
                newData = checkKey('progressOption', newData);
                newData = checkKey('changePass', newData);
                newData = checkKey('plot', newData);
                newData = checkKey('subplot', newData);
                newData = checkKey('bottomTab', newData);

                fs.writeFile(filePath, newData, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
        });
    });
};

main();
