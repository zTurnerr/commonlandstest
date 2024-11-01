import { Box, Text, useTheme } from 'native-base';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { FullScreenIcon, ShieldTick } from '../../components/Icons';
import useTranslate from '../../i18n/useTranslate';
import { NEIGHTBORS, SCREEN_HEIGHT } from '../../util/Constants';
import { t } from 'i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swiper from '../../components/SwiperPlot/Swiper';
import useGetDistanceFromHeader from '../../hooks/useGetDistanceFromHeader';

const ItemsNeighbor = ({ item, onPress, _width, size }) => {
    const { colors } = useTheme();

    const handleOnPress = () => {
        onPress(item);
    };

    return (
        <Box>
            <TouchableOpacity onPress={handleOnPress}>
                <Box
                    bgColor={'white'}
                    borderRadius={'34px'}
                    pl={'25px'}
                    pr={'10px'}
                    py={'10px'}
                    alignItems={'center'}
                    flexDir={'row'}
                    w={_width}
                    mx={size === 1 ? '0px' : '10px'}
                >
                    <Box flex={1}>
                        <Text fontWeight={600} fontSize={14}>
                            {item?.name || item?.inviteePlotID?.name}
                        </Text>
                        <Text fontSize={11} flex={1} numberOfLines={2}>
                            {item?.placeName || item?.inviteePlotID?.placeName}
                        </Text>
                    </Box>
                    {item?.relationship === 'neighbor' ? (
                        <Box
                            flexDir={'row'}
                            borderRadius={'34px'}
                            bgColor={'yellow.710'}
                            px={'15px'}
                            py={'8px'}
                            alignItems={'center'}
                        >
                            <MaterialCommunityIcons
                                color={colors?.appColors?.iconYellow}
                                name="clock-check-outline"
                                size={16}
                            />

                            <Text ml={'6px'} fontWeight={600} color={'appColors.iconYellow'}>
                                {t('invite.pendingApproval')}
                            </Text>
                        </Box>
                    ) : (
                        <Box
                            flexDir={'row'}
                            bgColor={'primary.600'}
                            borderRadius={'34px'}
                            px={'15px'}
                            py={'8px'}
                            alignItems={'center'}
                        >
                            <ShieldTick color={'white'} />
                            <Text ml={'6px'} mr={'10px'} fontWeight={600} color={'white'}>
                                {t('invite.connected')}
                            </Text>
                        </Box>
                    )}
                </Box>
            </TouchableOpacity>
        </Box>
    );
};

const FullScreenDetail = ({
    onPressOpenMapWide,
    isOpenWholeMap,
    neighbors = [],
    invitesPending = [],
    onPlotPress,
    step,
}) => {
    const { colors } = useTheme();
    const t = useTranslate();
    const { width } = Dimensions.get('window');
    const padding = 40;
    let _width = useMemo(() => width - padding * 2, [width, padding]);
    const [firstTimeOpen, setFirstTimeOpen] = useState(false);

    const neighborsPending = useMemo(() => {
        return invitesPending.filter((i) => NEIGHTBORS.includes(i.relationship));
    }, [invitesPending]);
    const { distance } = useGetDistanceFromHeader();

    const totalAllNeighbors = [...neighbors, ...neighborsPending];

    useEffect(() => {
        if (firstTimeOpen && totalAllNeighbors?.length > 0) {
            setFirstTimeOpen(false);
            onPress(totalAllNeighbors[0]);
        }
    }, [firstTimeOpen, totalAllNeighbors]);

    useEffect(() => {
        if (isOpenWholeMap) {
            setFirstTimeOpen(true);
        }
    }, [isOpenWholeMap]);

    // console.log('neighbors ', JSON.stringify(neighbors, null, 2));
    if (step !== 0) {
        return null;
    }

    if (!isOpenWholeMap) {
        return (
            <>
                <Box position="absolute" zIndex="2" right={'10px'} bottom={'10px'}>
                    <TouchableOpacity onPress={onPressOpenMapWide}>
                        <Box
                            borderRadius={'full'}
                            bgColor={'white'}
                            p={0}
                            w={'24px'}
                            px={'6px'}
                            py={'6px'}
                            mx={'auto'}
                        >
                            <FullScreenIcon color={colors.primary[600]} />
                        </Box>
                        <Text color={'white'} mt={'6px'}>
                            {t('plot.fullScreen')}
                        </Text>
                    </TouchableOpacity>
                </Box>
            </>
        );
    }

    const onPress = (item) => {
        if (item?.relationship === 'neighbor') {
            onPlotPress({ ...item, centroid: item?.inviteePlotID?.centroid?.coordinates });
        } else {
            onPlotPress(item);
        }
    };

    const onChange = (index) => {
        onPress(totalAllNeighbors[index]);
    };

    return (
        <>
            <Box
                position={'absolute'}
                zIndex={2}
                top={`${SCREEN_HEIGHT - 150 - distance}px`}
                left={'0px'}
                safeArea
            >
                {totalAllNeighbors?.length > 0 && (
                    <Swiper
                        data={totalAllNeighbors}
                        renderItem={ItemsNeighbor}
                        width={_width}
                        size={totalAllNeighbors.length}
                        itemProps={{
                            onPress,
                            _width,
                            size: totalAllNeighbors.length,
                        }}
                        onChangeIndex={onChange}
                    />
                )}
            </Box>
        </>
    );
};

export default FullScreenDetail;
