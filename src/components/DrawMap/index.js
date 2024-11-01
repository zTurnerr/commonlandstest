import * as turf from '@turf/turf';
import { Blend2 } from 'iconsax-react-native';
import { Box, HStack, IconButton, useTheme, VStack } from 'native-base';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Map from '../../components/Map';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { RECEIVE_TYPE, SEND_TYPE } from '../../util/Constants';
import ModalEnableSnap from '../ModalEnableSnap';
import useEnableSnap from '../../hooks/useEnableSnap';
// eslint-disable-next-line react-native/split-platform-components
import useGetDistanceFromHeader from '../../hooks/useGetDistanceFromHeader';
import { StyleOfGeolocation } from './styleMap';

/**
 * @param {{
 * style: import('react-native').ViewStyle;
 * longlat?: string;
 * zoom?: number;
 * onEvent?: (event: import('react-native-webview').WebViewMessageEvent) => void;
 * webviewRef?: import('react').MutableRefObject<import('react-native-webview').WebView | null>;
 * showControls?: boolean;
 * }} DrawMapProps
 */
export default function DrawMap({
    style,
    longlat,
    zoom,
    webviewRef,
    showControls,
    onEvent,
    onPolygonUpdate,
    onOpenSnapping,
    setEnableSnap,
    isOverStep1,
}) {
    /**
     * @type {import('react').MutableRefObject<import('react-native-webview').WebView | null>}
     */
    const ref = useRef(null);
    const refControl = useRef(null);

    /**
     * @typedef {{
     * type: 'marker' | 'square' | 'polygon';
     * data: any;
     * centroid: {
     * long: number;
     * lat: number;
     * }
     * }} State
     * @type {[State[], import('react').Dispatch<import('react').SetStateAction<State[]>>]}
     */
    const [states, setStates] = useState([
        {
            type: 'polygon',
        },
    ]);
    const [stateIndex, setStateIndex] = useState(0);
    const { distance } = useGetDistanceFromHeader();

    const pushState = useCallback(
        /**
         * @param {State} state
         */
        (state) => {
            setStates((prev) => {
                const next = prev.slice(0, stateIndex + 1);
                next.push(state);
                return next;
            });
            setStateIndex((prev) => prev + 1);
        },
        [stateIndex],
    );

    const { mapReducer } = useShallowEqualSelector((state) => ({
        mapReducer: state.map,
    }));

    const handleEvent = useCallback(
        (event) => {
            switch (event.type) {
                case RECEIVE_TYPE.polygonUpdate:
                    const { polygon, centroid } = event;
                    let polygonIsSquare = refControl.current === 'square';
                    pushState({
                        type: polygonIsSquare ? 'square' : 'polygon',
                        data: polygon.geometry.coordinates,
                        centroid: {
                            long: centroid.geometry.coordinates[0],
                            lat: centroid.geometry.coordinates[1],
                        },
                        rawData: event,
                    });
                    refControl.current = '';
                    break;
                case RECEIVE_TYPE.moveend:
                    break;
                case RECEIVE_TYPE.online:
                    sendMessage({
                        type: SEND_TYPE.styleMap,
                        style: StyleOfGeolocation,
                    });
                    setTimeout(() => {
                        sendMessage({
                            type: SEND_TYPE.addControl,
                            controls: ['geolocateControl'],
                        });
                    }, 100);
                    break;
            }
            onEvent?.(event);
        },

        [onEvent, pushState],
    );

    const sendMessage = (data) => {
        ref.current.postMessage(JSON.stringify(data));
    };

    const { isEnableSnap, onToggleSwitch, isOpenModalEnable, onOpenModal, onCloseModal } =
        useEnableSnap();
    useEffect(() => {
        setEnableSnap(isEnableSnap);
    }, [isEnableSnap]);

    const handleClickSnap = () => {
        onOpenModal();
    };

    const handleDrawSquare = useCallback(() => {
        const long = Number(mapReducer.currentPosition.long);
        const lat = Number(mapReducer.currentPosition.lat);
        const distance = 0.0001;

        const polygon = turf.polygon([
            [
                [long + distance, lat + distance],
                [long + distance, lat - distance],
                [long - distance, lat - distance],
                [long - distance, lat + distance],
                [long + distance, lat + distance],
            ],
        ]);

        // pushState({ type: 'square', data: polygon.geometry.coordinates, centroid: { long, lat } });
        refControl.current = 'square';
        sendMessage({
            type: SEND_TYPE.updateDrawPolygon,
            polygon: polygon.geometry.coordinates,
            sendPolygonToApp: true,
        });
    }, [mapReducer.currentPosition.lat, mapReducer.currentPosition.long]);

    const handlePolygon = useCallback(() => {
        const long = Number(mapReducer.currentPosition.long);
        const lat = Number(mapReducer.currentPosition.lat);

        pushState({ type: 'polygon', centroid: { long, lat } });
    }, [mapReducer.currentPosition.lat, mapReducer.currentPosition.long, pushState]);

    useEffect(() => {
        if (webviewRef) {
            webviewRef.current = ref.current;
        }
    }, [webviewRef]);

    const currentState = useMemo(() => states[stateIndex], [states, stateIndex]);

    useEffect(() => {
        if (!currentState) return;

        sendMessage({
            type: SEND_TYPE.resetPolygon,
        });

        sendMessage({
            type: SEND_TYPE.addMarker,
        });

        sendMessage({
            type: SEND_TYPE.removeSL,
            sources: ['circle-source'],
            layers: ['circle-layer'],
        });

        switch (currentState.type) {
            case 'marker': {
                const { long, lat } = currentState.data;

                sendMessage({
                    type: SEND_TYPE.addMarker,
                    longlat: [long, lat],
                    style: {
                        color: 'red',
                    },
                });

                const source = {
                    id: 'circle-source',
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: [long, lat],
                        },
                    },
                };

                const layers = [
                    {
                        id: 'circle-layer',
                        type: 'circle',
                        source: 'circle-source',
                        paint: {
                            'circle-radius': {
                                base: 1,
                                stops: [
                                    [12, 2],
                                    [22, 80],
                                ],
                            },
                            'circle-color': '#007cbf',
                            'circle-opacity': 0.5,
                        },
                    },
                ];

                sendMessage({
                    type: SEND_TYPE.addSourceV2,
                    source,
                    layers,
                });
                onPolygonUpdate({
                    polygon: null,
                });

                break;
            }
            case 'square': {
                onPolygonUpdate(currentState.rawData);
                sendMessage({
                    type: SEND_TYPE.updateDrawPolygon,
                    polygon: currentState.data,
                    sendPolygonToApp: false,
                });

                break;
            }
            case 'polygon': {
                if (currentState.data) {
                    onPolygonUpdate(currentState.rawData);
                    sendMessage({
                        type: SEND_TYPE.updateDrawPolygon,
                        polygon: currentState.data,
                        sendPolygonToApp: false,
                    });
                } else {
                    onPolygonUpdate({
                        polygon: null,
                    });
                }
                break;
            }
        }
    }, [currentState]);

    const handleUndo = useCallback(() => {
        setStateIndex((prev) => {
            let res = Math.max(0, prev - 1);
            return res;
        });
    }, []);

    const handleRedo = useCallback(() => {
        setStateIndex((prev) => Math.min(states.length - 1, prev + 1));
    }, [states.length]);

    // useEffect(() => {

    // }, []);

    const { colors } = useTheme();

    return (
        <>
            <Box position="relative" h="100%">
                <Map
                    onEvent={handleEvent}
                    mapRef={ref}
                    style={style}
                    search={`features=3&controls=3&longlat=${longlat}&zoom=${zoom || 6}`}
                    preventUserInteraction={!showControls}
                />
                <ModalEnableSnap
                    checked={isEnableSnap}
                    handleToggle={onToggleSwitch}
                    isVisible={isOpenModalEnable}
                    onClose={onCloseModal}
                    onOpenLearnMore={onOpenSnapping}
                />

                {!isOverStep1 && showControls && (
                    <VStack
                        position="absolute"
                        top="45px"
                        right="0"
                        pr="15px"
                        pt="20px"
                        space="8px"
                        // display={'none'}
                    >
                        <Box position={'relative'}>
                            <IconButton
                                icon={
                                    <Blend2
                                        color={isEnableSnap ? colors.primary[600] : 'black'}
                                        size={24}
                                    />
                                }
                                _pressed={{ opacity: 0.5 }}
                                size={'40px'}
                                borderRadius={'full'}
                                bgColor={'white'}
                                onPress={handleClickSnap}
                            />
                            {isEnableSnap && (
                                <Box
                                    position={'absolute'}
                                    top={'0'}
                                    right={'0'}
                                    bgColor={'primary.600'}
                                    w={'12px'}
                                    h={'12px'}
                                    borderRadius={'full'}
                                ></Box>
                            )}
                        </Box>

                        <IconButton
                            icon={
                                <MaterialCommunityIcons
                                    name="square-rounded-outline"
                                    color={currentState?.type === 'square' ? 'white' : 'black'}
                                    size={24}
                                />
                            }
                            size="40px"
                            bgColor={currentState?.type === 'square' ? 'primary.600' : 'white'}
                            borderRadius="full"
                            color="black"
                            onPress={handleDrawSquare}
                        />

                        <IconButton
                            icon={
                                <MaterialCommunityIcons
                                    name="vector-square"
                                    color={currentState?.type === 'polygon' ? 'white' : 'black'}
                                    size={24}
                                />
                            }
                            size="40px"
                            bgColor={currentState?.type === 'polygon' ? 'primary.600' : 'white'}
                            borderRadius="full"
                            color="black"
                            onPress={handlePolygon}
                        />
                    </VStack>
                )}

                {!isOverStep1 && showControls && (
                    <HStack
                        position="absolute"
                        bottom={`${86 + distance}px`}
                        left="0"
                        w="full"
                        justifyContent="center"
                        space="12px"
                    >
                        <IconButton
                            icon={
                                <MaterialCommunityIcons
                                    name="undo"
                                    color={stateIndex <= 0 ? 'grey' : '#000'}
                                    size={20}
                                />
                            }
                            size="40px"
                            bgColor="white"
                            borderRadius="full"
                            disabled={stateIndex <= 0}
                            onPress={handleUndo}
                        />

                        <IconButton
                            icon={
                                <MaterialCommunityIcons
                                    name="redo"
                                    color={stateIndex >= states.length - 1 ? 'grey' : '#000'}
                                    size={20}
                                />
                            }
                            size="40px"
                            bgColor="white"
                            borderRadius="full"
                            disabled={stateIndex >= states.length - 1}
                            onPress={handleRedo}
                        />
                    </HStack>
                )}
            </Box>
        </>
    );
}
