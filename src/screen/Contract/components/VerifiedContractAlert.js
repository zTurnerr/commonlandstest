import useTranslate from '../../../i18n/useTranslate';
import { Box, HStack, Text } from 'native-base';
import React from 'react';
import Success from '../../../components/Icons/Success';

const VerifiedContractAlert = ({ type = 'borrower' }) => {
    const t = useTranslate();
    const alertText = {
        borrower: t('contract.verifiedNotiForBorrower'),
        creator: `${t('contract.verifiedNotiForCreator')} `,
    };
    return (
        <Box p="10px" bg="primary.200" borderRadius={'12px'} mt="5px">
            <HStack>
                <HStack
                    alignItems={'center'}
                    space={1}
                    p="5px"
                    bg="primary.1000"
                    borderRadius={'20px'}
                >
                    <Success />
                    <Text mr="10px" color="white" fontSize={'12px'} fontWeight={500}>
                        {t('components.verified')}
                    </Text>
                </HStack>
                <Box flex={1}></Box>
            </HStack>
            <Text fontSize={'12px'} fontWeight={500} mt="5px">
                {alertText[type]}
            </Text>
        </Box>
    );
};

export default VerifiedContractAlert;
