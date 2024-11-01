import { DEFAULT_LANGUAGE, LANGUAGE, getStorage, setStorage } from '../util/Constants';
import { NativeModules, Platform } from 'react-native';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const LANGUAGE_KEY = 'language';
const locales = {
    en: {
        translation: require('./en.json'),
    },
};

const getDeviceLanguage = () => {
    const appLanguage =
        Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
              NativeModules.SettingsManager.settings.AppleLanguages[0]
            : NativeModules.I18nManager.localeIdentifier;

    return appLanguage.search(/-|_/g) !== -1 ? appLanguage.slice(0, 2) : appLanguage;
};

const languageDetector = {
    init: () => {},
    type: 'languageDetector',
    async: true, // flags below detection to be async
    detect: async (callback) => {
        const userLang = await getStorage(LANGUAGE_KEY);
        // const token = await getStorage('accessToken');
        let newLanguage = null;
        if (userLang) {
            newLanguage = userLang?.includes(LANGUAGE.EN) ? LANGUAGE.EN : LANGUAGE.VI;
        }
        const deviceLang = newLanguage || getDeviceLanguage() || DEFAULT_LANGUAGE;
        if (!newLanguage) {
            await setStorage(LANGUAGE_KEY, JSON.stringify(deviceLang));
        }
        // axios.defaults.headers = {
        //     ...axios.defaults.headers,
        //     lang: newLanguage || 'en',
        //     Authorization: `Bearer ${JSON.parse(token)}`,
        // };

        callback(deviceLang);
    },
    cacheUserLanguage: () => {},
};

export const initI18n = () => {
    i18n.use(languageDetector)
        .use(initReactI18next)
        .init({
            compatibilityJSON: 'v3',
            fallbackLng: LANGUAGE.EN,
            debug: false,
            resources: locales,
            interpolation: {
                escapeValue: false,
            },
            react: { useSuspense: false },
        });
};
