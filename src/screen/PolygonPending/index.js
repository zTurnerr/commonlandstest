import React, { useEffect, useRef } from 'react';
import Header from '../../components/Header';
import { Box, ChevronDownIcon, ChevronUpIcon, HStack, Text, useDisclose } from 'native-base';
import useTranslate from '../../i18n/useTranslate';
import moment from 'moment';
import GroupButtonApproveEdit from './GroupButtonApproveEdit';
import Map from '../../components/Map';
import { Alert, TouchableOpacity } from 'react-native';
import PaperApprove from './PaperApprove';
import ModalReason from './ModalReason';
import { useState } from 'react';
import { useMemo } from 'react';
import {
    deepClone,
    getDataForRenderWithPlot,
    initSource,
    RECEIVE_TYPE,
    SEND_TYPE,
    setCenter,
} from '../../util/Constants';
import {
    getClosedCenterPlots,
    getEditPlotPolygon,
    getEditPlotPolygonHistory,
    getPlotByRectangle,
    voteEditPlotPolygon,
} from '../../rest_client/apiClient';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import EditPolygonSwipe from './EditPolygonSwipe';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import { getRoleFromClaimants } from '../../util/utils';
import LoadingPage from '../../components/LoadingPage';
import * as Turf from '@turf/turf';
import expandBounds from '../../util/expandBounds';

