import React, { useImperativeHandle, useState } from 'react';
import { StyleSheet } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { Box } from 'native-base';

const CustomDebouncePhoneInput = ({ onChangeText, refControl }) => {
    const [value, setValue] = useState('');
    const { mapReducer } = useShallowEqualSelector((state) => ({
        mapReducer: state.map,
    }));

    const onClearInput = () => {
        setValue('');
    };

    useImperativeHandle(
        refControl,
        () => {
            return {
                onClearInput() {
                    onClearInput();
                },
            };
        },
        [],
    );

    return (
        <Box style={styles.container}>
            <PhoneInput
                value={value}
                onChangeText={(text) => {
                    setValue(text);
                }}
                onChangeFormattedText={onChangeText}
                textInputStyle={styles.phoneInputStyle}
                textContainerStyle={styles.textContainer}
                countryPickerButtonStyle={styles.countryPickerButton}
                containerStyle={styles.containerStyle}
                hideError
                placeholder="Ex: (225) 555-0118"
                defaultCode={mapReducer.countryCode || 'UG'}
                withDarkTheme={false}
                textInputProps={{
                    placeholderTextColor: '#C5C6CC',
                }}
            />
        </Box>
    );
};

export default CustomDebouncePhoneInput;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        borderColor: '#5EC4AC',
        justifyContent: 'center',
        height: 48,
    },
    phoneInputStyle: {
        height: 48,
    },
    textContainer: {
        backgroundColor: 'white',
    },
    countryPickerButton: {
        width: 'auto',
    },
    containerStyle: {
        paddingLeft: 12,
    },
});
