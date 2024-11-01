import useTranslate from '../../i18n/useTranslate';
import { Box, Text } from 'native-base';

import Button from '../../components/Button';
import LearnMarkerPlacerment from '../../components/LearnMarkerPlacerment';
import React from 'react';

export default function Index({
    step,
    polygon,
    setStep,
    error,
    requesting,
    submit,
    startStep1,
    resetPolygon,
}) {
    const onPress = async () => {
        switch (step) {
            case 0:
                return startStep1();
            case 1:
                return setStep(step + 1);
            case 2:
                await submit();
                return;
            default:
                return;
        }
    };

    const onBackAndReset = () => {
        if (step === 0) {
            return resetPolygon?.();
        }
        setStep(step - 1);
    };

    const t = useTranslate();
    return (
        <Box
            py="12px"
            position="absolute"
            bottom="0px"
            background="white"
            w="full"
            borderWidth="1px"
            borderColor="gray.100"
            shadow={9}
        >
            {step === 0 && <LearnMarkerPlacerment />}
            {error ? (
                <Text textAlign="center" mb="8px" color="error.400">
                    {error}
                </Text>
            ) : null}
            <Box flexDirection="row" justifyContent="center">
                <Button
                    onPress={onBackAndReset}
                    variant="outline"
                    _container={{
                        w: '150px',
                        mr: '16px',
                    }}
                    isDisabled={requesting}
                >
                    {step === 0 ? t('button.reset') : t('button.back')}
                </Button>
                <Button
                    onPress={onPress}
                    _container={{
                        w: '150px',
                    }}
                    isDisabled={!polygon || requesting || error}
                    isLoading={requesting}
                >
                    {step === 2 ? t('button.submit') : t('button.next')}
                </Button>
            </Box>
        </Box>
    );
}
