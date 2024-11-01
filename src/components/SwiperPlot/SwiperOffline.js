import { Box, Text, useTheme } from 'native-base';
import React, { useCallback, useMemo } from 'react';
import moment from 'moment';
import { Dimensions } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import Swiper from './Swiper';

import { CreatePlot, OffLocationIcon } from '../Icons';

const Index = ({ data, onChangePlot, isLoading }) => {
    const { width } = Dimensions.get('window');
    const padding = 40;
    let _width = useMemo(() => width - padding * 2);
    const onChange = useCallback(
        (index) => {
            let item = data?.[index];
            onChangePlot &&
                onChangePlot({
                    item,
                    index,
                });
        },
        [data, onChangePlot],
    );

    const t = useTranslate();
    const { colors } = useTheme();

    const renderItem = ({ item: plot }) => {
        const _date = new Date(plot?.date);
        return (
            <Box key={plot?._id} alignItems="center" h="full" w={_width} px={'8px'}>
                <Box
                    w={'full'}
                    h="full"
                    backgroundColor="white"
                    borderRadius="12px"
                    overflow="hidden"
                    p={'10px'}
                >
                    <Text fontWeight={600} fontSize={14} mb={1}>
                        {plot?.name}
                    </Text>
                    <Text color={'gray.700'}>
                        {t('components.createdAt')} {moment(_date).format('MMM DD, YYYY')}
                    </Text>
                    <Box flexDir={'row'} my={1}>
                        <Box mr={2}>
                            <OffLocationIcon color={colors.primary[600]} />
                        </Box>
                        <Text>{t('explore.location')}: </Text>
                        <Text fontWeight={700} flex={1}>
                            {plot?.placeName}
                            {/* offline */}
                        </Text>
                    </Box>
                    <Box flexDir={'row'} alignItems={'center'}>
                        <Box mr={2}>
                            <CreatePlot width="16" height="16" color={colors.primary[600]} />
                        </Box>
                        <Text>{t('components.size')}: </Text>
                        <Text fontWeight={700}>{plot?.area}m2</Text>
                    </Box>
                </Box>
            </Box>
        );
    };
    return (
        <Box w="full" h="150px" mb="12px">
            {data?.length > 0 && (
                <>
                    <Swiper
                        data={data}
                        width={_width}
                        size={data?.length}
                        isLoading={isLoading}
                        onChangeIndex={onChange}
                        renderItem={renderItem}
                    />
                </>
            )}
        </Box>
    );
};
export default Index;
