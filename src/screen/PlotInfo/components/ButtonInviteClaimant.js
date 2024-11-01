import { Box, Button } from 'native-base';
import React from 'react';
import useTranslate from '../../../i18n/useTranslate';
import { checkExistTransferOrWithdraw } from '../../../util/utils';

export default function ButtonInviteClamant({
    step,
    tab,
    plotData,
    onOpenInviteSheet,
    isOpenWholeMap,
}) {
    const t = useTranslate();

    return (step === 4 || (step === 0 && tab === 1) || (step === 1 && tab === 1)) &&
        plotData?.permissions?.inviteClaimant &&
        !isOpenWholeMap &&
        !checkExistTransferOrWithdraw(plotData) ? (
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
                onPress={onOpenInviteSheet}
                variant="outline"
                isDisabled={
                    !plotData?.permissions?.inviteClaimant || plotData?.plot?.status === 'defaulted'
                }
            >
                {t('invite.inviteClaimants')}
            </Button>
        </Box>
    ) : null;
}
