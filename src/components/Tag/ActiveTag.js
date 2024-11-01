import { HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import FileCheck2 from '../Icons/FileCheck2';

const ActiveTag = ({ _container = {} }) => {
    const t = useTranslate();
    return (
        <HStack
            bg="appColors.bgBlue"
            p="5px"
            px="10px"
            borderRadius={'17px'}
            space={2}
            {..._container}
        >
            <FileCheck2 />
            <Text color="appColors.primaryBlue">{t('components.active')}</Text>
        </HStack>
    );
};

export default ActiveTag;
