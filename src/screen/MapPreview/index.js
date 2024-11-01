/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/split-platform-components */
import { Box, SearchIcon, Text, useDisclose, useTheme } from 'native-base';

import { useNavigation } from '@react-navigation/core';
import { CommonActions } from '@react-navigation/native';
import Mapbox from '@rnmapbox/maps';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, PermissionsAndroid, StyleSheet, TouchableOpacity } from 'react-native';
// import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { EditPen } from '../../components/Icons';
import useTranslate from '../../i18n/useTranslate';
import { RN_MAPBOX_ACCESS_TOKEN, getStorage, setStorage } from '../../util/Constants';
import { getCenterPointPolygon } from '../../util/polygon';
import MapPreview from './MapPreview';
import ModalChoice from './ModalChoice';
import moment from 'moment';
import ModalReturnScreen from './ModalReturnScreen';

Mapbox.setAccessToken(RN_MAPBOX_ACCESS_TOKEN);

export default function Index({ route }) {
    // const [offlineData, setOfflineData] = useState(null);
    const [Downloading, setDownloading] = useState(false);
    const [zoomMap, setZoomMap] = useState(13.8);
    const [error, setError] = useState('');
    const [areaDownload, setAreaDownload] = useState([]);
    const [open, setOpen] = useState(false);
    const [rename, setRename] = useState(false);
    const navigate = useNavigation();
    const t = useTranslate();
    const { colors } = useTheme();

    const { params } = route || {};

    const requestToGetCurrentLocation = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the location');
            } else {
                console.log('location permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    useEffect(() => {
        requestToGetCurrentLocation();
        // queryOfflineMap();
    }, []);

    const newMap = () => {
        if (params?.name && params?.name?.length > 0) return false;
        return true;
    };

    return (
        <Box {...styles.container}>
            <Header title={newMap() ? t('offlineMaps.downloadNewOffline') : params?.displayName}>
                {!newMap() && (
                    <TouchableOpacity
                        onPress={() => {
                            setOpen(true);
                            setRename(true);
                        }}
                    >
                        <Box flexDirection="row" alignItems="center">
                            {/* <Icon size={6} as={ }/> */}
                            <EditPen color={colors?.appColors?.primary} />
                            <Text fontWeight="500" ml="4px" color={'primary.600'}>
                                {t('offlineMaps.rename')}
                            </Text>
                        </Box>
                    </TouchableOpacity>
                )}
            </Header>
            {newMap() && !Downloading && (
                <Box px={'20px'}>
                    <TouchableOpacity
                        onPress={() =>
                            navigate.navigate('SearchAndDownload', {
                                place: params?.location?.placeName,
                            })
                        }
                    >
                        <Box
                            borderRadius={'18px'}
                            placeholder="Search"
                            bgColor={'gray.1600'}
                            px={'12px'}
                            my={'10px'}
                            py={'10px'}
                            flexDir={'row'}
                            alignItems={'center'}
                        >
                            <SearchIcon />
                            <Text ml={'10px'} flex={1} numberOfLines={1}>
                                {params?.location?.placeName
                                    ? params?.location?.placeName
                                    : t('components.findLocation')}
                            </Text>
                        </Box>
                    </TouchableOpacity>
                </Box>
            )}
            <MapPreview
                areaDownload={areaDownload}
                setAreaDownload={setAreaDownload}
                params={params}
                Downloading={Downloading}
                zoomMap={zoomMap}
                setZoomMap={setZoomMap}
            />

            {newMap() ? (
                <DownloadNewMap
                    coordinates={areaDownload}
                    Downloading={Downloading}
                    setDownloading={setDownloading}
                    zoomMap={zoomMap}
                    error={error}
                    setError={setError}
                />
            ) : (
                <UpdateMap
                    setOpen={setOpen}
                    setRename={setRename}
                    coordinates={areaDownload}
                    namePack={params?.name}
                />
            )}
            <ModalChoice
                open={open}
                setOpen={setOpen}
                approve={async (newName) => {
                    if (rename) {
                        if (newName.length > 0) {
                            const storageStr = await getStorage('offlineMap');
                            const storage = JSON.parse(storageStr) || {};
                            storage[params?.name].name = newName;
                            setStorage('offlineMap', JSON.stringify(storage));
                            navigate.dispatch(CommonActions.setParams({ displayName: newName }));
                        }
                    } else {
                        await Mapbox.offlineManager.deletePack(params?.name);
                        const storageStr = await getStorage('offlineMap');
                        let storage = JSON.parse(storageStr) || {};
                        Object.keys(storage).forEach((key) => {
                            if (key === params?.name) {
                                delete storage[key];
                            }
                        });
                        setStorage('offlineMap', JSON.stringify(storage));
                        navigate.navigate('OfflineMap');
                    }
                }}
                displayName={params?.displayName}
                rename={rename}
            />
        </Box>
    );
}

