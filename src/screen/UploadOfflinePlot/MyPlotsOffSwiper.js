import React from 'react';

import { Box } from 'native-base';
import SwiperOfflinePlot from '../../components/SwiperPlot/SwiperOffline';
import { useNavigation } from '@react-navigation/core';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { CheckExistTrainer } from '../../components/Header/utils/trainer';

export default function Index({ onSelectPlot, dataOffline }) {
    const { trainer, userInfo } = useShallowEqualSelector((state) => state.user);

    const navigation = useNavigation();

    const onPressPlot = (plot) => {
        try {
            const centroid = plot?.isFlagged ? plot?.plot?.centroid : plot?.centroid;
            const longlat = Array.isArray(centroid) ? centroid : JSON.parse(centroid);
            navigation.push('PlotInfo', {
                plotID: plot._id || plot?.plot?._id,
                longlat,
            });
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <Box
            borderRadius="0px"
            bottom={CheckExistTrainer(trainer, { userInfo: userInfo }) ? '160px' : '170px'}
            bgColor="transparent"
            maxWidth="100%"
            w="full"
        >
            <SwiperOfflinePlot
                data={dataOffline}
                onChangePlot={onSelectPlot}
                onPressPlot={onPressPlot}
                isMyPlotScreen
                showStatusScale
            />
        </Box>
    );
}
