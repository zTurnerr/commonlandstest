import { useNavigation } from '@react-navigation/native';
import { booleanContains } from '@turf/turf';
import { Box, useDisclose } from 'native-base';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useDispatch } from 'react-redux';
import AccountButton from '../../components/AccountButton';
import FilterButton from '../../components/FilterButton';
import AgentHeader from '../../components/Header/AgentHeader';
import LoadingPage from '../../components/LoadingPage';
import Map from '../../components/Map';
import useWorthwhileNumber from '../../hooks/useWorthwhileNumber';
import { fetchPlots, fetchPlotsLimited } from '../../redux/actions/map';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { mapSliceActions } from '../../redux/reducer/map';
import { userSliceActions } from '../../redux/reducer/user';
import { getCenterLargestClaimChain, getPlotByRectanglePublic } from '../../rest_client/apiClient';
import { setStatusFirstLogin } from '../../rest_client/authClient';
import Constants, {
    RECEIVE_TYPE,
    SEND_TYPE,
    deviceEvents,
    isShowCluster,
    setCenter,
} from '../../util/Constants';
import comparePolygon, { boundsToPolygon } from '../../util/comparePolygon';
import expandBounds from '../../util/expandBounds';
import { requestNotificationPermission, useNotification } from '../../util/hooks/useNotification';
import { getCurrentAccount } from '../../util/script';
import CheckSecretQuestion from './CheckSecretQuestion';
import Loading from './Loading';
import OverlapListPlots from './OverlapListPlots';
import PlotInfo from './PlotInfo';
import WelcomeToCommonlands from './WelcomeToCommonlands';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import { renderPublicPlot } from '../../util/cmlScript';

