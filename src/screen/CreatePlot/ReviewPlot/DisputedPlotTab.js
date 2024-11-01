import { Box } from 'native-base';
import useTranslate from '../../../i18n/useTranslate';

import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import EmptyText from '../../../components/EmptyText';
import { getPlotStatus } from '../../../components/PlotStatus';
import PlotRow from './PlotRow';

export default function Index({ disputedPlot = [], onPlotPress }) {
    const t = useTranslate();
    const numberOfDisputed = useMemo(() => disputedPlot?.length || 0, [disputedPlot]);
    return (
        <Box>
            {disputedPlot &&
                disputedPlot
                    .map((item) => ({
                        ...item,
                        status: getPlotStatus({
                            plot: item,
                        }),
                    }))
                    .sort((a, b) => {
                        return a.status - b.status;
                    })
                    .map((item, index) => {
                        return onPlotPress ? (
                            <TouchableOpacity key={index} onPress={() => onPlotPress(item)}>
                                <PlotRow data={item} />
                            </TouchableOpacity>
                        ) : (
                            <PlotRow key={index} data={item} />
                        );
                    })}

            {!numberOfDisputed && <EmptyText text={t('plot.noDisputedPlots')} />}
        </Box>
    );
}
