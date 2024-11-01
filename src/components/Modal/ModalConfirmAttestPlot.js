import { Box, HStack, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import Button from '../../components/Button';
import useTranslate from '../../i18n/useTranslate';
import { attestPlot } from '../../rest_client/apiClient';
import { showErr } from '../../util/showErr';
import { showGoodAlert2 } from '../Alert/CommonGoodAlert2';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import { usePlotDetailPage } from '../../redux/reducer/page/plotDetailPageSlice';
import { openCannotAttestModal } from '../../redux/reducer/modal/cannotAttestModalSlice';

export const useModalConfirmAttestPlot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSigner, setSelectedSigner] = useState({});
    const { plotData } = usePlotDetailPage();

    const open = () => {
        if (plotData?.isEditing) {
            openCannotAttestModal(plotData);
        } else {
            setIsOpen(true);
        }
    };

    const close = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        let listener = EventRegister.addEventListener(EVENT_NAME.openAttestModal, () => {
            open();
        });

        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    const Component = ({ plotData = {} }) => {
        return <ModalConfirmAttestPlot isOpen={isOpen} onClose={close} plotData={plotData} />;
    };

    return {
        Component,
        open,
        close,
        selectedSigner,
        setSelectedSigner,
    };
};

export default function ModalConfirmAttestPlot({ isOpen, onClose, plotData }) {
    const t = useTranslate();
    const [loading, setLoading] = useState(false);
    const plotName = plotData?.plot?.name;

    const SmallCircle = (
        <Box
            position={'relative'}
            top="8px"
            width={'3px'}
            height={'3px'}
            borderRadius={'100px'}
            bg={'black'}
        ></Box>
    );

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await attestPlot({
                plotId: plotData?.plot?._id,
            });
            onClose();
            showGoodAlert2(t('plot.attestSuccess'));
            EventRegister.emit(EVENT_NAME.refetchPlotData);
        } catch (error) {
            showErr(error);
        }
        setLoading(false);
    };

    return (
        <Modal isVisible={isOpen} safeAreaTop={true}>
            <Box
                justifyContent="center"
                alignItems="center"
                p="15px"
                borderRadius="8px"
                bgColor="white"
            >
                <Text fontSize={'14px'} fontWeight={500}>
                    {t('plot.attestTitle', { plotName })}
                </Text>
                <Box my="20px" px="12px">
                    <HStack space={2} width={'full'}>
                        {SmallCircle}
                        <Text {...text1Style}>{t('plot.confirmAttest1', { plotName })}</Text>
                    </HStack>
                    <HStack space={2} width={'full'}>
                        {SmallCircle}
                        <Text {...text1Style}>{t('plot.confirmAttest2', { plotName })}</Text>
                    </HStack>
                    <HStack space={2} width={'full'}>
                        {SmallCircle}
                        <Text {...text1Style}>{t('plot.confirmAttest3', { plotName })}</Text>
                    </HStack>
                </Box>
                <Box mt="15px" w="full" alignItems="center">
                    <Button
                        onPress={() => {
                            handleSubmit();
                        }}
                        bgColor="primary.600"
                        isLoading={loading}
                    >
                        {t('button.agreeProceed')}
                    </Button>
                    <Button
                        onPress={() => {
                            onClose();
                        }}
                        mt="14px"
                        variant="outline"
                        disabled={loading}
                    >
                        {t('button.cancel')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

const text1Style = {
    lineHeight: '20px',
    textAlign: 'justify',
    flex: 1,
    maxW: 'full',
};
