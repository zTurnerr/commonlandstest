import { Box, HStack, Spinner, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Cardano from '../../components/Icons/Cardano';
import Copy2 from '../../components/Icons/Copy2';
import useTranslate from '../../i18n/useTranslate';
import { copyToClipboard } from '../../util/Tools';

const CardanoBox = ({ hash = '' }) => {
    const t = useTranslate();
    return (
        <Box p="20px" bg="white" mt="5px">
            <HStack alignItems={'center'} space={2}>
                <Text color="gray.700" fontWeight={400}>
                    {t('certificate.blockchain')}
                </Text>
                <Cardano />
                <Text fontWeight={600}>Cardano</Text>
            </HStack>
            <Box mt="15px" p="14px" bg="#F2F2F2" borderRadius={'12px'}>
                <HStack justifyContent={'space-between'}>
                    <Text fontWeight={700}>{t('certificate.hash')}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            copyToClipboard(hash);
                        }}
                    >
                        <HStack space={1} alignItems={'center'}>
                            <Copy2 />
                            <Text
                                position={'relative'}
                                top="-1px"
                                fontSize={'11px'}
                                fontWeight={500}
                                color={'primary.600'}
                            >
                                {t('certificate.copy')}
                            </Text>
                        </HStack>
                    </TouchableOpacity>
                </HStack>
                {hash ? (
                    <Text mt="10px" fontWeight={500} color="gray.700">
                        {hash}
                    </Text>
                ) : (
                    <Spinner />
                )}
            </Box>
        </Box>
    );
};

export default CardanoBox;
