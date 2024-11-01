import { HStack, Text } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import Download3 from '../Icons/Download3';

const DownloadContractCertBtn = ({ onPress = () => {} }) => {
    const t = useTranslate();
    return (
        <TouchableOpacity onPress={onPress}>
            <HStack space={1} alignItems={'center'}>
                <Download3 />
                <Text fontSize="13px" color="primary.600" fontWeight="bold">
                    {t('button.download')}
                </Text>
            </HStack>
        </TouchableOpacity>
    );
};

export default DownloadContractCertBtn;
