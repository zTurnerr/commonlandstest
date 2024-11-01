import useTranslate from '../../i18n/useTranslate';

import { Box, Text } from 'native-base';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    RECEIVE_TYPE,
    SEND_TYPE,
    deepClone,
    deviceEvents,
    getColors,
    getDataForRenderWithPlot,
    initSource,
    setCenter,
} from '../../util/Constants';

import { useNavigation } from '@react-navigation/core';
import { useFocusEffect } from '@react-navigation/native';
import { booleanContains } from '@turf/turf';
import { useDisclose } from 'native-base';
import { DeviceEventEmitter } from 'react-native';
import { useDispatch } from 'react-redux';
import AccountButton from '../../components/AccountButton';
import AgentHeader from '../../components/Header/AgentHeader';
import LoadingPage from '../../components/LoadingPage';
import Map from '../../components/Map';
import useWorthwhileNumber from '../../hooks/useWorthwhileNumber';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { userSliceActions } from '../../redux/reducer/user';
import { getPlotByRectangle, getUserPlots } from '../../rest_client/apiClient';
import { boundsToPolygon } from '../../util/comparePolygon';
import expandBounds from '../../util/expandBounds';
import Loading from '../Explore/Loading';
import ModalNoPlots from './ModalNoPlots';
import MyPlotsSwiper from './MyPlotsSwiper';

import axios from 'axios';

