import { Box, Spinner, Text, useTheme } from 'native-base';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import useTranslate from '../../i18n/useTranslate';

export const useLoadingContractModal = () => {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const startLoading = () => {
        setLoading(true);
        setStep(1);
        setTimeout(
            () => {
                setStep(2);
            },
            Math.random() * 1000 + 2000,
        );
    };

    const stopLoading = () => {
        setLoading(false);
    };

    const Component = () => {
        return <LoadingContractModel loading={loading} step={step} />;
    };
    return {
        Component,
        startLoading,
        stopLoading,
    };
};

const LoadingContractModel = ({ loading, step }) => {
    const theme = useTheme();
    const t = useTranslate();
    const TextStep = ['', `${t('contract.createContract1')}...`, t('contract.uploadingPhotos')];

    return (
        <Modal isVisible={loading} animationIn={'zoomIn'} animationOut={'zoomOut'}>
            <Box justifyContent={'center'} alignItems={'center'}>
                <Box
                    p={10}
                    alignItems={'center'}
                    bgColor={theme.colors.backdrop[4]}
                    borderRadius={16}
                >
                    <Spinner size={'lg'} color={'primary.600'}></Spinner>
                    <Text fontSize={14} fontWeight={400} color={'white'} mt={3}>
                        {`${t('others.step')}`} {step}/2
                    </Text>
                    <Text fontSize={14} fontWeight={700} color={'white'}>
                        {TextStep[step]}
                    </Text>
                </Box>
            </Box>
        </Modal>
    );
};

export default LoadingContractModel;
