/* eslint-disable react-native/no-inline-styles */
import { Box, Spinner, Text, useDisclose, useTheme } from 'native-base';

import { useNetInfo } from '@react-native-community/netinfo';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Mapbox from '@rnmapbox/maps';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import ButtonChip from '../../components/Button/ButtonChip';
import Header from '../../components/Header';
import { AddSquare, CloudOffline } from '../../components/Icons';
import useTranslate from '../../i18n/useTranslate';
import { OVERLAP_ERROR, RN_MAPBOX_ACCESS_TOKEN, getStorage } from '../../util/Constants';
import { buildPolygon, validatePolygon } from '../../util/polygon';
import ReactNativeMapbox from '../OfflineCreatePlot/ReactNativeMapBox';
import CheckUseOfflineMap from './CheckUseOfflineMap';
import ModalCreatePlot from './ModalCreatePlot';
import ModalEmptyMap from './ModalEmptyMap';
import SwiperOfflinePlot from './SwiperOfflinePlot';

Mapbox.setAccessToken(RN_MAPBOX_ACCESS_TOKEN);

export default function Index() {
    const [data, setData] = useState([]);
    const theme = useTheme();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [selectedIndexCoord, setSelectedIndexCoord] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [emptyMap, setEmptyMap] = useState(false);
    // const {
    //     isOpen: openCheckExistMap,
    //     onClose: onCloseCheckExistMap,
    //     onOpen: onOpenCheckExistMap,
    // } = useDisclose();
    const {
        isOpen: openCreatePlot,
        onClose: onCloseCreatePlot,
        // onOpen: onOpenCreatePlot,
    } = useDisclose(true);
    const {
        isOpen: openEmptyMap,
        onClose: onCloseEmptyMap,
        onOpen: onOpenEmptyMap,
    } = useDisclose();
    const { isOpen: isOnline, onClose: onCloseOnline, onOpen: onOpenOnline } = useDisclose(false);
    const t = useTranslate();
    const netInfo = useNetInfo();

    const _validatePolygon = (coordinates, plots) => {
        try {
            validatePolygon(coordinates, plots);
            return false;
        } catch (err) {
            if (err === OVERLAP_ERROR) {
                return true;
            }
            return false;
        }
    };

    const checkDispute = (coordinates, plotsPolygons) => {
        let Polygons = plotsPolygons.map((item) => {
            const { coordinates } = item;
            const polygon = buildPolygon({
                coordinates,
                centroid: [],
            });
            return polygon;
        });

        return _validatePolygon([coordinates], Polygons);
    };

    const queryFromStorage = async () => {
        const _data = await getStorage('offline-plot');
        if (_data) {
            let jsonData = JSON.parse(_data);
            let done = jsonData.map((item) => {
                const _plots = jsonData.filter((p) => p.uuid !== item.uuid);
                const isDispute = checkDispute(item?.coordinates, _plots);
                return { ...item, isDispute };
            });
            setSelectedIndexCoord(0);
            setData(done.reverse());
        }
    };

    const onChangePlotSwipe = (index) => {
        setSelectedIndexCoord(index);
    };

    useEffect(() => {
        queryFromStorage();
    }, [isFocused]);

    const firstLoading = async () => {
        setLoading(true);
        await queryFromStorage();
        setLoading(false);
    };
    const checkInternetConnection = async () => {
        if (netInfo.isConnected == false && netInfo.isInternetReachable == false) {
            onCloseOnline();
            // navigation.navigate('OfflineCreatePlot');
        } else if (netInfo.isConnected && netInfo.isInternetReachable) {
            onOpenOnline();
        }
    };

    useEffect(() => {
        checkInternetConnection();
        // console.log('checking internet');
    }, [netInfo?.isInternetReachable, netInfo?.isConnected]);

    // console.log('netInfochekc ', netInfo?.isInternetReachable, netInfo?.isConnected);

    useEffect(() => {
        firstLoading();
        queryOfflineMap();
    }, []);

    const queryOfflineMap = async () => {
        await getStorage('offlineMap');
        const offlinePackets = await Mapbox.offlineManager.getPacks();
        if (offlinePackets.length < 1) {
            setEmptyMap(true);
        }
    };

    const onPressCreatePlot = () => {
        if (emptyMap) {
            onOpenEmptyMap();
        } else {
            navigation.navigate('OfflineCreatePlot');
        }
    };

    return (
        <Box {...styles.container}>
            <Header
                title={'My Plot'}
                icon={<></>}
                style={{
                    marginLeft: '-20px',
                }}
                hideAgent
            >
                <TouchableOpacity
                    onPress={() => {
                        onPressCreatePlot();
                    }}
                    style={{
                        marginRight: 10,
                    }}
                >
                    <AddSquare color={theme.colors.primary[600]} />
                </TouchableOpacity>
            </Header>
            <Box
                bgColor={'yellow.900'}
                px={'20px'}
                py={'10px'}
                flexDir={'row'}
                alignItems={'center'}
            >
                <CloudOffline width="24" height="24" color={theme.colors.yellow[1000]} />
                <Text flex={1} ml={2} fontWeight={500} color={'yellow.1500'}>
                    {t('offlineMaps.plotWillUpload')}
                </Text>
            </Box>
            {loading && <Spinner size={'lg'} mt={'40px'} />}
            {data.length > 0 && !loading && (
                <>
                    <ReactNativeMapbox
                        offlineData={data}
                        selectedCoordinates={data?.[selectedIndexCoord]?.coordinates}
                        selectedIndexCoord={selectedIndexCoord}
                    />
                    <SwiperOfflinePlot onChangeCoords={onChangePlotSwipe} data={data} />
                </>
            )}
            {data.length == 0 && !loading && (
                <Box justifyContent={'center'} alignItems={'center'} h={'300'}>
                    <CloudOffline color={'#606060'} width="24" height="24" />
                    <Text color={'#8E8E8E'} fontWeight={500} fontSize={12} mt={2} mb={5}>
                        {t('offlineMaps.noOfflinePlots')}
                    </Text>
                    <ButtonChip
                        h="40px"
                        w="150px"
                        _text={{ color: '#FFF' }}
                        onPress={() => {
                            onPressCreatePlot();
                        }}
                    >
                        {t('others.createPlot')}
                    </ButtonChip>
                </Box>
            )}
            <ModalCreatePlot
                isOpen={openCreatePlot}
                onClose={onCloseCreatePlot}
                onPressCreatePlot={onPressCreatePlot}
            />
            <ModalEmptyMap isOpen={openEmptyMap} onClose={onCloseEmptyMap} />
            <CheckUseOfflineMap isOpen={isOnline} onClose={onCloseOnline} status="online" />
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 'full',
        height: 'full',
        backgroundColor: 'gray.200',
    },
    // containerList: {
    //     width: 'full',
    //     height: 'full',
    //     flex: 1,
    // },
    // rowList: {},
    // row: {
    //     bgColor: 'white',
    //     p: '10px',
    //     px: '20px',
    //     mb: 2,
    // },
});
