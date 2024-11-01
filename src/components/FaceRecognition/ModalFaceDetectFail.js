import { Box, Center, Text, Button, Modal } from 'native-base';

import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import Danger from '../Icons/Danger';

export default function FaceDetectFail({
    onYes = () => {},
    onNo = () => {},
    mainBtnText = 'faceDetect.continueWithOTP',
    isModal = false,
}) {
    const t = useTranslate();

    const FailContent = (
        <Box justifyContent="center" alignItems="center" borderRadius="8px">
            <Center width={'48px'} height={'48px'} bg="danger.light" borderRadius={'12px'}>
                <Danger width="32" height="32" />
            </Center>
            <Box mt="15px" w="full" alignItems="center">
                <Text color="black" fontWeight="600" fontSize="16px" textAlign={'center'} mb="15px">
                    {t('faceDetect.faceAuthenticationFailed')}
                </Text>

                <Text fontSize={'14px'} textAlign={'center'} mb="40px">
                    {t('faceDetect.failAlert')}
                </Text>
                <Button
                    onPress={() => {
                        onYes();
                    }}
                    bgColor="primary.600"
                    _pressed={{
                        opacity: 0.5,
                    }}
                >
                    {t(mainBtnText)}
                </Button>
                <Button
                    onPress={() => {
                        onNo();
                    }}
                    mt="14px"
                    variant="outline"
                >
                    {t('faceDetect.tryAgain')}
                </Button>
            </Box>
        </Box>
    );

    if (isModal) {
        return (
            <Modal isOpen size="sm">
                <Box
                    px="20px"
                    py="15px"
                    pt={'40px'}
                    backgroundColor={'white'}
                    borderRadius={16}
                    shadow={1}
                    w="90%"
                >
                    {FailContent}
                </Box>
            </Modal>
        );
    }

    return FailContent;
}
