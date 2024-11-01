import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { PresenceTransition } from 'native-base';
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { CheckExistTrainer } from '../../components/Header/utils/trainer';
import { getPlotStatus } from '../../components/PlotStatus';
import SwiperPlot from '../../components/SwiperPlot';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';

function Index({ onSelectPlot }, ref) {
    const [dataPlot, setDataPlot] = useState([]);
    const { plots, plotFlagged, trainer, userInfo } = useShallowEqualSelector(
        (state) => state.user,
    );

    useEffect(() => {
        getDataPlot();
    }, [plots, plotFlagged]);

    const getDataPlot = () => {
        let data = [...plots, ...plotFlagged];
        const newData = data?.map((i) => ({ ...i, status: getStatus(i) }));
        setDataPlot(newData);
    };

    const getStatus = (plot) => {
        const data = plot?.isFlagged ? plot?.plot : plot;
        return getPlotStatus({
            plot: data,
        });
    };

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

    const [isOpen, setIsOpen] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setIsOpen(true);

            return () => setIsOpen(false);
        }, []),
    );

    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            bottom: CheckExistTrainer(trainer, { userInfo: userInfo }) ? 12 : 12,
        },
    });

    const claimchain = useMemo(
        () => ({ plots: dataPlot, size: dataPlot?.length || 0 }),
        [dataPlot],
    );

    return (
        <PresenceTransition
            visible={isOpen}
            initial={{
                translateY: 300,
                transition: {
                    type: 'spring',
                    useNativeDriver: true,
                },
            }}
            animate={{
                translateY: 0,
                transition: {
                    type: 'spring',
                    useNativeDriver: true,
                },
            }}
            style={styles.container}
        >
            <SwiperPlot
                ref={ref}
                claimchain={claimchain}
                onChangePlot={onSelectPlot}
                onPressPlot={onPressPlot}
                isMyPlotScreen
                showStatusScale
            />
        </PresenceTransition>
    );
}

export default forwardRef(Index);
