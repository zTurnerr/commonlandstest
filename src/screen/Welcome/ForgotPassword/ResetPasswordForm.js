import React, { useState } from 'react';
import useTranslate from '../../../i18n/useTranslate';

import { StackActions, useNavigation } from '@react-navigation/native';
import { Box } from 'native-base';
import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Button from '../../../components/Button';
import Error from '../../../components/Error';
import PasswordForm from '../../../components/PasswordForm';
import { forgotPassword } from '../../../rest_client/authClient';
import { showMessage } from '../../../util/Constants';

export default function Index({ idToken, phoneNumber, agent }) {
    const t = useTranslate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const navigation = useNavigation();
    const popAction = StackActions.pop(1);
    const onSubmit = async () => {
        try {
            setLoading(true);
            const deviceId = await DeviceInfo.getUniqueId();
            await forgotPassword({ idToken, password, phoneNumber, deviceId });
            // Check if reset password from agent login
            if (agent) {
                navigation.dispatch(popAction);
            } else {
                navigation.navigate('Login');
            }
            showMessage({
                text: t('forgotPass.resetPasswordSuccess'),
            });
        } catch (e) {
            setSubmitError(e?.message || e);
        } finally {
            setLoading(false);
        }
    };
    const disabled =
        error.password || error.confirmPassword || !password || !confirmPassword || loading;
    return (
        <Box {...styles.container}>
            <PasswordForm
                onChange={({ password, confirmPassword }) => {
                    setPassword(password);
                    setConfirmPassword(confirmPassword);
                }}
                disabled={loading}
                onInvalidConfirmPassword={(invalid) => {
                    setError({
                        ...error,
                        confirmPassword: invalid,
                    });
                }}
                onInvalidPassword={(invalid) => {
                    setError({
                        ...error,
                        password: invalid,
                    });
                }}
            />
            <Error>{submitError}</Error>
            <Button
                disabled={disabled}
                _container={styles.button}
                onPress={onSubmit}
                isLoading={loading}
            >
                {t('button.submit')}
            </Button>
        </Box>
    );
}

const styles = StyleSheet.create({
    // title: {
    //     mb: '8px',
    //     fontWeight: 'bold',
    //     fontSize: 12,
    // },
    button: {
        mt: '22px',
    },
    container: {
        p: '22px',
        mt: '22px',
    },
});
