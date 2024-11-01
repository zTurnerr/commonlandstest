import { Box, Button } from 'native-base';
import React from 'react';
import useTranslate from '../../../i18n/useTranslate';

export default function Index({ isLoading, step, tab, plotData, onClick, isOpenWholeMap }) {
    const t = useTranslate();

    if (
        !isOpenWholeMap &&
        !isLoading &&
        step === 0 &&
        tab === 2 &&
        plotData?.permissions?.inviteNeighbor
    ) {
        return (
            <Box
                w="full"
                px="20px"
                bottom="0px"
                py="20px"
                position="absolute"
                bgColor={'white'}
                zIndex={2}
            >
                <Button
                    onPress={onClick}
                    variant="outline"
                    isDisabled={!plotData?.permissions?.inviteClaimant}
                >
                    {t('invite.inviteNeightbors')}
                </Button>
            </Box>
        );
    }

    return null;
}
