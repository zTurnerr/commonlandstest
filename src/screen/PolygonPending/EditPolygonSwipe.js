import { Box, Text } from 'native-base';
import React, { useMemo } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import Swiper from '../../components/SwiperPlot/Swiper';

const ItemsDispute = ({ item, onPress, _width, size }) => {
    const t = useTranslate();

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
                        <Text fontSize={11} flex={1} numberOfLines={1}>
                            {item?.placeName || item?.inviteePlotID?.placeName}
                        </Text>
                    </Box>
                    <Box
                        flexDir={'row'}
                        borderRadius={'34px'}
                        bgColor={'appColors.primaryYellow'}
                        px={'15px'}
                        py={'8px'}
                        alignItems={'center'}
                    >
                        <Text ml={'6px'} fontWeight={600} color={'white'}>
                            {t('plotStatus.newDispute')}
                        </Text>
                    </Box>
                </Box>
            </TouchableOpacity>
        </Box>
    );
};

const EditPolygonSwipe = ({ disputes, onPress }) => {
    const { width } = Dimensions.get('window');
    const padding = 40;
    let _width = useMemo(() => width - padding * 2, [width, padding]);

    const onChange = (index) => {
        onPress(disputes[index]);
    };

    return (
        <Box position={'absolute'} zIndex={2} bottom={'30px'} left={'0px'} safeArea>
            {disputes?.length > 0 && (
                <Swiper
                    data={disputes}
                    renderItem={ItemsDispute}
                    width={_width}
                    size={disputes?.length}
                    itemProps={{
                        onPress,
                        _width,
                        size: disputes?.length,
                    }}
                    onChangeIndex={onChange}
                />
            )}
        </Box>
    );
};

export default EditPolygonSwipe;
