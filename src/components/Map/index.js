import { useFocusEffect } from '@react-navigation/native';
import { Box } from 'native-base';
import React, { useCallback, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { mapSliceActions } from '../../redux/reducer/map';
import { RECEIVE_TYPE, SEND_TYPE } from '../../util/Constants';
import { StyleSheet } from 'react-native';

export default function Index({
    enableDraw,
    onPolygonChange = () => {},
    mapRef = {},
    onPointClick = () => {},
    onEvent = () => {},
    style,
    useGlobalData = true,
    search = '',
    /**
     * @description Prevent user interaction with the map
     * @default false
     */
    preventUserInteraction = false,
    onLoadEnd = () => {},
}) {
    const webviewRef = useRef();
    const dispatch = useDispatch();
    const sendMessage = (data) => {
        webviewRef?.current?.postMessage(JSON.stringify(data));
    };
    // const currentPosition = useShallowEqualSelector((state) => state.map.currentPosition);
    function createDraw() {
        let data = {
            type: SEND_TYPE.createDraw,
        };
        sendMessage(data);
    }
    // const flyToCurrent = () => {
    //     if (useGlobalData) {
    //         if (currentPosition.long) {
    //             setCenter({
    //                 ref: webviewRef,
    //                 ...currentPosition,
    //             });
    //         }
    //     }
    // };

    const [height, setHeight] = useState('100.1%'); // HACK: Load webview in virtual device

    useFocusEffect(
        useCallback(() => {
            setHeight('100.1%');

            return () => setHeight('full');
        }, []),
    );

    function onMessage(event) {
        try {
            let data = JSON.parse(event.nativeEvent.data);
            onEvent(data);
            switch (data.type) {
                case RECEIVE_TYPE.online:
                    setHeight('full');
                    if (enableDraw) {
                        createDraw();
                    }
                    setHeight('full');
                    // flyToCurrent();
                    break;
                case RECEIVE_TYPE.polygonUpdate:
                    onPolygonChange(data.polygon);
                    break;
                case RECEIVE_TYPE.pointClick:
                    onPointClick(data.coordinates);
                    break;
                case RECEIVE_TYPE.mapViewLog:
                    console.log('Map view log', data.message);
                    break;

                case RECEIVE_TYPE.moveend:
                    // let currentPosition = {
                    //     ...data.data,
                    //     bounds: {
                    //         _ne: {
                    //             lat: data.data.bounds._ne.lat + 0.02,
                    //             lng: data.data.bounds._ne.lng - 0.02,
                    //         },
                    //         _sw: {
                    //             lat: data.data.bounds._sw.lat - 0.02,
                    //             lng: data.data.bounds._sw.lng + 0.02,
                    //         },
                    //     },
                    // };
                    useGlobalData &&
                        dispatch(
                            mapSliceActions.updateCurrentPosition({
                                currentPosition: data.data,
                            }),
                        );

                    break;
                default:
                    break;
            }
        } catch (err) {}
    }
    return (
        <Box h={height} bg="white" position="relative" style={style}>
            <WebView
                ref={(_ref) => {
                    mapRef.current = _ref;
                    webviewRef.current = _ref;
                }}
                autoManageStatusBarEnabled={false}
                javaScriptEnabled
                startInLoadingState
                domStorageEnabled
                overScrollMode={'never'}
                originWhitelist={['*']}
                source={{
                    uri: 'file:///android_asset/www/index.html?' + search,
                    // uri: 'https://f8bl0rdf-3000.asse.devtunnels.ms?' + search,
                    // uri: 'http://192.168.1.22:3000?' + search,
                }}
                style={styles.webview}
                onError={(err) => {
                    webviewRef.current.reload();
                    console.log('[Map] Error', err.target);
                }}
                onHttpError={(err) => {
                    webviewRef.current.reload();
                    console.log('[Map] Http error', err);
                }}
                onMessage={onMessage}
                onLoadEnd={onLoadEnd}
            />
            {preventUserInteraction && (
                <Box
                    w="full"
                    h="full"
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    zIndex={10}
                />
            )}
        </Box>
    );
}

const styles = StyleSheet.create({
    webview: {
        width: '100%',
        height: '100%',
        opacity: 0.99,
    },
});
