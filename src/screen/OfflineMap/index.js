/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-unused-styles */
import { Box, ScrollView, Text, useDisclose, useTheme } from 'native-base';

import { useIsFocused, useNavigation } from '@react-navigation/core';
import Mapbox from '@rnmapbox/maps';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
// import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { MapDownloadIcon } from '../../components/Icons';
import Tabs from '../../components/Tabs';
import useGetTotalPlot from '../../hooks/Plot/useGetTotalPlot';
import useTranslate from '../../i18n/useTranslate';
import { RN_MAPBOX_ACCESS_TOKEN, getStorage, setStorage } from '../../util/Constants';
import { turfGetArea, turfGetCenter } from '../../util/polygon';
import { getPlace } from '../../util/utils';
import ListMaps from './ListMaps';
import ListOfflinePlots from './ListOfflinePlots';
import ModalDeleteOffPlot from './ModalDeleteOffPlot';

Mapbox.setAccessToken(RN_MAPBOX_ACCESS_TOKEN);

const renderLabel = (item) => {
    const _item = item?.item;
    const active = item?.active;
    return (
        <Box flexDir={'row'} alignItems={'center'}>
            <Text
                color={active ? 'primary.600' : 'gray.700'}
                mr={'5px'}
                fontSize={12}
                fontWeight={600}
            >
                {_item?.label}
            </Text>
            <Box
                bgColor={active ? 'primary.600' : 'gray.500'}
                borderRadius={'4px'}
                px={'8px'}
                py={'2px'}
            >
                <Text color={'white'}>{_item?.count}</Text>
            </Box>
        </Box>
    );
};

