/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import React, { useEffect, useRef } from 'react';

import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useTheme } from 'native-base';
import { StyleSheet } from 'react-native';

export default function Index(props) {
    const theme = useTheme();

    const styles = StyleSheet.create({
        OPT: {
            height: 50,
            width: '90%',
            ...props.otpInputStyle,
        },
        underlineStyleBase: {
            width: 44,
            height: theme.input.height,
            borderRadius: theme.input.borderRadius,
            borderColor: theme.input.borderColor,
            color: theme.colors.black,
        },

        underlineStyleHighLighted: {
            borderColor: theme.colors.primary[600],
        },
    });

    const otpRef = useRef(null);

    useEffect(() => {
        setTimeout(() => otpRef?.current?.focusField(0), 250);
    }, []);

    return (
        <OTPInputView
            autoFocusOnLoad={false}
            ref={otpRef}
            pinCount={6}
            style={styles.OPT}
            selectionColor={theme.colors.primary[600]}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            {...props}
        />
    );
}
