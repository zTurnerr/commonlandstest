import { Box, HStack, Text, Button as ButtonNative } from 'native-base';
import React from 'react';
import useTranslate from '../../i18n/useTranslate';
import Button from '../../components/Button';
import { useMemo } from 'react';

const GroupButtonApproveEdit = ({ title, error, loading, onApprove, onDecline }) => {
    const t = useTranslate();

    const isDisabled = useMemo(() => {
        if (loading === 'approve' || loading === 'decline') return true;
        return false;
    }, [loading]);

    return (
        <Box bgColor={'white'} p={'20px'} shadow={9}>
            {(error || '')?.length === 0 && title && (
                <Text fontWeight={600} mb={'20px'} textAlign={'center'}>
                    {title}
                </Text>
            )}
            {error?.length > 0 && (
                <Text textAlign={'center'} mb={'20px'} color={'danger.1500'}>
                    {error}
                </Text>
            )}
            <HStack justifyContent={'space-between'}>
                <Button
                    variant={'outline'}
                    _container={{ w: '48%', borderColor: 'danger.1500', borderRadius: '4px' }}
                    onPress={onDecline}
                    _pressed={{ bgColor: 'danger.1510' }}
                    isLoading={loading === 'decline'}
                    isDisabled={isDisabled}
                    _spinner={{
                        color: 'danger.1500',
                    }}
                >
                    <Text fontWeight={500} fontSize={12} color={'danger.1500'}>
                        {t('button.decline')}
                    </Text>
                </Button>
                <ButtonNative
                    bgColor={'primary.600'}
                    borderRadius={'4px'}
                    w={'48%'}
                    _pressed={{ bgColor: 'primary.700' }}
                    onPress={onApprove}
                    isDisabled={isDisabled}
                    isLoading={loading === 'approve'}
                    _loading={{ bgColor: 'primary.600', opacity: 0.8 }}
                >
                    <Text fontWeight={500} fontSize={12} color={'white'}>
                        {t('button.approve')}
                    </Text>
                </ButtonNative>
            </HStack>
        </Box>
    );
};

export default GroupButtonApproveEdit;
