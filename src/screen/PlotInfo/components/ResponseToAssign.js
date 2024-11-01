import React, { useState } from 'react';
import BottomWrapper from './BottomWrapper';
import { Box, Text, useDisclose } from 'native-base';
import Button from '../../../components/Button';
import useTranslate from '../../../i18n/useTranslate';
import { respondAssignOfflinePlot } from '../../../rest_client/apiClient';
import { useNavigation } from '@react-navigation/native';
import { OVERLAP_ERROR, delay } from '../../../util/Constants';
import { validatePolygon } from '../../../util/polygon';
import ModalOverlap from '../../CreatePlot/ModalOverlap';

const ResponseToAssign = ({ plotData, requestAssignPlotId, refAnnounce }) => {
    const t = useTranslate();
    const [loading, setLoading] = useState({
        approve: false,
        decline: false,
    });
    const { isOpen: isOpenOverlap, onOpen: onOpenOverlap, onClose: onCloseOverlap } = useDisclose();
    const [error, setError] = useState('');
    const navigation = useNavigation();
    const closePlots = plotData?.closePlots || [];
    if (plotData?.waitingAssign !== 'pending') return null;
    const _user = plotData?.claimants.find((claimant) => claimant?.self);
    if (_user?.status !== 'pending') return null;

    const checkDispute = async () => {
        let isDispute = false;
        try {
            let plotCoordinate = plotData?.plot?.geojson?.geometry?.coordinates;
            let namePlot = plotData?.plot?.name;
            let _closePlots = closePlots?.filter((plot) => plot?.name !== namePlot);
            validatePolygon(plotCoordinate, _closePlots);
        } catch (error) {
            if (error === OVERLAP_ERROR) {
                isDispute = true;
            }
            console.log('error Assign:', error);
        }

        return isDispute;
    };

    const _respond = async (approve) => {
        try {
            const status = approve ? 'approved' : 'rejected';
            const res = await respondAssignOfflinePlot({
                id: requestAssignPlotId,
                status: status,
            });
            if (approve) {
                refAnnounce.current.announce = {
                    visible: true,
                    status: 'success',
                };
                await delay(1000);
                navigation.setParams({
                    plotID: res?.data?.data?.plotId,
                    requestAssignPlotId: null,
                });
                // initData();
            } else {
                navigation.goBack();
            }
        } catch (error) {
            setError(error);
        }
    };

    const preApprove = async () => {
        console.log('preapprove');
        const isDispute = await checkDispute();
        if (isDispute) {
            onOpenOverlap();
        } else {
            approve();
        }
    };

    const approve = async () => {
        setLoading({ ...loading, approve: true });
        await _respond(true);
        setLoading({ ...loading, approve: false });
    };

    const reject = async () => {
        setLoading({ ...loading, decline: true });
        await _respond(false);
        setLoading({ ...loading, decline: false });
    };

    return (
        <BottomWrapper>
            <Box shadow={1}>
                {error.length > 0 && (
                    <Text textAlign={'center'} color={'error.400'} mb={'6px'}>
                        {error}
                    </Text>
                )}
                <Text textAlign={'center'} fontWeight={600} fontSize={14} px={'20px'} pb={'10px'}>
                    {t('offlineMaps.beListOnThePlot')}
                </Text>

                <Box flexDir={'row'} justifyContent={'space-between'}>
                    <Button
                        _container={{
                            w: '48%',
                        }}
                        variant={'outline'}
                        isDisabled={loading.approve || loading.decline}
                        isLoading={loading.decline}
                        onPress={reject}
                    >
                        {t('button.decline')}
                    </Button>
                    <Button
                        _container={{
                            w: '48%',
                        }}
                        bgColor={'primary.600'}
                        _pressed={{ bgColor: 'primary.700' }}
                        isDisabled={loading.approve || loading.decline}
                        isLoading={loading.approve}
                        onPress={preApprove}
                    >
                        {t('button.approve')}
                    </Button>
                </Box>
            </Box>
            <ModalOverlap isOpen={isOpenOverlap} onClose={onCloseOverlap} onPressSubmit={approve} />
        </BottomWrapper>
    );
};

export default ResponseToAssign;
