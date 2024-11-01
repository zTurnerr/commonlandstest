/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import getBlockchainLoadingTemplate from '../../util/template/getBlockchainLoadingTemplate';
import WebView from 'react-native-webview';

const BlockchainLoading = ({ zoomLevel = 1, width = 200, height = 200, bg = 'white' }) => {
    const html = getBlockchainLoadingTemplate({ zoomLevel, bg });
    return (
        <WebView
            source={{ html }}
            containerStyle={{
                width: width,
                maxHeight: height,
                overflow: 'hidden',
            }}
        />
    );
};

export default React.memo(BlockchainLoading);