export default function Index() {
    const [offlineData, setOfflineData] = useState(null);
    const [OfflinePlots, setOfflinePlots] = useState(null);
    const [selectedPlots, setSelectedPlots] = useState({});
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    // const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { colors } = useTheme();
    const t = useTranslate();
    const { isOpen: modalDelete, onClose: closeDelete, onOpen: openDeleteModal } = useDisclose();
    const [indexToDelete, setIndexToDelete] = useState(-1);
    const { total: numberOfPlot, limitPlot, isTraining } = useGetTotalPlot();

    const queryOfflineMap = async () => {
        const storageStr = await getStorage('offlineMap');
        const storage = JSON.parse(storageStr);
        const offlinePackets = await Mapbox.offlineManager.getPacks();
        const packs = offlinePackets
            .filter((item) => item?.pack?.percentage === 100)
            .map((item) => {
                return {
                    ...item,
                    displayName: storage[item.name]?.name || item.name,
                    date: storage[item.name]?.date || '',
                    zoomMap: storage[item.name]?.zoomMap,
                };
            });
        setOfflineData(packs);
    };

    const queryOfflinePlots = async () => {
        const _data = await getStorage('offline-plot');
        if (_data) {
            const tmpData = JSON.parse(_data);
            tmpData?.forEach(async (item) => {
                // item.coordinates = [...item?.coordinates, item?.coordinates[0]];
                if (!item?.centroid) {
                    let centroid = turfGetCenter(item?.coordinates);
                    item.centroid = centroid?.geometry.coordinates;
                    // console.log('centroid', centroid?.geometry?.coordinates);
                }
                if (!item?.area) {
                    const area = turfGetArea(item?.coordinates);
                    // console.log('area offline', area);
                    item.area = Math.round(area * 100) / 100;
                }
                if (!item?.placeName) {
                    const [long, lat] = item?.centroid;
                    const place = await getPlace({ long, lat });
                    item.placeName = place?.features[0]?.place_name || 'Offline';
                }
            });
            setOfflinePlots(tmpData);
            await setStorage('offline-plot', JSON.stringify(tmpData));
        }
    };

    const onPressDeleteOfflinePlots = async (id) => {
        let tmpData = OfflinePlots;
        tmpData = tmpData.filter((item, index) => index !== id);
        await setStorage('offline-plot', JSON.stringify(tmpData));
        setOfflinePlots(tmpData);
    };

    useEffect(() => {
        queryOfflinePlots();
    }, []);

    useEffect(() => {
        queryOfflineMap();
    }, [isFocused]);

    const getNumberPlotSelected = useCallback(() => {
        let count = 0;
        OfflinePlots?.forEach((item) => {
            if (selectedPlots[item?.uuid]) {
                count++;
            }
        });
        return count;
    }, [selectedPlots]);

    // const pressSelectAll = () => {
    //     const tmp = {};
    //     if (getNumberPlotSelected() === OfflinePlots?.length) {
    //         OfflinePlots?.forEach((item) => {
    //             tmp[item?.uuid] = false;
    //         });
    //     } else {
    //         OfflinePlots?.forEach((item) => {
    //             tmp[item?.uuid] = true;
    //         });
    //     }
    //     setSelectedPlots(tmp);
    // };

    const onPressUploadPlot = () => {
        const gatherPlotsUpload = [];
        OfflinePlots?.forEach((item) => {
            if (selectedPlots[item?.uuid]) {
                gatherPlotsUpload.push(item);
            }
        });
        navigation.navigate('UploadOfflinePlot', { plots: gatherPlotsUpload });
    };

    const onCheckPlotLimit = () => {
        const numberSelected = getNumberPlotSelected();
        const _limitPlot = limitPlot;
        if (isTraining) {
            if (_limitPlot - numberOfPlot <= 0) {
                setError(t('error.alreadyEnoughAndCannot', { old: numberOfPlot }));
            } else if (_limitPlot - numberOfPlot < numberSelected) {
                setError(
                    t('error.alreadyOwnEnoughPlot', {
                        old: numberOfPlot,
                        new: _limitPlot - numberOfPlot,
                    }),
                );
            } else setError('');
        } else {
            setError('');
        }
    };
    useEffect(() => {
        onCheckPlotLimit();
    }, [selectedPlots]);

    return (
        <Box {...styles.container}>
            <Header title={t('offlineMaps.offlineMaps')}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('MapPreview');
                    }}
                >
                    <Box flexDirection="row" alignItems="center">
                        <MapDownloadIcon color={colors?.appColors?.primary} />
                        <Text fontWeight="500" ml="4px" mr={'10px'} color={'primary.600'}>
                            {t('offlineMaps.newMap')}
                        </Text>
                    </Box>
                </TouchableOpacity>
            </Header>
            <Tabs
                items={[
                    {
                        renderLabel: renderLabel,
                        label: t('offlineMaps.downloadedMaps'),
                        value: 0,
                        count: offlineData?.length || 0,
                    },
                    {
                        renderLabel: renderLabel,
                        label: t('offlineMaps.OfflinePlots'),
                        value: 1,
                        count: OfflinePlots?.length || 0,
                    },
                ]}
                activeIndex={activeTab}
                onTabChange={setActiveTab}
                bg="white"
                mt="0px"
            />
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                {/* <Box style={styles.containerList}>haha</Box> */}
                <Box {...styles.containerList}>
                    {activeTab === 0 && <ListMaps offlineData={offlineData} />}
                    {activeTab === 1 && (
                        <ListOfflinePlots
                            data={OfflinePlots}
                            selectedPlots={selectedPlots}
                            setSelectedPlots={setSelectedPlots}
                            setIndexToDelete={setIndexToDelete}
                            openDeleteModal={openDeleteModal}
                        />
                    )}
                </Box>
            </ScrollView>
            {activeTab === 1 && getNumberPlotSelected() > 0 && (
                <Box
                    justifyContent={'center'}
                    px={'20px'}
                    py={'10px'}
                    bgColor={'white'}
                    shadow={1}
                    alignItems={'center'}
                    minH={'70px'}
                >
                    {error.length > 0 && (
                        <Text color={'red.500'} mb={'10px'}>
                            {error}
                        </Text>
                    )}
                    {getNumberPlotSelected() > 0 && (
                        <Button
                            bgColor="primary.600"
                            onPress={onPressUploadPlot}
                            _pressed={{ bgColor: 'primary.700' }}
                            isDisabled={error.length > 0}
                        >
                            {t('button.uploadNumberPlot', { number: getNumberPlotSelected() })}
                        </Button>
                    )}
                </Box>
            )}
            <ModalDeleteOffPlot
                isOpen={modalDelete}
                onClose={closeDelete}
                onPressDelete={() => onPressDeleteOfflinePlots(indexToDelete)}
            />
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 'full',
        height: 'full',
    },
    containerList: {
        width: 'full',
        paddingTop: '0px',
        flex: 1,
    },
    groupTitle: {
        bg: 'gray.200',
        p: '12px',
    },
    divider: {
        borderBottomColor: 'gray.300',
        borderBottomWidth: '1px',
        marginTop: '12px',
        marginBottom: '12px',
    },
    buttonSignOut: {
        marginTop: '12px',
        marginBottom: '20px',
    },
    containerItem: {
        px: '12px',
        bg: 'white',
        minH: '44px',
        justifyContent: 'center',
    },
});
