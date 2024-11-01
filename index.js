/**
 * @format
 */
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { initI18n } from './src/i18n';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const { data } = remoteMessage || {};
    console.log('Message handled in the background!', data);
    console.log('COME BACKGROUND FUNC:');
});

LogBox.ignoreLogs([
    'Require cycle: node_modules/@emurgo/cardano-message-signing-asmjs',
    'TextEncoder constructor called with encoding label, which is ignored.',
]); // Turn off warnings for asmjs, TextEncoder and Constants

notifee.onBackgroundEvent(async ({ detail }) => {
    const { notification } = detail;
    const { data, title } = notification || {};
    console.log('ON BACKGROUND EVENT', title, data);
});
initI18n();
AppRegistry.registerComponent(appName, () => App);