const featuresOfMap = ['doubleClickZoom', 'dragPan', 'touchZoomRotate', 'scrollZoom'];
const Index = ({ route }) => {
    const { plotId, namePlot, disputePlotId, viewHistory, disputePlotName } = route?.params;
    const t = useTranslate();
    const { isOpen: isOpenAllApprove, onToggle: onToggleAllApprove } = useDisclose();
    const [polygonEditing, setPolygonEditing] = useState(null);
    const [plotData, setPlotData] = useState(null);
    const [infoRejectedPlot, setInfoRejectedPlot] = useState(null);
    const [statusMap, setStatusMap] = useState(false);
    const { user } = useShallowEqualSelector((state) => ({
        user: state.user,
    }));

    const [, setActiveMarker] = useState(null);

    const getStyleMap = () => {
        if (isOpenAllApprove) {
            return { position: 'absolute', opacity: 0 };
        } else return {};
    };

    const { isOpen: isOpenReason, onClose: onCloseReason, onOpen: onOpenReason } = useDisclose();
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [reason, setReason] = useState(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const webviewRef = useRef();

    const sendMessage = (data) => {
        webviewRef?.current?.postMessage(JSON.stringify(data));
    };

    const votingExist = useMemo(() => {
        if (!polygonEditing) return false;
        if (!plotData) return false;
        const voteNow = polygonEditing?.voteInfo?.[namePlot];
        if (!voteNow) return false;
        let _approve = voteNow?.filter((item) => item?.status === 'approved');
        if (
            _approve?.length === voteNow?.length &&
            Object.keys(polygonEditing?.voteInfo).length !== 1
        ) {
            let _vote = [],
                approval = 0;
            Object.keys(polygonEditing?.voteInfo).forEach((key) => {
                if (key === namePlot) {
                } else {
                    let plot = polygonEditing?.voteInfo?.[key];
                    let rowUser = [];
                    let isApprove = !plot.find((item) => item?.status !== 'approved');
                    let isRejected = plot.find((item) => item?.status === 'rejected');
                    let userInVote = plot.find(
                        (item) =>
                            item?.userVote?._id === user?.userInfo?._id &&
                            item?.status === 'pending' &&
                            key === disputePlotName,
                    );
                    let status;
                    if (isApprove) {
                        ++approval;
                        status = 'approved';
                    } else if (isRejected) status = 'rejected';
                    else {
                        status = 'pending';
                    }

                    rowUser = plot.map((item) => ({
                        name: item?.userVote?.name,
                        status: item?.status,
                        role: item?.userVote?.claimantType,
                        reason: item?.note,
                    }));

                    rowUser = getRoleFromClaimants(rowUser);
                    let _smallVote = {
                        fullName: `${t('bottomTab.plot')} ${key}`,
                        status: status,
                        // reason: status === 'rejected' ? isRejected?.note : null,
                        userVote: userInVote?.userVote,
                        _id: userInVote?._id,
                        rowUser,
                    };
                    _vote.push(_smallVote);
                }
            });
            return {
                approval: approval,
                voteRound: _vote,
                owner: false,
            };
        } else {
            let claimantOwner = false;
            if (
                voteNow[0]?.userVote?.claimantType === 'owner' ||
                voteNow[0]?.userVote?.claimantType === 'co-owner'
            ) {
                claimantOwner = true;
            }
            return {
                approval: _approve?.length,
                voteRound: voteNow.map((item) => {
                    return {
                        ...item,
                        fullName: item?.userVote?.name,
                    };
                }),
                owner: true,
                claimantOwner,
            };
        }
    }, [polygonEditing, plotData]);

    const userInVote = useMemo(() => {
        if (!polygonEditing) return null;
        if (!plotData) return null;
        if (!votingExist) return null;
        const _userInVote = votingExist?.voteRound?.find(
            (item) => item?.userVote?._id === user?.userInfo?._id,
        );
        return _userInVote;
    }, [polygonEditing, plotData, votingExist, user?.userInfo]);

    const needToShowButton = useMemo(() => {
        if (!polygonEditing) return false;
        if (!plotData) return false;
        if (!votingExist) return false;
        if (polygonEditing?.ghostPlot?.status !== 'pending') return false;
        if (userInVote && userInVote?.status === 'pending') return true;
        return false;
    }, [polygonEditing, plotData, votingExist, userInVote]);

    const onViewReason = (item) => {
        setReason(item?.reason);
        const _plot = plotData?.closePlots.find(
            (smallPlot) => item?.plotName === `${t('bottomTab.plot')} ${smallPlot?.name}`,
        );
        setInfoRejectedPlot(_plot);
        onOpenReason();
    };

    const onCloseModal = () => {
        onCloseReason();
        setReason(null);
    };

    const onPressApprove = async () => {
        try {
            setError('');
            setLoading('approve');
            await voteEditPlotPolygon({
                data: { status: 'approved' },
                voteId: userInVote?._id,
            });

            EventRegister.emit(EVENT_NAME.goodAlert, t('polygonEditing.approveSuccessfully'));

            if (
                votingExist?.owner &&
                Object.keys(polygonEditing?.voteInfo).length > 1 &&
                votingExist.approval < votingExist?.voteRound?.length - 1
            ) {
                fetchEditing(false);
            } else {
                navigation.goBack();
            }
        } catch (err) {
            setError(err);
        }
        setLoading(null);
    };

    const onPressDecline = async () => {
        if (votingExist?.owner) {
            try {
                setLoading('decline');
                await voteEditPlotPolygon({
                    data: { status: 'rejected' },
                    voteId: userInVote?._id,
                });
                EventRegister.emit(EVENT_NAME.refetchPlotData);
                navigation.goBack();
            } catch (e) {
                setError(e);
            }
            setLoading(null);
        } else {
            setReason(null);
            onOpenReason();
        }
    };

    const onSubmitFromNeighbor = async (note) => {
        try {
            setError('');
            setLoading('submit');
            await voteEditPlotPolygon({
                data: { status: 'rejected', note },
                voteId: userInVote?._id,
            });
            navigation.goBack();
            onCloseModal();
        } catch (e) {
            setError(e);
        }
        setLoading(null);
    };

    const fetchEditing = async (fetchAround = true) => {
        try {
            let data, res;
            try {
                setLoading('fetch');
                if (viewHistory) {
                    res = await getEditPlotPolygonHistory(plotId, navigation, dispatch);
                    data = res.data?.latestHistory;
                } else {
                    res = await getEditPlotPolygon(plotId);
                    data = res.data;
                }
            } catch (err) {
                if (err?.includes('No pending edit plot request')) {
                    setLoading(null);
                    navigation.goBack();
                } else throw err;
            }
            setPolygonEditing(data);
            if (fetchAround) {
                fetchPlotData(data?.ghostPlot);
            }
            setLoading(null);
        } catch (err) {
            Alert.alert(err);
        }
        setLoading(null);
    };

    const settingPlotData = (closePlots, ghostPlot) => {
        let data = {};
        let _closePlots = closePlots;
        _closePlots = _closePlots?.filter((plot) => plot?.name !== namePlot);
        data.closePlots = _closePlots;

        data.closePlots.push({ ...ghostPlot, active: true });
        data.plot = {
            ...ghostPlot,
            centroid: ghostPlot?.centroid?.coordinates,
        };
        setPlotData(data);
    };

    const fetchPlotData = async (ghostPlot) => {
        try {
            const polygon = Turf.polygon(ghostPlot?.geojson?.geometry?.coordinates);
            const bbox = Turf.bbox(polygon);
            let _bounds = {
                _sw: {
                    lng: bbox[0],
                    lat: bbox[1],
                },
                _ne: {
                    lng: bbox[2],
                    lat: bbox[3],
                },
            };
            const expandedBounds = expandBounds(_bounds);
            let resPlots = await getPlotByRectangle(
                { ...expandedBounds },
                navigation,
                {},
                dispatch,
            );
            const totalPlots = [];
            resPlots?.data?.claimchains?.forEach((item) => {
                totalPlots.push(...item?.plots);
            });

            const closedPlots = await getClosedCenterPlots(
                {
                    long: ghostPlot?.centroid?.coordinates[0],
                    lat: ghostPlot?.centroid?.coordinates[1],
                },
                navigation,
                dispatch,
            );
            let _closePlots = closedPlots?.data?.closePlots || [];
            if (_closePlots?.length > totalPlots?.length) {
                settingPlotData(_closePlots, ghostPlot);
            } else {
                settingPlotData(totalPlots, ghostPlot);
            }
        } catch (err) {
            Alert.alert(err);
        }
    };

    useEffect(() => {
        if (plotId) {
            fetchEditing();
        }
    }, [plotId]);

    const lockMap = () => {
        sendMessage({
            type: SEND_TYPE.disabledFeatures,
            features: featuresOfMap,
        });
    };

    const onEvent = (data) => {
        try {
            switch (data.type) {
                case RECEIVE_TYPE.online:
                    setStatusMap(true);
                    sendMessage({
                        type: SEND_TYPE.removeControl,
                        controls: ['geolocateControl', 'navigationControl', 'drawControl'],
                    });
                    lockMap();
                    break;
                default:
                    break;
            }
        } catch (err) {}
    };

    const centerMap = () => {
        setCenter({
            ref: webviewRef,
            long: plotData?.plot?.centroid[0],
            lat: plotData?.plot?.centroid[1],
            zoom: 12,
        });
    };

    const onToggleMarker = (item) => {
        let isActive = false;
        setActiveMarker((prev) => {
            isActive = prev === item?.id;
            sendMessage({
                type: SEND_TYPE.addMarker,
                longlat: isActive ? null : item?.centroid?.coordinates || item.centroid,
                style: {
                    color: 'red',
                },
            });
            return isActive ? null : item?.id;
        });
    };

    useEffect(() => {
        if (polygonEditing && disputePlotId && statusMap) {
            onToggleMarker(polygonEditing?.ghostPlot);
        }
    }, [polygonEditing, disputePlotId, statusMap]);

    const isOwnerPlot = (plot) => {
        let found = user.plots?.some((p) => p.id === plot.id);
        return found;
    };

    const renderPlot = () => {
        try {
            let plots = [];
            let boundsPolygon = {
                geometry: { type: 'Polygon', coordinates: [[]] },
                type: 'Feature',
            };
            //init plots data
            for (const plot of plotData.closePlots) {
                let _plot = deepClone(plot);

                _plot.isOwner = isOwnerPlot(plot);
                let colors = {
                    fillColor: 'rgba(42, 184, 73, 0.65)',
                    color: 'rgba(42, 184, 73, 0.65)',
                    fillOpacity: 0.6,
                };
                _plot.properties = {
                    ...colors,
                };
                // set color for plot is active
                if (disputePlotId === _plot._id) {
                    _plot.properties.fillOpacity = 1;
                    _plot.properties.color = 'rgba(58, 151, 173, 1)';
                    _plot.properties.outlineColor = 'rgba(255, 255, 255, 1)';
                } else if (_plot?.active) {
                    _plot.properties.fillColor = 'rgba(255, 218, 163, 1)';
                    _plot.properties.fillOpacity = 1;
                    _plot.properties.color = 'rgba(128, 228, 50, 0.3)';
                    _plot.properties.outlineColor = 'rgba(255, 218, 163, 1)';
                } else {
                    const { fillColor, outlineColor } = getDataForRenderWithPlot(_plot, colors);
                    _plot.properties = {
                        ...colors,
                        color: fillColor,
                        fillColor,
                        outlineColor,
                    };
                }

                plots.push(_plot);
                //make bounds polygon
                boundsPolygon.geometry.coordinates[0] =
                    boundsPolygon.geometry.coordinates[0].concat(
                        _plot.geojson.geometry.coordinates[0],
                    );
            }

            //add first coordinate and owner polygon to bounds polygon
            boundsPolygon.geometry.coordinates[0] = [
                plotData.plot.geojson.geometry.coordinates[0][
                    plotData.plot.geojson.geometry.coordinates[0].length - 1
                ],
                ...boundsPolygon.geometry.coordinates[0].concat(
                    plotData.plot.geojson.geometry.coordinates[0],
                ),
            ];

            const source = initSource({
                plots: plots,
                id: 'around_plot',
                type: 'fill_by_color_properties',
            });

            sendMessage({
                type: SEND_TYPE.fitBoundsByPolygon,
                polygon: boundsPolygon,
            });
            sendMessage({
                type: SEND_TYPE.addSource,
                source: source,
            });
        } catch (err) {}
    };

    useEffect(() => {
        if (plotData && statusMap) {
            centerMap();
            renderPlot();
        }
    }, [plotData, statusMap]);

    const disputes = useMemo(() => {
        if (votingExist?.owner) return [];
        if (disputePlotId) return [];
        if (!plotData?.closePlots) return [];
        return plotData?.closePlots?.filter((plot) => {
            return votingExist.voteRound.some((vote) => vote?.fullName?.includes(plot.name));
        });
    }, [votingExist, plotData, disputePlotId]);

    const title = useMemo(() => {
        if (loading) return '';
        if (!votingExist) return '';
        if (votingExist?.owner) return t('components.newUpdated');
        return t('polygonEditing.newBoundaryDisputeStatus');
    }, [votingExist, loading]);

    const approvalText = useMemo(() => {
        if (loading) return '';
        if (!votingExist) return '';
        let txt = '';
        if (votingExist?.owner) {
            txt = 'components.approvedByClaimants';
            if (votingExist?.claimantOwner) txt = 'transferOwnership.approvedOwners';
        } else {
            if (votingExist?.voteRound?.length > 1) {
                txt = 'components.approvedByNeighbors';
            } else {
                txt = 'components.approvedByNeighbor';
            }
        }
        return t(txt, {
            number: votingExist?.approval,
            total: votingExist?.voteRound?.length,
        });
    }, [votingExist, loading]);

    return (
        <>
            {loading === 'fetch' && <LoadingPage zIndex={100} />}
            <Header title={title} shadow={'none'} style={styles.header} />
            <Box
                bgColor={'white'}
                pl={'58px'}
                borderBottomWidth={1}
                borderBottomColor={'appColors.divider'}
                w={'full'}
                pb={'20px'}
            >
                <Text color={'black:alpha.60'}>
                    {t('components.editedAtBy', {
                        user: polygonEditing?.creator?.name,
                        time: moment(polygonEditing?.ghostPlot?.createdAt).format('MMM DD, YYYY'),
                    })}
                </Text>
            </Box>

            <Box flex={1}>
                <Box bgColor={'white'} px={'20px'} py={'10px'}>
                    <HStack alignItems={'center'}>
                        <Text flex={1} fontSize={12} fontWeight={600}>
                            {approvalText}
                        </Text>
                        <TouchableOpacity onPress={onToggleAllApprove}>
                            <Box bgColor={'gray.2200'} p={'10px'} borderRadius={'full'}>
                                {isOpenAllApprove ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            </Box>
                        </TouchableOpacity>
                    </HStack>
                </Box>

                <Box flex={1} position={'relative'}>
                    {isOpenAllApprove && (
                        <PaperApprove data={votingExist?.voteRound} onViewReason={onViewReason} />
                    )}
                    <Box style={getStyleMap()}>
                        <Map useGlobalData={false} onEvent={onEvent} mapRef={webviewRef} />
                        {disputes?.length > 0 && (
                            <EditPolygonSwipe disputes={disputes} onPress={onToggleMarker} />
                        )}
                    </Box>
                </Box>
            </Box>
            {needToShowButton && (
                <GroupButtonApproveEdit
                    title={
                        !polygonEditing?.allOwnersVoted
                            ? t('polygonEditing.newPolygonApprove')
                            : t('polygonEditing.approveForModifiedPlot', { plot: namePlot })
                    }
                    onApprove={onPressApprove}
                    onDecline={onPressDecline}
                    error={error}
                    loading={loading}
                />
            )}
            <ModalReason
                isVisible={isOpenReason}
                onClose={onCloseModal}
                onSubmit={onSubmitFromNeighbor}
                inputReason={!reason}
                reason={reason}
                loading={loading}
                error={error}
                info={infoRejectedPlot}
            />
        </>
    );
};

export default Index;

const styles = {
    header: {
        pb: '0px',
    },
};
