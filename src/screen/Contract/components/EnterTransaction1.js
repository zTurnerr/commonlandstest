import useTranslate from '../../../i18n/useTranslate';
import { Box, Input, Text } from 'native-base';
import React from 'react';
import Button from '../../../components/Button';

const EnterTransaction1 = () => {
    const t = useTranslate();
    return (
        <Box bg="white" p="20px">
            <Text mb="12px" fontSize={'14px'} fontWeight={600}>
                {t('contract.enterTransactionCode')}
            </Text>

            <Input
                placeholder={t('contract.enterTransactionCode2')}
                _focus={{
                    borderColor: 'primary.600',
                }}
            />
            <Button
                _container={{
                    maxW: '50%',
                    mx: 'auto',
                    mt: '22px',
                }}
                variant="outline"
            >
                {t('contract.loadTransaction')}
            </Button>
        </Box>
    );
};

export default EnterTransaction1;
