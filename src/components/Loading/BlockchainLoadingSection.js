/* eslint-disable react-native/no-inline-styles */
import { Button, Center, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import { useNavigation } from '@react-navigation/native';
import BlockchainLoading from './BlockchainLoading';

const BlockchainLoadingSection = ({ isSendNoti = false }) => {
    const t = useTranslate();
    const navigation = useNavigation();
    return (
        <>
            <Center position={'relative'} top={10}>
                <BlockchainLoading bg="#EEEEEE" zoomLevel={1} width={250} height={170} />
            </Center>
            <Text mt="10px" textAlign={'center'} fontWeight={600} fontSize={'16px'}>
                {t('certificate.loadingCertificate')}...
            </Text>
            <Text mt="5px" textAlign={'center'} fontWeight={400} fontSize={'14px'}>
                {isSendNoti
                    ? t('certificate.postingBlockchainWithNoti')
                    : t('certificate.postingBlockchain')}
            </Text>
            <Button
                mt="20px"
                onPress={() => {
                    navigation.goBack();
                }}
            >
                {t('button.okay')}
            </Button>
        </>
    );
};

export default BlockchainLoadingSection;