export default function Index() {
    const { mapReducer, user } = useShallowEqualSelector((state) => ({
        user: state.user,
        mapReducer: state.map,
    }));
    const { isLogged, plots } = user;
    const navigation = useNavigation();
    const webviewRef = useRef();
    const firstTime = useRef();
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclose();
    const [statusMap, setStatusMap] = useState(false);
    const [plotsOverlap, setPlotsOverlap] = useState([]);
    const [plotSelected, setPlotSelected] = useState({});
    const [currentPosition] = useState();
    const [loading, setLoading] = useState(true);
    const worthwhileNumber = useWorthwhileNumber();
    const { isOpen: isOpenLearn, onOpen: onOpenLearn, onClose: onCloseLearn } = useDisclose();
    const sendMessage = (data) => {
        webviewRef?.current?.postMessage(JSON.stringify(data));
    };
    const [textSearch, setTextSearch] = useState('');

    useNotification();
    // const _getCenterLargestClaimChain = async () => {
    //     try {
    //         const response = await getCenterLargestClaimChain();
    //         if (response?.data) {
    //             setPosition({
    //                 long: response?.data?.centroid[0],
    //                 lat: response?.data?.centroid[1],
    //             });
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };
    const _requestNotificationPermission = async () => {
        const currentAccount = await getCurrentAccount();
        if (currentAccount.notification) {
            await requestNotificationPermission();
        }
    };
    //get current position
    useEffect(() => {
        // _getCenterLargestClaimChain();
        _requestNotificationPermission();
        // Geolocation.getCurrentPosition((info) => {
        //     setPosition({
        //         long: info.coords.longitude,
        //         lat: info.coords.latitude,
        //     });
        //     dispatch(
        //         mapSliceActions.updateUserPosition({
        //             userPosition: {
        //                 long: info.coords.longitude,
        //                 lat: info.coords.latitude,
        //             },
        //         })
        //     );
        // });
    }, []);
    const renderPlots = (plots = []) => {
        // return
        // logObject(plots)
        renderPublicPlot({
            claimchains: plots,
            worthwhileNumber,
            addSource: (source) => {
                sendMessage({
                    type: SEND_TYPE.addSource,
                    source: source,
                });
            },
            selectPolygon: ({ polygon } = {}) => {
                sendMessage({
                    type: SEND_TYPE.setSelectPolygon,
                    polygon: polygon,
                });
            },
            firstTime: firstTime.current,
            setFirstTime: (v) => {
                firstTime.current = v;
            },
        });
    };
    const _renderCluster = (claimchains = []) => {
        try {
            let plots = claimchains?.map((i) => i.plots)?.flat();
            sendMessage({
                type: SEND_TYPE.renderCluster,
                plots,
            });
        } catch (err) {
            console.log(err);
        }
    };

    //render source
    useEffect(() => {
        if (statusMap) setLoading(false);
    }, [statusMap]);

    const showCluster = useMemo(
        () => isShowCluster(mapReducer.currentPosition.zoom),
        [mapReducer.currentPosition.zoom],
    );

    useEffect(() => {
        if (!statusMap || loading) return;

        if (showCluster) {
            _renderCluster(mapReducer.plotsCluster);
            renderPlots([]);
        } else {
            renderPlots(mapReducer.plots);
            _renderCluster([]);
        }
    }, [mapReducer.plots, mapReducer.plotsCluster, statusMap, showCluster, loading]);

    // set center map
    // useEffect(() => {
    // if (statusMap) {
    // if (user.plots) {
    //     let newestPlot = user.plots[0];
    //     if (newestPlot) {
    //         return setCenter({
    //             ref: webviewRef,
    //             long: newestPlot.centroid[0],
    //             lat: newestPlot.centroid[1],
    //         });
    //     }
    // }
    // if (mapReducer.userPosition) {
    //     return setCenter({
    //         ref: webviewRef,
    //         ...mapReducer.userPosition,
    //     });
    // }

    // }
    // }, [statusMap, mapReducer.userPosition, user.plots]);
    useEffect(() => {
        if (statusMap && currentPosition) {
            setCenter({
                ref: webviewRef,
                ...currentPosition,
            });
        }
    }, [statusMap]);

    const updateFirstLogin = async () => {
        try {
            await setStatusFirstLogin();
        } catch (err) {
            console.log('updateFirstLogin', err);
        }
    };

    useEffect(() => {
        if (user.isLogged && user.userInfo.firstLogin) {
            onOpenLearn();
            dispatch(
                userSliceActions.updateUserInfo({
                    userInfo: { firstLogin: false },
                }),
            );
            updateFirstLogin();
        }
    }, [user]);

    const onPlotSelected = ({ plots }) => {
        if (plots?.length === 1) {
            let plot = plots[0];
            setPlotsOverlap([]);
            let _plot = mapReducer.plots
                .map((i) => i.plots)
                ?.flat()
                ?.find((p) => p.id === plot.id);
            if (_plot) {
                setPlotSelected({
                    ..._plot,
                    claimchainSize: plot.claimchainSize,
                });
                sendMessage({
                    type: SEND_TYPE.setSelectPolygon,
                    polygon: _plot.geojson,
                });
                onOpen();
            }
            return;
        }
        setPlotsOverlap(plots);
    };

    useEffect(() => {
        console.log(
            '[Explore] mount component at',
            new Date().toLocaleTimeString(),
            new Date().getMilliseconds(),
        );
    }, []);

    const onEvent = (data) => {
        switch (data.type) {
            case RECEIVE_TYPE.online:
                console.log(
                    '[Explore] Mapbox online at',
                    new Date().toLocaleTimeString(),
                    new Date().getMilliseconds(),
                );
                setStatusMap(true);
                break;
            case RECEIVE_TYPE.polygonClick:
                onPlotSelected(data);
                break;
            default:
                break;
        }
    };

    const _onClose = useCallback(
        (onBack) => {
            if (!onBack) {
                setPlotsOverlap([]);
            }
            onClose();
            setPlotSelected({});
            sendMessage({
                type: SEND_TYPE.setSelectPolygon,
            });
        },
        [onClose],
    );

    const loadedBounds = useRef(null);
    const [isFetchingPlots, setIsFetchingPlots] = useState(0);

    useEffect(() => {
        fetchPlotsInternal();
    }, [mapReducer.currentPosition]);

    useEffect(() => {
        fetchPlotsInternal(true); // Always refetch when filter change
    }, [mapReducer.filter]);

    useEffect(() => {
        _onClose(); // Always close plot info when user's plots change (create, update, delete)
        fetchPlotsInternal(true); // Always refetch when user's plots change (create, update, delete)
    }, [plots]);

    useEffect(() => {
        fetchPlotsInternal(true); // Always refetch when showCluster change (zoom level change)
    }, [showCluster]);

    useEffect(() => {
        const listener = EventRegister.addEventListener(EVENT_NAME.refreshMap, () => {
            fetchPlotsInternal(true);
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    // Fetch plots when open app
    useEffect(() => {
        (async () => {
            try {
                setIsFetchingPlots((prev) => ++prev); // Increase fetching counter
                const {
                    data: { centroid },
                } = await getCenterLargestClaimChain();

                /**
                 * @type {import('./src/types/Bounds').Bounds}
                 */
                const bounds = {
                    _ne: {
                        lng: centroid[0] + 0.01,
                        lat: centroid[1] + 0.02,
                    },
                    _sw: {
                        lng: centroid[0] - 0.01,
                        lat: centroid[1] - 0.02,
                    },
                };

                const expandedBounds = expandBounds(bounds);
                loadedBounds.current = expandedBounds;
                const {
                    data: { claimchains },
                } = await getPlotByRectanglePublic(expandedBounds);
                dispatch(mapSliceActions.updatePlots({ plots: claimchains }));
            } catch (err) {
                console.log('[Explore]', err);
            } finally {
                setIsFetchingPlots((prev) => --prev); // Decrease fetching counter
            }
        })();
    }, [dispatch]);

    /**
     * @description Fetch plots
     * @param {boolean} force - Skip check loadedBounds and force to fetchPlots
     */
    const fetchPlotsInternal = async (force = false) => {
        try {
            if (mapReducer.currentPosition.bounds) {
                // Load more plots
                const bounds = { ...mapReducer.currentPosition.bounds };
                const expandedBounds = expandBounds(bounds);

                if (loadedBounds.current && !force) {
                    const loadedPolygon = boundsToPolygon(loadedBounds.current);
                    const expandedPolygon = boundsToPolygon(expandedBounds);
                    const similar = comparePolygon(loadedPolygon, expandedPolygon);
                    if (similar >= 70) return; // Skip if expandedBounds is similar to loadedBounds
                    console.log(
                        '[Explore] expandedBounds is similar to loadedBounds',
                        similar,
                        '%',
                    );
                    if (booleanContains(loadedPolygon, expandedPolygon)) return; // Skip if loadedBounds contains expandedBounds
                }

                setIsFetchingPlots((prev) => ++prev); // Increase fetching counter
                loadedBounds.current = JSON.parse(JSON.stringify(expandedBounds));

                const filter = mapReducer?.filter;
                let _filter = {
                    excludeUnconnectedPlot: filter?.showUnConnect,
                    sizes: filter?.showClaimchain.filter((i) => Boolean(i)),
                    plotStatus: filter?.status,
                };

                if (!isShowCluster(mapReducer.currentPosition.zoom)) {
                    dispatch(
                        fetchPlots(
                            { ...expandedBounds, filter: _filter },
                            navigation,
                            (err) => {
                                setIsFetchingPlots((prev) => --prev); // Decrease fetching counter

                                if (err) {
                                    //to do some thing
                                }
                            },
                            isLogged,
                        ),
                    );
                } else {
                    dispatch(
                        fetchPlotsLimited(
                            { ...expandedBounds, filter: _filter },
                            navigation,
                            (err) => {
                                setIsFetchingPlots((prev) => --prev); // Decrease fetching counter

                                if (err) {
                                    //to do some thing
                                }
                            },
                            isLogged,
                        ),
                    );
                }
            }
        } catch (err) {
            console.log('[Explore]', err);
        }
    };

    useEffect(() => {
        // Listen to set center
        DeviceEventEmitter.addListener(deviceEvents.explore.centroid, (data) => {
            setCenter({
                ref: webviewRef,
                long: data[0],
                lat: data[1],
            });
        });

        return () => DeviceEventEmitter.removeAllListeners(deviceEvents.explore.centroid);
    }, []);

    useEffect(() => {
        // Listen to set filter
        DeviceEventEmitter.addListener(deviceEvents.explore.filter, ({ plot, textSearch }) => {
            if (textSearch) {
                setTextSearch(textSearch);
            }
            if (plot) {
                setPlotSelected(plot);
                sendMessage({
                    type: SEND_TYPE.setSelectPolygon,
                    polygon: plot?.geojson,
                });
                onOpen();
            }
        });
        return () => DeviceEventEmitter.removeAllListeners(deviceEvents.explore.filter);
    }, [onOpen]);

    const handleSelectPlot = useCallback(({ item }) => {
        webviewRef?.current?.postMessage(
            JSON.stringify({
                type: SEND_TYPE.setSelectPolygon,
                polygon: item.geojson,
            }),
        );
    }, []);

    return (
        <Box flex={1}>
            {!statusMap && <LoadingPage />}
            {!loading && statusMap && <AgentHeader />}
            {!loading && statusMap && <AccountButton />}
            {!loading && statusMap && <FilterButton textSearch={textSearch} />}

            <Map
                onEvent={onEvent}
                mapRef={webviewRef}
                search={`features=1,2&controls=1,2,4${
                    currentPosition
                        ? `&longlat=${currentPosition.long},${currentPosition.lat}&zoom=${Constants.minZoomShowCluster}`
                        : ''
                }`}
            />
            <Loading show={!!isFetchingPlots} />
            <PlotInfo
                isOpen={isOpen}
                onClose={_onClose}
                plotID={plotSelected?._id}
                plotSelected={plotSelected}
                showBackButton={!!plotsOverlap.length}
                claimchainSize={plotSelected?.claimchainSize}
                webviewRef={webviewRef}
                onSelectPlot={handleSelectPlot}
            />
            <WelcomeToCommonlands onClose={onCloseLearn} isOpen={isOpenLearn && !loading} />
            <OverlapListPlots
                isOpen={Boolean(plotsOverlap.length) && !isOpen}
                onClose={() => setPlotsOverlap([])}
                plots={plotsOverlap}
                onSelectPlot={(plot) => {
                    if (!plot) {
                        return sendMessage({
                            type: SEND_TYPE.setSelectPolygon,
                            polygon: null,
                        });
                    }
                    try {
                        let _plot = mapReducer.plots
                            .map((i) => i.plots)
                            ?.flat()
                            ?.find((p) => p.id === plot.id);
                        sendMessage({
                            type: SEND_TYPE.setSelectPolygon,
                            polygon: _plot.geojson,
                        });
                    } catch (err) {}
                }}
            />
            <CheckSecretQuestion />
        </Box>
    );
}