const CancelToken = axios.CancelToken;
let source;
export default function Index() {
    const { user } = useShallowEqualSelector((state) => ({
        user: state.user,
    }));
    const worthwhileNumber = useWorthwhileNumber();
    const navigation = useNavigation();
    const webviewRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclose();
    const [statusMap, setStatusMap] = useState(false);
    const [currentPosition, setPosition] = useState();
    const [loadingUserPlots, setLoadingUserPlots] = useState(false);
    const [data, setData] = useState();
    const [isFetchingPlots, setIsFetchingPlots] = useState(false);
    const dispatch = useDispatch();
    const defaultCenter = useRef();

    const sendMessage = (data) => {
        webviewRef.current?.postMessage(JSON.stringify(data));
    };

    useEffect(() => {
        if (loadingUserPlots) return;
        fetchPlots();
    }, [currentPosition, loadingUserPlots]);

    useEffect(() => {
        if (loadingUserPlots) return;
        fetchPlots();
    }, [user.plots, loadingUserPlots]);

    const loadedBounds = useRef();

    /**
     * @description Fetch plots by current position
     * @param {boolean} force - Force fetch plots
     */
    const fetchPlots = async (force = false) => {
        if (!currentPosition?.bounds) return;

        try {
            const bounds = { ...currentPosition.bounds };
            const expandedBounds = expandBounds(bounds);

            if (loadedBounds.current && !force) {
                const loadedPolygon = boundsToPolygon(loadedBounds.current);
                const expandedPolygon = boundsToPolygon(expandedBounds);
                if (booleanContains(loadedPolygon, expandedPolygon)) return; // Skip if expanded bounds is inside loaded bounds
            }
            loadedBounds.current = expandedBounds;

            if (source) {
                source.cancel('fetch plot cancel');
            }
            source = CancelToken.source();
            setIsFetchingPlots(true);
            let res = await getPlotByRectangle(
                expandedBounds,
                navigation,
                {
                    cancelToken: source?.token,
                },
                dispatch,
            );
            setData(res.data.claimchains);
        } catch (err) {
            console.log('[Plots] error', err);
        } finally {
            setIsFetchingPlots(false);
        }
    };
    //render source
    useEffect(() => {
        if (statusMap) {
            let plots = [],
                lines = [],
                points = [],
                allUnion = [];

            data?.forEach((claimchain) => {
                const minClaimchainSize = claimchain?.location?.claimchainSize || worthwhileNumber;
                //get color data default with claimchain size
                let colors = getColors({ numberClaimchain: claimchain.size });

                // let unionPolygon;
                claimchain.plots.forEach(
                    (
                        plot,
                        // index
                    ) => {
                        // if (claimchain.size >= worthwhileNumber) {
                        //     if (!index) {
                        //         unionPolygon = plot.geojson;
                        //     } else {
                        //         unionPolygon = Turf.union(unionPolygon, plot.geojson);
                        //     }
                        // }
                        let _plot = deepClone(plot);
                        // get color data by plot status
                        const { fillColor, outlineColor, iconName } = getDataForRenderWithPlot(
                            plot,
                            colors,
                        );
                        const drawBorder = claimchain.size >= minClaimchainSize;
                        _plot.properties = {
                            ...colors,
                            fillColor,
                            outlineColor: drawBorder ? 'white' : outlineColor,
                            lineWidth: drawBorder ? 2 : 1,
                            claimchainSize: claimchain.size,
                            centroid: plot.centroid,
                        };
                        plots.push(_plot);
                        if (claimchain.size > 1) {
                            points.push({
                                coordinates: _plot.centroid,
                                properties: {
                                    ...colors,
                                    iconName,
                                    circleColor: fillColor,
                                },
                            });
                        }
                    },
                );
                // if (claimchain.size >= worthwhileNumber) {
                //     allUnion.push({
                //         geojson: unionPolygon,
                //         properties: {
                //             outlineColor: 'white',
                //             fillColor: 'transparent',
                //             lineWidth: 2,
                //         },
                //     });
                // }
                claimchain.neighbors?.forEach((ids) => {
                    let first = claimchain.plots.find((i) => i._id === ids[0]);
                    let second = claimchain.plots.find((i) => i._id === ids[1]);
                    if (first && second) {
                        lines.push({
                            coordinates: [first.centroid, second.centroid],
                            properties: {
                                ...colors,
                            },
                        });
                    }
                });
            });

            const source = initSource({
                plots,
                id: 'all_plot_explore',
                type: 'set_color_properties',
            });
            sendMessage({
                type: SEND_TYPE.addSource,
                source: source,
            });

            if (allUnion.length) {
                const source3 = initSource({
                    plots: allUnion,
                    id: 'all_union',
                    type: 'set_color_properties',
                    disabledClick: true,
                });

                sendMessage({
                    type: SEND_TYPE.addSource,
                    source: source3,
                });
            }
            //point and line
            const source2 = initSource({
                points,
                symbol: true,
                lines,
                id: 'all_plot_explore_marker',
                type: 'set_color_properties',
                // lineType: 'white',
                lineType: 'set_color_properties',
            });
            sendMessage({
                type: SEND_TYPE.addSource,
                source: source2,
            });
        }
    }, [statusMap, data]);

    const concatOwnerPlots = useCallback(() => {
        let plots = [];
        if (user?.plots) {
            plots = plots.concat(user?.plots);
        }
        if (user?.plotFlagged) {
            plots = plots.concat(user?.plotFlagged?.map((i) => i.plot));
        }

        return plots;
    }, [user?.plotFlagged, user?.plots]);

    useEffect(() => {
        // Request center and zoom after map is loaded
        if (!statusMap) return;
        sendMessage({
            type: SEND_TYPE.getCenterZoom,
        });
    }, [statusMap]);

    useFocusEffect(
        useCallback(() => {
            if (!statusMap) return;
            const numberOfPlots = user?.plots?.length + user?.plotFlagged?.length;
            if (!numberOfPlots) {
                // Reset position if no plots
                setCenter({
                    ref: webviewRef,
                    ...defaultCenter.current,
                });
                onOpen();
            }
            return () => onClose();
        }, [statusMap, user?.plotFlagged?.length, user?.plots?.length]),
    );

    const onEvent = (data) => {
        switch (data.type) {
            case RECEIVE_TYPE.online:
                setStatusMap(true);
                sendMessage({
                    type: SEND_TYPE.disabledFeatures,
                    features: ['doubleClickZoom', 'dragPan', 'touchZoomRotate', 'scrollZoom'],
                });
                break;
            case RECEIVE_TYPE.polygonClick:
                // onPlotSelected(data);
                break;
            case RECEIVE_TYPE.moveend:
                setPosition({ ...data.data });
                break;
            case RECEIVE_TYPE.getCenterZoom: // Receive center and zoom from map
                if (!defaultCenter.current) {
                    defaultCenter.current = data.data;
                }
            default:
                break;
        }
    };

    const refetchWhenFocus = useCallback(async () => {
        try {
            setLoadingUserPlots(true);
            let resUserPlots = await getUserPlots(user.userInfo._id, navigation, dispatch);
            dispatch(
                userSliceActions.setData({
                    plots: resUserPlots.data,
                }),
            );
        } catch (error) {
        } finally {
            setLoadingUserPlots(false);
        }
    }, [dispatch, navigation, user.userInfo._id]);

    useFocusEffect(
        useCallback(() => {
            refetchWhenFocus();
        }, [refetchWhenFocus]),
    );

    const [selectedPolygon, setSelectedPolygon] = useState(null);

    const mapStyles = {
        padding: {
            top: 160,
            bottom: 440,
            left: 160,
            right: 160,
        },
    };

    useFocusEffect(
        // Select polygon after 1s when screen is focused
        useCallback(() => {
            if (!selectedPolygon) return;
            const timer = setTimeout(() => {
                sendMessage({
                    type: SEND_TYPE.setSelectPolygon,
                    polygon: selectedPolygon,
                    styles: mapStyles,
                });
            }, 1000);

            return () => clearTimeout(timer);
        }, [selectedPolygon]),
    );

    useEffect(() => {
        // Set selected polygon to newest plot
        if (!statusMap) return;
        if (selectedPolygon) {
            if (!selectedPolygon?.needRefresh) return;
        }
        let _id = selectedPolygon?._id;
        let plots = concatOwnerPlots();
        if (_id) {
            const _plot = plots.find((plot) => plot._id === _id);
            if (_plot) {
                setSelectedPolygon({ ..._plot?.geojson, _id: _plot?._id });
                return;
            }
        }
        let newestPlot = plots[0];
        setSelectedPolygon({ ...newestPlot?.geojson, _id: newestPlot?._id });
    }, [statusMap, concatOwnerPlots, selectedPolygon]);

    useEffect(() => {
        sendMessage({
            type: SEND_TYPE.setSelectPolygon,
            polygon: selectedPolygon,
            styles: mapStyles,
        });
    }, [selectedPolygon]);

    /**
     * @type {import('react').MutableRefObject<import('react-native').VirtualizedList>}
     */
    const listRef = useRef();

    // Listen to unselectPolygon event
    useEffect(() => {
        DeviceEventEmitter.addListener(deviceEvents.plots.unSelectPolygon, () => {
            setTimeout(() => {
                setSelectedPolygon({
                    ...selectedPolygon,
                    needRefresh: true,
                });
                fetchPlots(true);
            }, 500);
            loadedBounds.current = null;
        });
        return () => DeviceEventEmitter.removeAllListeners(deviceEvents.plots.unSelectPolygon);
    });

    useEffect(() => {
        DeviceEventEmitter.addListener(deviceEvents.plots.selectPolygon, (polygon) => {
            setTimeout(() => {
                setSelectedPolygon(polygon);
                fetchPlots(true);
            }, 500);
            loadedBounds.current = null;
            listRef.current?.scrollToIndex({ index: 0 });
        });
        return () => DeviceEventEmitter.removeAllListeners(deviceEvents.plots.selectPolygon);
    }, []);

    // useEffect(() => {
    //     let listener = EventRegister.addEventListener(EVENT_NAME.refreshMap, () => {
    //         fetchPlots(true);
    //     });
    //     return () => EventRegister.removeEventListener(listener);
    // }, []);

    const t = useTranslate();

    return (
        <Box flex={1}>
            {!statusMap && <LoadingPage />}
            {statusMap && (
                <>
                    <AgentHeader />
                    <Box bgColor="white" h="62px">
                        <Box flex={1} flexDir="row" alignItems="center">
                            <AccountButton
                                position="relative"
                                top="1px"
                                left="0px"
                                ml="13px"
                                w="34px"
                                h="34px"
                            />
                            <Text fontWeight="bold" fontSize="16px" ml="12px">
                                {t('plot.myPlot')}
                            </Text>
                        </Box>
                    </Box>
                </>
            )}

            <Map
                useGlobalData={false}
                onEvent={onEvent}
                mapRef={webviewRef}
                // search={`features=1&controls=1`}
            />

            <Loading show={isFetchingPlots} />

            {statusMap && (
                <MyPlotsSwiper
                    webviewRef={webviewRef}
                    onSelectPlot={({ item }) => {
                        const polygon = item?.isFlagged ? item?.plot?.geojson : item?.geojson;
                        setSelectedPolygon({ ...polygon, _id: item?._id });
                    }}
                    isOpen={statusMap}
                    isLoading={loadingUserPlots}
                    ref={listRef}
                />
            )}
            <ModalNoPlots isOpen={isOpen} onClose={onClose} />
        </Box>
    );
}
