import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import { Button, HStack, Text } from 'native-base';
import CheckCircle from '../Icons/CheckCircle';
import { useModalConfirmAttestPlot } from '../Modal/ModalConfirmAttestPlot';
import { usePlotDetailPage } from '../../redux/reducer/page/plotDetailPageSlice';

const ButtonAttestPlot = () => {
    const t = useTranslate();
    // const theme = useTheme();
    const modalConfirmAttestPlotHook = useModalConfirmAttestPlot();
    const { plotData } = usePlotDetailPage();
    return (
        <>
            {modalConfirmAttestPlotHook.Component({
                plotData,
            })}
            <Button
                variant="outline"
                onPress={() => {
                    modalConfirmAttestPlotHook.open();
                }}
                borderRadius={'17px'}
                maxW="83px"
                maxH="32px"
                borderColor={'#26738533'}
            >
                <HStack space={1} alignItems="center">
                    <CheckCircle width={16} height={16} color={'#267385'} />
                    <Text fontSize={'10px'} fontWeight={700} color={'#267385'}>
                        {t('plot.attestPlot')}
                    </Text>
                </HStack>
            </Button>
        </>
    );
};

export default ButtonAttestPlot;
