import { HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import ShieldSlash from '../Icons/ShieldSlash';

const DefaultTag = ({ _container = {}, marked }) => {
    const t = useTranslate();
    return (
        <HStack bg="danger.900" p="5px" px="10px" borderRadius={'17px'} space={2} {..._container}>
            <ShieldSlash color="#AD1457" width="16" height="16" />
            <Text color="danger.400" fontWeight={700}>
                {marked ? t('contract.defaultInProgress') : t('plotStatus.default')}
            </Text>
        </HStack>
    );
};

export default DefaultTag;
