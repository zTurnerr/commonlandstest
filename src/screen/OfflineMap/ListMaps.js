import { useNavigation } from '@react-navigation/native';
import { Box, Text, useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import EmptySearchResult from '../../components/EmptySearchResult/EmptySearchResult';
import { LayerIcon, ShareIcon } from '../../components/Icons';
import useTranslate from '../../i18n/useTranslate';
import { turfGetCenter } from '../../util/polygon';
import moment from 'moment';

const Row = ({
    name = 'Offline 1',
    timestamp = 'oct 25, 2021',
    size = '15',
    pack,
    displayName,
    zoomMap,
}) => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    const metadata = JSON.parse(pack?.metadata);
    const coords = metadata?._rnmapbox?.bounds?.coordinates[0];
    const date = new Date(timestamp);
    const t = useTranslate();

    const onPress = () => {
        const polygonCenter = turfGetCenter(coords);

        navigation.navigate('MapPreview', {
            coordinates: coords,
            name,
            center: polygonCenter.geometry.coordinates,
            displayName,
            zoomMap,
        });
    };

    return (
        <TouchableOpacity onPress={onPress}>
            <Box
                flexDirection={'row'}
                justifyContent={'space-between'}
                p={'14px'}
                mt={'6px'}
                alignItems={'center'}
                bgColor={'white'}
            >
                <Box flexDirection={'row'} alignItems={'center'}>
                    <Box
                        bgColor={'primary.200'}
                        borderRadius={'9999px'}
                        p={'8px'}
                        px={'7px'}
                        mr={3}
                    >
                        <LayerIcon color={colors.primary[600]} />
                    </Box>
                    <Box>
                        <Text fontWeight={600}>{displayName}</Text>
                        <Text fontSize={10}>
                            {t('offlineMaps.downloadSizeAndTime', {
                                size: size.toFixed(2),
                                time: moment(date).format('MMM DD, YYYY'),
                            })}
                            {/* {size.toFixed(2)} MB - Downloaded {date.toDateString()} */}
                        </Text>
                    </Box>
                </Box>
                <Box>
                    <ShareIcon color={colors.primary[600]} />
                </Box>
            </Box>
        </TouchableOpacity>
    );
};

const ListMaps = ({ offlineData }) => {
    const t = useTranslate();
    if (offlineData?.length > 0) {
        return (
            <>
                {offlineData?.map((item, index) => {
                    return (
                        <Row
                            name={item?._metadata?.name}
                            key={index}
                            pack={item?.pack}
                            size={item?.pack?.completedResourceSize / 1024 / 1024}
                            displayName={item?.displayName}
                            timestamp={item?.date}
                            zoomMap={item?.zoomMap}
                        />
                    );
                })}
            </>
        );
    }

    return (
        <EmptySearchResult
            title={t('searchContract.noResult')}
            description={t('contract.noData')}
        />
    );
};

export default ListMaps;
