import { useAppState } from '@react-native-community/hooks';
import { Box, Switch, Text } from 'native-base';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { RESULTS, openSettings } from 'react-native-permissions';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import {
    checkNotificationPermission,
    deleteFCMToken,
    requestNotificationPermission,
} from '../../util/hooks/useNotification';
import {
    getCurrentAccount,
    getCurrentAccountIndex,
    updateAccountToStorage,
} from '../../util/script';

export default function Index() {
    const [checked, setChecked] = React.useState(false);
    const [beforeOpenSetting, setBeforeOpenSetting] = React.useState(false);
    const [requesting, setRequesting] = React.useState(false);
    const useInfo = useShallowEqualSelector((state) => state.user.userInfo);

    const initState = async () => {
        try {
            setRequesting(true);
            const currentAccount = await getCurrentAccount();
            const isGranted = await checkNotificationPermission();
            setChecked(isGranted && Boolean(currentAccount.notification));
        } catch (err) {}
        setRequesting(false);
    };
    const updateCheckedState = async (isChecked) => {
        const currentAccount = await getCurrentAccount();
        const index = await getCurrentAccountIndex();
        currentAccount.notification = isChecked;
        await updateAccountToStorage(currentAccount, index);
        setChecked(isChecked);
        setRequesting(false);
    };
    const currentAppState = useAppState();
    const handleSettingAfterBackgroundSettingPage = async () => {
        if (beforeOpenSetting && currentAppState === 'active') {
            const isGranted = await checkNotificationPermission();
            if (isGranted) {
                updateCheckedState(true);
            }
        }
    };
    useEffect(() => {
        handleSettingAfterBackgroundSettingPage();
    }, [currentAppState]);

    const handleToggle = async (isChecked) => {
        setBeforeOpenSetting(false);
        setRequesting(true);
        if (isChecked) {
            let checkGranted = await checkNotificationPermission(true);
            // console.log('checkGranted', checkGranted);
            if (checkGranted === RESULTS.DENIED) {
                const requestGranted = await requestNotificationPermission();
                // console.log('requestGranted', requestGranted);
                if (requestGranted === RESULTS.GRANTED) {
                    return updateCheckedState(isChecked);
                }
                if (requestGranted === RESULTS.BLOCKED) {
                    setBeforeOpenSetting(isChecked);
                    setRequesting(false);
                    return openSettings();
                }
                return;
            }
            if (checkGranted === RESULTS.GRANTED) {
                // this case alway return true
                await requestNotificationPermission();
                updateCheckedState(isChecked);
                return;
            }

            if (checkGranted === RESULTS.BLOCKED) {
                setBeforeOpenSetting(isChecked);
                setRequesting(false);
                return openSettings();
            }
        } else {
            updateCheckedState(isChecked);
            deleteFCMToken(useInfo._id);
        }
        setRequesting(false);
    };
    useEffect(() => {
        initState();
    }, []);
    const t = useTranslate();
    return (
        <Box {...styles.container}>
            <Text fontSize="14px">{t('notification.allowNotifications')}</Text>
            <Switch size="md" isChecked={checked} onToggle={handleToggle} isDisabled={requesting} />
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        w: '100%',
        px: '12px',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
