import { Center, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import Empty from '../Icons/Empty';

const EmptySearchResult = () => {
    const t = useTranslate();
    return (
        <Center pt="40px">
            <Empty />
            <Text fontWeight={600} mt="15px">
                {t('contract.noContract')}
            </Text>
            <Text>{t('contract.noData')}</Text>
        </Center>
    );
};

export default EmptySearchResult;
