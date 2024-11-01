import { HStack, Text } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import Loading from '../Icons/Loading';

const ReqUnlockPendingTag = ({ _container = {} }) => {
    const t = useTranslate();
    return (
        <HStack>
            <HStack
                py="2px"
                px="5px"
                mt="20px"
                borderRadius={'4px'}
                alignItems={'center'}
                space={1}
                bg="yellow.800"
                {..._container}
            >
                <Loading />
                <Text color="appColors.iconYellow" fontWeight={600}>
                    {t('contract.unlockRequestPendingApproval')}
                </Text>
            </HStack>
        </HStack>
    );
};

export default ReqUnlockPendingTag;
