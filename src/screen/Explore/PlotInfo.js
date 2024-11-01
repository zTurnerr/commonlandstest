import { useNavigation } from '@react-navigation/core';
import { PresenceTransition, Pressable } from 'native-base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { getPlotStatus } from '../../components/PlotStatus';
import SwiperPlot from '../../components/SwiperPlot';
import { getClaimchainByPlotID } from '../../rest_client/apiClient';

export default function Index({
    isOpen,
    onClose,
    plotID,
    // showBackButton = false,
    plotSelected,
    onSelectPlot,
    claimchainSize,
    webviewRef,
}) {
    // const isLogged = useShallowEqualSelector((state) => state.user.isLogged);
    const defaultClaimchain = useMemo(
        () => ({
            plots: [],
            size: claimchainSize,
        }),
        [claimchainSize],
    );
    const [claimchain, setClaimchain] = useState(defaultClaimchain);
    const dispatch = useDispatch();
    const [requesting, setRequesting] = useState(true);
    const [, setError] = useState('');
    // const modalContext = useContext(ModalContext);
    const navigation = useNavigation();
    const getStatus = (plot) => {
        return getPlotStatus({
            plot,
        });
    };
    const getPlotData = async () => {
        setRequesting(true);
        setError('');
        try {
            let res = {};
            const start = new Date().getTime();
            res = await getClaimchainByPlotID(plotID, navigation, dispatch);
            const end = new Date().getTime();

            console.log('Time to fetch claimchain by plot: ', end - start, 'ms');

            let cl = res.data;
            cl.plots.map((p) => {
                p.location = cl.location;
                return p;
            });
            let thisPlot = cl.plots.find((p) => p._id === plotSelected._id);

            thisPlot.status = getStatus(thisPlot);
            cl.plots = [
                thisPlot,
                ...cl.plots
                    .filter((p) => p._id !== plotSelected._id)
                    .map((i) => ({ ...i, status: getStatus(i) })),
            ];

            setClaimchain(cl);
        } catch (err) {
            setError(err);
        } finally {
            setRequesting(false);
        }
    };
    useEffect(() => {
        if (plotID && isOpen) {
            setClaimchain({
                plots: [{ ...plotSelected, status: getStatus(plotSelected) }],
                size: claimchainSize || 1,
            });
            getPlotData();
        } else {
            setClaimchain({ plots: [], size: claimchainSize });
        }
    }, [plotID, isOpen]);

    const onPressPlot = useCallback(
        (plot) => {
            // if (!isLogged) {
            //     return modalContext.onOpenModal();
            // }
            // onClose();
            navigation.push('PlotInfo', {
                plotID: plot._id,
                longlat: Array.isArray(plot.centroid) ? plot.centroid : JSON.parse(plot.centroid),
            });
        },
        [navigation],
    );

    const handleClose = useCallback(() => {
        onClose();
        setClaimchain(defaultClaimchain);
    }, [defaultClaimchain, onClose]);

    return (
        <>
            {isOpen && (
                <Pressable position="absolute" w="full" h="full" top="0" onPress={handleClose} />
            )}
            <PresenceTransition
                visible={isOpen}
                initial={{
                    translateY: 300,
                    scale: 0,
                }}
                animate={{
                    translateY: 0,
                    scale: 1,
                    transition: {
                        type: 'spring',
                        useNativeDriver: true,
                    },
                }}
                style={styles.container}
            >
                <SwiperPlot
                    claimchain={claimchain}
                    onChangePlot={onSelectPlot}
                    onPressPlot={onPressPlot}
                    isLoading={requesting}
                    webviewRef={webviewRef}
                    showStatusScale
                />
            </PresenceTransition>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
    },
});
