import { Box, Text, useTheme } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';

export default function Index(props) {
    const [onFocus, setFocus] = useState(false);
    const [error, setError] = useState('');
    const { mapReducer } = useShallowEqualSelector((state) => ({
        mapReducer: state.map,
    }));
    const theme = useTheme();
    const styles = StyleSheet.create({
        textInputStyle: {
            backgroundColor: theme.input.backgroundColor,
            padding: 0,
            marginLeft: 0,
            fontSize: 14,
            height: theme.input.height,
            // ...theme.input,
        },
        containerStyle: {
            backgroundColor: theme.input.backgroundColor,
            borderWidth: 1,
            borderColor: onFocus ? theme.input._focus.borderColor : theme.input.borderColor,
            borderRadius: theme.input.borderRadius,
            height: theme.input.height,
            padding: 0,
            width: '100%',
        },
        textContainerStyle: {
            backgroundColor: theme.input.backgroundColor,
            padding: 0,
            borderLeftWidth: 1,
            borderColor: onFocus ? theme.input._focus.borderColor : theme.input.borderColor,
            justifyContent: 'center',
            display: 'flex',
        },
        codeTextStyle: {
            fontSize: 14,
            // marginTop: -2,
            padding: 0,
            height: 20,
            // backgroundColor: 'red',
        },
    });

    const phoneInput = useRef(null);
    const {
        onInvalid = () => {},
        defaultValue,
        textInputStyle = {},
        containerStyle = {},
        textContainerStyle = {},
        codeTextStyle = {},
        onChangeFormattedText = () => {},
        hideError,
        value,
        countryCode,
        setIsEmpty = () => {},
        onChangeCountry = () => {},
        defaultCode = 'UG',
        onChangeText = () => {},
        setParentError = () => {},
        onFocusOutside = () => {},
        ...other
    } = props;

    useEffect(() => {
        if (countryCode) {
            phoneInput.current.onSelect(countryCode);
        }
    }, [countryCode]);

    const t = useTranslate();
    return (
        <Box>
            {/* {<Text>{mapReducer.countryCode}</Text>} */}

            <PhoneInput
                withDarkTheme={false}
                ref={phoneInput}
                defaultCode={mapReducer.countryCode || defaultCode}
                onChangeCountry={onChangeCountry}
                textInputStyle={{ ...styles.textInputStyle, ...textInputStyle }}
                containerStyle={{ ...styles.containerStyle, ...containerStyle }}
                textContainerStyle={{
                    ...styles.textContainerStyle,
                    ...textContainerStyle,
                }}
                codeTextStyle={{ ...styles.codeTextStyle, ...codeTextStyle }}
                // layout="second"
                withDarkThem={false}
                withShadow={false}
                textInputProps={{
                    placeholderTextColor: '#C5C6CC',
                    onFocus: () => {
                        onFocusOutside && onFocusOutside(true);
                        setFocus(true);
                    },
                    onBlur: () => {
                        onFocusOutside && onFocusOutside(false);
                        setFocus(false);
                    },
                }}
                value={value}
                defaultValue={defaultValue}
                onChangeText={onChangeText}
                onChangeFormattedText={(text) => {
                    setError('');
                    setParentError('');
                    onInvalid(false);

                    let number = phoneInput.current.getNumber();
                    if (!number) {
                        setIsEmpty(true);
                    }
                    if (number) {
                        setIsEmpty(false);
                        const checkValid = phoneInput.current?.isValidNumber(text);
                        if (!checkValid) {
                            onInvalid(true);
                            setError(`${t('error.phoneInvalid')}`);
                            setParentError(`${t('error.phoneInvalid')}`);
                        }
                    }
                    let replaced = text.replace(/ /g, '');
                    onChangeFormattedText(replaced);
                }}
                {...other}
            />
            {!hideError && (
                <Text mt="12px" fontSize="12px" color="error.400">
                    {error}
                </Text>
            )}
        </Box>
    );
}
