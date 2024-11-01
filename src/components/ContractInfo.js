import { Box, HStack, Text } from 'native-base';
import React, { memo } from 'react';
import useTranslate from '../i18n/useTranslate';
import ContractImageSection from './Contract/ContractImageSection';

const ContractInfo = ({
    item,
    title = '',
    // showCreatedAt = true,
    // createdAtPosition = 'bottom',
    showImgSection = false,
    showDivider = false,
}) => {
    const t = useTranslate();

    return (
        <Box mt={title ? '21px' : '0px'}>
            {title && (
                <Text mb="15px" fontWeight={'700'} fontSize={'16px'}>
                    {title}
                </Text>
            )}

            <HStack mb="15px" w="100%">
                <Box flex={1}>
                    <Text color="gray.800" fontWeight={500} fontSize={'11px'}>
                        {t('contract.loanAmount')}
                    </Text>
                    <Text color="appColors.neuTralGrey" fontSize={'12px'} fontWeight={600}>
                        {item?.amount} Shillings
                    </Text>
                </Box>
                <Box
                    pl="18px"
                    borderLeftWidth={showDivider ? '2px' : '0px'}
                    borderColor={'gray.400'}
                    flex={1}
                >
                    <Text color="gray.800" fontWeight={500} fontSize={'11px'}>
                        {t('contract.totalAmountToBePaid')}
                    </Text>
                    <Text color="appColors.neuTralGrey" fontSize={'12px'} fontWeight={600}>
                        {item?.unlockAmount} Shillings
                    </Text>
                </Box>
            </HStack>
            {showImgSection && <ContractImageSection contract={item} />}
        </Box>
    );
};

export default memo(ContractInfo);
