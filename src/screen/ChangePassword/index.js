import useTranslate from '../../i18n/useTranslate';
import { Box, Input, ScrollView, Text } from 'native-base';
import React, { useState } from 'react';

import Button from '../../components/Button';
import DeviceInfo from 'react-native-device-info';
import Error from '../../components/Error';
import PasswordForm from '../../components/PasswordForm';
import { StyleSheet } from 'react-native';
import { changePassword } from '../../rest_client/authClient';
import { logout } from '../../redux/actions/user';
import { showMessage } from '../../util/Constants';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';

export default function Index() {
    const t = useTranslate();
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({
        password: '',
        confirmPassword: '',
        newPassword: '',
    });
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const dispatch = useDispatch();
    const user = useShallowEqualSelector((state) => state.user);
    const onSubmit = async () => {
        try {
            setSubmitError('');
            setLoading(true);
            const deviceId = await DeviceInfo.getUniqueId();
            await changePassword({
                password,
                newPassword,
                deviceId,
            });
            showMessage({
                text: t('changePass.changePassSuccess'),
            });
            if (user?.trainer?._id && user?.trainer?._id !== user?.userInfo?._id) {
                navigation.goBack();
            } else {
                dispatch(logout(navigation));
            }
        } catch (e) {
            setSubmitError(e?.message || e);
        } finally {
            setLoading(false);
        }
    };
    const disabled =
        error.password ||
        error.confirmPassword ||
        !password ||
        !confirmPassword ||
        loading ||
        !newPassword ||
        error.newPassword;
    return (
        <Box {...styles.container}>
            <Header title={t('profile.changePassword')} />
            <ScrollView {...styles.scrollView} flex={1}>
                <Box {...styles.containerInput}>
                    <Text {...styles.title}>{t('components.password')}</Text>
                    <Input
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        placeholder={t('changePass.enterYourPass')}
                        type="password"
                        disabled={loading}
                    />
                    <Error>{error.password}</Error>
                </Box>
                <PasswordForm
                    onChange={({ password, confirmPassword }) => {
                        setNewPassword(password);
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
                            newPassword: invalid,
                        });
                    }}
                    titlePassword={t('changePass.newPass')}
                    titleConfirmPassword={t('changePass.confirmNewPass')}
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
            </ScrollView>
        </Box>
    );
}

const styles = StyleSheet.create({
    title: {
        mb: '8px',
        fontWeight: 'bold',
        fontSize: 12,
    },
    button: {
        mt: '22px',
    },
    container: {
        bg: 'white',
        h: 'full',
    },
    scrollView: {
        p: '22px',
        pt: '22px',
    },
    containerInput: {
        mb: '12px',
    },
});
