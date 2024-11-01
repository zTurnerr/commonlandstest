import { Box, Input, Text } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import Error from '../Error';

export default function Index({
    onChange,
    onInvalidPassword,
    onInvalidConfirmPassword,
    titlePassword,
    titleConfirmPassword,
    disabled,
}) {
    const t = useTranslate();
    const _titlePassword = titlePassword ?? t('components.password');
    const _titleConfirmPassword = titleConfirmPassword ?? t('components.confirmPassword');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({
        password: '',
        confirmPassword: '',
    });
    const passwordChange = (text) => {
        //check if password is valid min is 6 character
        if (text.length < 6) {
            setError({
                ...error,
                password: t('components.passwordLengthRequirement'),
            });
            onInvalidPassword && onInvalidPassword(true);
        } else {
            setError({
                ...error,
                password: '',
            });
            onInvalidPassword && onInvalidPassword(false);
        }
        setPassword(text);
        setConfirmPassword('');
        onChange &&
            onChange({
                password: text,
                confirmPassword: '',
            });
    };
    const confirmPasswordChange = (text) => {
        setConfirmPassword(text);
        //check error
        if (text !== password) {
            setError({
                ...error,
                confirmPassword: t('components.passwordNotMatch'),
            });
            onInvalidConfirmPassword && onInvalidConfirmPassword(true);
        } else {
            setError({
                ...error,
                confirmPassword: '',
            });
            onInvalidConfirmPassword && onInvalidConfirmPassword(false);
        }
        onChange &&
            onChange({
                password,
                confirmPassword: text,
            });
    };
    return (
        <>
            <Box {...styles.containerInput}>
                <Text {...styles.title}>{_titlePassword}</Text>
                <Input
                    value={password}
                    onChangeText={(text) => passwordChange(text)}
                    placeholder={_titlePassword}
                    type="password"
                    disabled={disabled}
                />
                <Error>{error.password}</Error>
            </Box>
            <Box {...styles.containerInput}>
                <Text {...styles.title}>{_titleConfirmPassword}</Text>
                <Input
                    value={confirmPassword}
                    onChangeText={(text) => confirmPasswordChange(text)}
                    placeholder={_titleConfirmPassword}
                    type="password"
                    disabled={disabled}
                />
                <Error>{error.confirmPassword}</Error>
            </Box>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        mb: '8px',
        fontWeight: 'bold',
        fontSize: 12,
    },
    containerInput: {
        mb: '12px',
    },
    // button: {
    //     mt: '22px',
    // },
    // container: {
    //     p: '22px',
    //     mt: '22px',
    // },
});
