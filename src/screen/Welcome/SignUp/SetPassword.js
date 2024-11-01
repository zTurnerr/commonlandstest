import useTranslate from '../../../i18n/useTranslate';
import { Box, ScrollView } from 'native-base';
import React, { useState } from 'react';

import Button from '../../../components/Button';
import PasswordForm from '../../../components/PasswordForm';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Index({ route }) {
    const params = route?.params || {};
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({
        password: '',
        confirmPassword: '',
    });
    const navigation = useNavigation();
    const onSubmit = async () => {
        try {
            navigation.navigate('CreateProfile', {
                ...params,
                password,
            });
        } catch (e) {}
    };
    const disabled = error.password || error.confirmPassword || !password || !confirmPassword;
    const t = useTranslate();
    return (
        <Box w="full" h="full">
            <ScrollView flex={1}>
                <Box {...styles.container}>
                    <PasswordForm
                        onChange={({ password, confirmPassword }) => {
                            setPassword(password);
                            setConfirmPassword(confirmPassword);
                        }}
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
                    <Button disabled={disabled} _container={styles.button} onPress={onSubmit}>
                        {t('button.next')}
                    </Button>
                </Box>
            </ScrollView>
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
        h: 'full',
        justifyContent: 'center',
    },
});
