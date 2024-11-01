import { Box, Text, useTheme } from 'native-base';
import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import * as Turf from '@turf/turf';
import { CreatePlot, OffLocationIcon } from '../../components/Icons';
import Swiper from '../../components/SwiperPlot/Swiper';
import moment from 'moment';

const SwiperOfflinePlot = ({ data, onChangeCoords }) => {
    const { width } = Dimensions.get('window');

    const padding = 45;
    let _width = useMemo(() => width - padding * 2);
    const t = useTranslate();

    const onChange = (index) => {
        onChangeCoords(index);
    };
    const theme = useTheme();
    const row = ({ item: { name, date, coordinates } }) => {
        const _date = new Date(date);
        const _tmp = [...coordinates, coordinates[0]];
        const polygon = Turf.polygon([_tmp]);
        const area = Turf.area(polygon);
        const roundedArea = Math.round(area * 100) / 100;

        return (
            <Box alignItems={'center'} h={'full'} w={_width} key={date} mr={'10px'}>
                <Box
                    w={'full'}
                    h={'full'}
                    bgColor={'white'}
                    borderRadius={'12px'}
                    overflow={'hidden'}
                    p={'16px'}
                >
                    <Text fontWeight={600} fontSize={14} mb={2}>
                        {name}
                    </Text>
                    <Text color={'gray.700'}>
                        {t('components.createdAt')} {moment(_date).format('MMM DD, YYYY')}
                    </Text>
                    <Box flexDir={'row'} alignItems={'center'} my={1}>
                        <Box mr={2}>
                            <OffLocationIcon color={theme.colors.primary[600]} />
                        </Box>
                        <Text>{t('explore.location')}: </Text>
                        <Text fontWeight={700}>{t('components.offline')}</Text>
                    </Box>
                    <Box flexDir={'row'} alignItems={'center'}>
                        <Box mr={2}>
                            <CreatePlot width="16" height="16" color={theme.colors.primary[600]} />
                        </Box>
                        <Text>{t('components.size')}: </Text>
                        <Text fontWeight={700}>{roundedArea}m2</Text>
                    </Box>
                </Box>
            </Box>
        );
    };

    return (
        <Box bgColor={'transparent'} position={'absolute'} bottom={'20px'} w={'full'}>
            <Swiper
                data={data}
                width={_width}
                size={data.length}
                isLoading={false}
                onChangeIndex={onChange}
                renderItem={row}
            />
        </Box>
    );
};

export default SwiperOfflinePlot;

// const styles = StyleSheet.create({
//     row: {
//         bgColor: 'white',
//         p: '10px',
//         px: '20px',
//     },
// });
