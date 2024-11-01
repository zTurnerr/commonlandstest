import * as Turf from '@turf/turf';

import { Box } from 'native-base';
import {
    RECEIVE_TYPE,
    SEND_TYPE,
    deepClone,
    getColors,
    getDataForRenderWithPlot,
    initSource,
    setCenter,
} from '../../util/Constants';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import LoadingPage from '../../components/LoadingPage';
import Map from '../../components/Map';
import MyPlotsSwiper from './MyPlotsOffSwiper';
import { getPlotByRectangle, getUserPlots } from '../../rest_client/apiClient';
import { useDisclose } from 'native-base';
import { useDispatch } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/core';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import useWorthwhileNumber from '../../hooks/useWorthwhileNumber';
import { userSliceActions } from '../../redux/reducer/user';
import { buildPolygon } from '../../util/polygon';
import useGetTotalPlot from '../../hooks/Plot/useGetTotalPlot';

export default function Index({ plots, step }) {
    const { user } = useShallowEqualSelector((state) => ({
        user: state.user,
    }));
    const { isTraining } = useGetTotalPlot();
    const worthwhileNumber = useWorthwhileNumber();
    const navigation = useNavigation();
    const webviewRef = useRef();
    const firstTime = useRef();
    const { onOpen, onClose } = useDisclose();
    const [statusMap, setStatusMap] = useState(false);
    const [currentPosition, setPosition] = useState();
    const [initPosition] = useState();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();

    const plotsFromParams = plots;

    const styleMapSelect = {
        padding: {
            top: isTraining ? 170 : 175,
            bottom: 300,
            left: 160,
            right: 160,
        },
    };

    const sendMessage = (data) => {
        webviewRef?.current?.postMessage(JSON.stringify(data));
    };
    const dispatch = useDispatch();

    useEffect(() => {
        fetchPlots();
    }, [currentPosition]);

    useEffect(() => {
        firstTime.current = false;
        fetchPlots('');
    }, [user.plots]);

    const fetchPlots = async () => {
        if (!currentPosition || !currentPosition.bounds) {
            return;
        }
        try {
            let res = await getPlotByRectangle(currentPosition.bounds, navigation, null, dispatch);
            setData(res.data.claimchains);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };
    //render source
    useEffect(() => {
        if (statusMap && data) {
            if (loading) {
                setLoading(false);
            }
            let plots = [],
                lines = [],
                points = [],
                allUnion = [];
            data?.forEach((claimchain) => {
                //get color data default with claimchain size
                let colors = getColors({ numberClaimchain: claimchain.size });

                let unionPolygon;
                claimchain.plots.forEach((plot, index) => {
                    if (claimchain.size >= worthwhileNumber) {
                        if (!index) {
                            unionPolygon = plot.geojson;
                        } else {
                            unionPolygon = Turf.union(unionPolygon, plot.geojson);
                        }
                    }
                    let _plot = deepClone(plot);
                    // get color data by plot status
                    const { fillColor, outlineColor, iconName } = getDataForRenderWithPlot(
                        plot,
                        colors,
                    );
                    _plot.properties = {
                        ...colors,
                        fillColor,
                        outlineColor,
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
                });

                if (claimchain.size >= worthwhileNumber) {
                    allUnion.push({
                        geojson: unionPolygon,
                        properties: {
                            outlineColor: 'white',
                            fillColor: 'transparent',
                            lineWidth: 2,
                        },
                    });
                }
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

            if (plotsFromParams.length > 0) {
                plotsFromParams.forEach((plot) => {
                    let _plot = deepClone(plot);

                    _plot.geojson = buildPolygon({
                        coordinates: _plot.coordinates,
                        centroid: _plot.centroid,
                    }).geojson;
                    let _colors = getColors({ numberClaimchain: 1 });
                    const { fillColor, outlineColor } = getDataForRenderWithPlot(plot, _colors);
                    _plot.properties = {
                        ..._colors,
                        fillColor,
                        outlineColor,
                        claimchainSize: 1,
                        centroid: plot.centroid,
                    };
                    plots.push(_plot);
                });
            }

            const source = initSource({
                plots,
                id: 'all_plot_explore',
                type: 'set_color_properties',
            });
            sendMessage({
                type: SEND_TYPE.addSource,
                source: source,
            });
            if (!firstTime.current) {
                let plots = concatOwnerPlots();
                let newestPlot = plots[0];
                if (newestPlot) {
                    firstTime.current = true;
                    sendMessage({
                        type: 'setSelectPolygon',
                        polygon: newestPlot.geojson,
                        styles: styleMapSelect,
                    });
                } else {
                    sendMessage({
                        type: 'setSelectPolygon',
                        polygon: null,
                    });
                }
            }
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
    const concatOwnerPlots = () => {
        const _plots = [];
        plots.forEach((i) => {
            let item = buildPolygon({
                coordinates: i.coordinates,
                centroid: i.centroid,
            });
            _plots.push(item);
        });

        return _plots;
    };
    // set center map
    useEffect(() => {
        if (statusMap) {
            let plots = concatOwnerPlots();
            if (plots.length) {
                let newestPlot = plots[0];
                if (newestPlot) {
                    // setPlotSelected(newestPlot);
                    return setCenter({
                        ref: webviewRef,
                        long: newestPlot?.centroid?.[0],
                        lat: newestPlot?.centroid?.[1],
                    });
                }
            }
            if (currentPosition) {
                return setCenter({
                    ref: webviewRef,
                    ...currentPosition,
                });
            }
            const length = user?.plots?.length + user?.plotFlagged?.length;
            if (length === 0) {
                if (user.isLogged) {
                    onOpen();
                }
                return setLoading(false);
            }
        }
        return () => {
            onClose();
        };
    }, [statusMap, user?.plots, user?.plotFlagged]);

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
            default:
                break;
        }
    };

    async function refetchWhenFocus() {
        let resUserPlots = await getUserPlots(user.userInfo._id, navigation, dispatch);
        dispatch(
            userSliceActions.setData({
                plots: resUserPlots.data,
            }),
        );
    }

    useFocusEffect(
        React.useCallback(() => {
            refetchWhenFocus();
        }, []),
    );

    const getStyleOnStep = useCallback(() => {
        if (step > 0) {
            return {
                opacity: 0,
                position: 'absolute',
            };
        } else return null;
    }, [step]);

    return (
        <Box flex={1} style={getStyleOnStep()}>
            {loading && <LoadingPage />}
            <Map
                useGlobalData={false}
                onEvent={onEvent}
                mapRef={webviewRef}
                search={`features=1&controls=1${
                    initPosition ? `&longlat=${initPosition.long},${initPosition.lat}` : ''
                }`}
            />
            {statusMap && (
                <MyPlotsSwiper
                    webviewRef={webviewRef}
                    onSelectPlot={({ item }) => {
                        const polygon = buildPolygon({
                            coordinates: item?.coordinates,
                            centroid: item?.centroid,
                        });
                        sendMessage({
                            type: 'setSelectPolygon',
                            polygon: polygon.geojson,
                            styles: styleMapSelect,
                        });
                    }}
                    isOpen={statusMap}
                    dataOffline={plots}
                />
            )}
        </Box>
    );
}
