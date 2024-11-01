import Clipboard from '@react-native-clipboard/clipboard';
import { CONTRACT_TYPE } from './Constants';

export function removeDuplicateObjectArray(arr) {
    const uniqueSet = new Set();
    return arr.filter((obj) => {
        const objString = JSON.stringify(obj?.id);
        if (!uniqueSet.has(objString)) {
            uniqueSet.add(objString);
            return true;
        }
        return false;
    });
}

export function convertStringUpperCaseFirstLetter(inputStr = '') {
    // Use a regular expression to find uppercase letters followed by lowercase letters
    const pattern = /([a-z])([A-Z])/g;
    // Replace the matches with the lowercase letter, a space, and the uppercase letter
    const result = inputStr?.replace(pattern, '$1 $2')?.toLowerCase();
    const capitalizedResult = result?.replace(/\b\w/g, (match) => match?.toUpperCase());
    return capitalizedResult;
}

export const checkBgColor = (status) => {
    switch (status) {
        case CONTRACT_TYPE.ACTIVE:
        case 'active':
            return '#61C7DF';
        case CONTRACT_TYPE.PEN_DING:
            return '#FABD3A';
        case 'pending':
            return '#FABD3A';
        case CONTRACT_TYPE.DEFAULT:
            return '#E16453';
        case CONTRACT_TYPE.UNLOCK:
            return '#5EC4AC';
        case 'Pending verify':
            return '#FABD3A';
        default:
            return '#267385';
    }
};

export const getContractNameByDid = (did) => {
    try {
        let id = did.split('_')[1];
        return id.slice(0, 5) + id.slice(id.length - 5, id.length);
    } catch (error) {
        return '';
    }
};

export const checkValidUrl = (url) => {
    const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
    return pattern.test(url);
};

export const copyToClipboard = (str) => {
    Clipboard.setString(str);
};
