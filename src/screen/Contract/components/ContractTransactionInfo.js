import { HStack, Text, VStack, useTheme } from 'native-base';
import React from 'react';
import Success from '../../../components/Icons/Success';
import useTranslate from '../../../i18n/useTranslate';

const renderTxField = (label, value, options = {}) => {
    return (
        <HStack
            borderBottomColor={'gray.1400'}
            borderBottomWidth={options.bottomBorder === false ? 0 : 1}
            p="15px"
            w="full"
            space={2}
            alignItems={'center'}
            justifyContent={'space-between'}
        >
            <Text color="gray.800" fontWeight={500}>
                {label}
            </Text>
            <Text fontWeight={600}>{value}</Text>
        </HStack>
    );
};

const ContractTransactionInfo = () => {
    const theme = useTheme();
    const t = useTranslate();
    return (
        <VStack bg="white" alignItems={'center'}>
            <Text mt="25px" fontSize={'14px'} fontWeight={700}>
                {t('contract.transactionInfo')}
            </Text>
            <HStack
                mt="10px"
                alignItems={'center'}
                space={1}
                p="5px"
                bg="primary.1300"
                borderRadius={'20px'}
            >
                <Success color={theme.colors.primary[1000]} />
                <Text color="primary.1000" mr="10px" fontSize={'12px'} fontWeight={500}>
                    {t('components.successful')}
                </Text>
            </HStack>
            {renderTxField(t('contract.invoiceId'), '849534549')}
            {renderTxField(t('contract.partyIdType'), '849534549')}
            {renderTxField(t('contract.partyId'), '849534549')}
            {renderTxField(t('contract.payerName'), '849534549')}
            {renderTxField('Amount', '849534549', {
                bottomBorder: false,
            })}
        </VStack>
    );
};

export default ContractTransactionInfo;
