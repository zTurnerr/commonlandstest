import { Box, Center, HStack, Image, Spinner, Text } from 'native-base';
import useTranslate from '../../i18n/useTranslate';
import warningPng from '../../images/warning.png';

import React from 'react';
import { TouchableOpacity } from 'react-native';
import useWaiting from '../../hooks/useWaiting';
import useUserInfo from '../../hooks/useUserInfo';
import BlockchainLoading from '../Loading/BlockchainLoading';

const OldCertificateAlert = ({ getLastest, haveNewLastest, userId }) => {
    const user = useUserInfo();
    const t = useTranslate();
    const waitingHook = useWaiting(30000);
    function getAlertText() {
        if (haveNewLastest) {
            return t('components.certificateSuperseded');
        } else if (waitingHook.overLimit) {
            if (userId === user._id) {
                return t('certificate.postingBlockchainWithNoti');
            }
            return t('certificate.postingBlockchain');
        } else {
            return t('components.fetchingLatestCertificate');
        }
    }
    return (
        <HStack bgColor={'white'} mt="6px" py="12px">
            <Center width={'50px'} position={'relative'} top="3px">
                {haveNewLastest ? (
                    <Image source={warningPng} alt="warning" width={'16px'} height={'16px'} />
                ) : waitingHook.overLimit ? (
                    <BlockchainLoading zoomLevel={0.5} width={120} height={120} />
                ) : (
                    <Spinner size="sm" color="primary.900" />
                )}
            </Center>
            <Box flex={1}>
                <Text pr="5px" w="full">
                    {getAlertText()}
                </Text>
                {haveNewLastest && (
                    <TouchableOpacity onPress={getLastest}>
                        <Text
                            fontWeight={600}
                            fontSize={'12px'}
                            color={'primary.900'}
                            textDecorationLine={'underline'}
                        >
                            {t('components.currentCertificate')}
                        </Text>
                    </TouchableOpacity>
                )}
            </Box>
        </HStack>
    );
};

export default OldCertificateAlert;
