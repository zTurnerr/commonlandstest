import { Box, Text } from 'native-base';
import React, { useEffect, useRef } from 'react';
import useTranslate from '../../i18n/useTranslate';
import {
    getClosedCenterPlots,
    getPlotByID,
    getPlotByIDCompact,
    getPlotWaitAssign,
} from '../../rest_client/apiClient';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import Header from '../../components/Header';
import LoadingPage from '../../components/LoadingPage';
import useReqClaimantHook from '../../hooks/Plot/useReqClaimantHook';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import DefaultPlot from './DefaultPlot';
import FlaggedPlot from './PlotFlaggedInfo';

export default function Index(props) {
    const t = useTranslate();
    const { navigation, route } = props;
    const user = useShallowEqualSelector((state) => state.user);
    let { path } = route;
    const { plotID, longlat, requestAssignPlotId } = route.params || {};
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [statePlotID, setPlotID] = React.useState('');
    const [plotData, setPlotData] = React.useState();
    const [isFlagged, setIsFlagged] = React.useState(false);
    const refAnnounce = useRef({
        announce: {
            visible: false,
            status: 'success',
        },
    });

    const dispatch = useDispatch();
    useReqClaimantHook(plotID);
    useEffect(() => {
        if (plotID && plotID !== statePlotID) {
            setPlotID(plotID);
            initData();
        } else if (requestAssignPlotId) {
            initData();
        }
    }, [plotID, requestAssignPlotId]);

    const _getPlotData = async () => {
        try {
            let res = {};
            if (requestAssignPlotId && !plotID) {
                const {
                    data: { data },
                } = await getPlotWaitAssign(requestAssignPlotId, navigation, dispatch);

                let userInfo = user?.userInfo;

                let _claimants = data.request.claimants.map((claimant) => {
                    if (claimant?.id === userInfo?._id) {
                        return {
                            ...claimant,
                            ...userInfo,
                            type: null,
                            role: claimant?.type,
                            self: true,
                        };
                    } else return claimant;
                });

                const closedPlots = await getClosedCenterPlots(
                    { long: data?.request?.centroid[0], lat: data?.request?.centroid[1] },
                    navigation,
                    dispatch,
                );
                let newData = {
                    plot: {
                        geojson: data.request.geojson,
                        centroid: data.request.centroid,
                        name: data.request.name,
                        placeName: data.request.placeName,
                        area: data?.request?.area,
                        createdAt: data?.request?.createdAt,
                    },
                    claimants: _claimants,
                    subPlots: [],
                    closePlots: closedPlots.data?.closePlots,
                    role: 'guest',
                    neighbors: [],
                    claimchainSize: 1,
                    waitingAssign: data.status,
                };
                res.data = newData;
            } else if (user.isLogged) {
                res = await getPlotByID(plotID, navigation, dispatch);
            } else {
                res = await getPlotByIDCompact(plotID);
            }
            if (!res.data) {
                throw t('error.plotNotFound');
            }
            if (res.data && !res.data.isFlagged) {
                setPlotData(res.data);
                setIsFlagged(false);
            } else {
                setPlotData(res.data);
                setIsFlagged(true);
            }
        } catch (err) {
            console.log('first', err);
            throw err?.message || err;
        }
    };

    const initData = async () => {
        try {
            setIsLoading(true);
            setError('');
            await _getPlotData();
        } catch (err) {
            if (typeof err === 'string' && err.indexOf('4010') > -1) {
                setIsLoading(false);
                return setError(t('error.plotNotFound'));
                // return navigation.navigate('Welcome');
            } else if (typeof err === 'string' && err.indexOf('2006') > -1) {
                let params = {};
                if (path) {
                    params = { plotID, longlat };
                }
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Welcome', params }],
                });
                setIsLoading(false);
                return setError(t('others.pleaseLogin'));
            } else {
                setError(err);
                setIsLoading(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {!isLoading && !error && Boolean(plotData) ? (
                isFlagged ? (
                    <FlaggedPlot plotData={plotData} />
                ) : (
                    <DefaultPlot
                        {...props}
                        refAnnounce={refAnnounce}
                        resetData={initData}
                        plotData={plotData}
                    />
                )
            ) : (
                <>
                    <Header
                        icon={<MaterialCommunityIcons name="close" size={20} color="black" />}
                        title={t('others.plotView')}
                    />

                    {error ? (
                        <Box p="20px">
                            <Text textAlign="center" fontSize="14px" color="error.400" mt="30px">
                                {error ? error : t('others.notFoundPlot')}
                            </Text>
                        </Box>
                    ) : null}
                    <LoadingPage top="50px" />
                </>
            )}
        </>
    );
}
