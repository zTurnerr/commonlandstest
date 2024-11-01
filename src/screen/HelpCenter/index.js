/**
 * Copyright (c) 2023 - Fuxlabs Vietnam Limited
 *
 * @author  NNTruong / nhuttruong6496@gmail.com
 */
import { Box } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import Constants from '../../util/Constants';

export default function Index() {
    return (
        <Box w="full" h="full">
            <WebView
                onError={console.error.bind(console, 'error')}
                source={{
                    uri: Constants.helpCenterURI,
                }}
                style={styles.webview}
            />
        </Box>
    );
}

const styles = StyleSheet.create({
    webview: {
        width: '100%',
        height: '100%',
    },
});