const DownloadNewMap = ({
    coordinates,
    namePack = 'pack' + Math.random() * 100,
    Downloading,
    setDownloading,
    zoomMap,
    setError,
    error,
}) => {
    const [percentage, setPercentage] = useState(0);
    const theme = useTheme();
    const navigate = useNavigation();
    const t = useTranslate();
    const {
        isOpen: isOpenErrorDownload,
        onClose: onCloseErrorDownload,
        onOpen: onOpenErrorDownload,
    } = useDisclose();

    const onDownloadingMap = async (offlinePack, status) => {
        console.log('offlinePack', offlinePack);
        console.log('status ', status);
        if (status?.state === 'active') {
            if (status?.percentage) {
                // rounded to 2 digits after decimal
                let _percentage = Math.round(status.percentage * 100) / 100;
                setPercentage(_percentage);
            }
            setDownloading(true);
        } else if (status?.state === 'complete') {
            setDownloading(false);
            const storageStr = await getStorage('offlineMap');
            const storage = JSON.parse(storageStr) || {};
            storage[namePack] = {
                name: namePack,
                date: new Date(),
                zoomMap: zoomMap,
            };
            await setStorage('offlineMap', JSON.stringify(storage));
            navigate.navigate('MapPreview', {
                coordinates: coordinates,
                name: namePack,
                center: getCenterPointPolygon(coordinates),
                displayName: namePack,
                zoomMap: zoomMap,
            });
        } else {
            if (status?.percentage) {
                // rounded to 2 digits after decimal
                let _percentage = Math.round(status.percentage * 100) / 100;
                setPercentage(_percentage);
            }
            setDownloading(true);
        }
    };

    const onErrorDownloading = (offlineRegion, err) => {
        console.log('err ', err);
        if (err?.message.includes('beyond the maximum allowed')) {
            onOpenErrorDownload();
        } else {
            setError(err?.message);
        }
        setDownloading(false);
    };

    const onPress = async () => {
        const center = coordinates.reduce(
            (acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]],
            [0, 0],
        );
        center[0] /= coordinates.length;
        center[1] /= coordinates.length;

        setError('');
        setDownloading(true);
        setPercentage(0);

        await Mapbox.offlineManager.createPack(
            {
                name: namePack,
                styleURL: 'mapbox://styles/mapbox/streets-v11',
                bounds: [coordinates[0], coordinates[2]],
                minZoom: Math.round(zoomMap) - 1,
                maxZoom: 22,
                center: center,
            },
            onDownloadingMap,
            onErrorDownloading,
        );
    };

    return (
        <Box px={'20px'} mt={5} mb={5}>
            {error?.length > 0 ? (
                <Text textAlign={'center'} color={'red.400'}>
                    {error}
                </Text>
            ) : (
                <>
                    <Text fontWeight={600} fontSize={14} textAlign={'center'}>
                        {t('offlineMaps.downloadThisArea')}
                    </Text>
                    <Text textAlign={'center'}>{t('offlineMaps.downloadUseSize')}</Text>
                </>
            )}
            <TouchableOpacity onPress={onPress} disabled={Downloading}>
                <Box
                    justifyContent={'center'}
                    alignItems={'center'}
                    bgColor={
                        Downloading ? theme.colors.loading[300] : theme.colors.buttonPrimary.bgColor
                    }
                    py={3}
                    mt={5}
                    color={'white'}
                    _text={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: 14,
                    }}
                    flexDirection={'row'}
                    borderRadius={8}
                >
                    {Downloading && <ActivityIndicator style={{ marginRight: 10 }} />}
                    {Downloading
                        ? t('offlineMaps.downloadingMapWithPercentage', { percentage })
                        : t('button.download')}
                </Box>
            </TouchableOpacity>
            <ModalReturnScreen isOpen={isOpenErrorDownload} onClose={onCloseErrorDownload} />
        </Box>
    );
};

const UpdateMap = ({ setOpen, setRename, namePack }) => {
    const [info, setInfo] = useState({
        size: 0,
        date: new Date(),
    });
    const t = useTranslate();
    const onPressDelete = async () => {
        setOpen(true);
        setRename(false);
    };

    const queryPack = async () => {
        await Mapbox.offlineManager._initialize(true);
        const pack = await Mapbox.offlineManager.getPack(namePack);
        const storageStr = await getStorage('offlineMap');
        const storage = JSON.parse(storageStr) || {};
        setInfo({
            date: new Date(storage[namePack]?.date),
            size: pack?.pack?.completedResourceSize,
        });
    };

    useEffect(() => {
        queryPack();
    }, []);

    return (
        <Box my={5} w={'full'}>
            <Box flexDirection="row" justifyContent="center" w={'full'} px={'10px'} mb={'10px'}>
                <Text fontSize={14} w={'180px'} mr={'8px'}>
                    {t('offlineMaps.downloadSizeAndTime', {
                        size: (info.size / 1024 / 1024).toFixed(2),
                        time: moment(info.date).format('MMM DD, YYYY'),
                    })}
                </Text>
                <Button
                    // onPress={onBackAndReset}
                    variant="outline"
                    onPress={onPressDelete}
                    w="150px"
                    borderColor="appColors.primaryRed"
                    color="custom"
                    _pressed={{
                        bgColor: 'appColors.outlinePrimaryRedPressed',
                    }}
                >
                    <Text color={'appColors.primaryRed'} fontWeight={700} fontSize={14}>
                        {t('button.delete')}
                    </Text>
                </Button>
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 'full',
        height: 'full',
        backgroundColor: 'white',
    },
});
