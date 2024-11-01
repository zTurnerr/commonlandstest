import { AddIcon, Flex, HStack, Text, useTheme } from 'native-base';
import React from 'react';
import Button from '../../../components/Button';
import Empty from '../../../components/Icons/Empty';
import useTranslate from '../../../i18n/useTranslate';

const EmptyContract = ({ onCreateContract }) => {
    const theme = useTheme();
    const t = useTranslate();
    return (
        <Flex bg="gray.1500" px="30px" flex={1} justifyContent={'center'} alignItems={'center'}>
            {/* <Box
                justifyContent={'center'}
                alignItems={'center'}
                w={'48px'}
                h={'48px'}
                borderRadius={'10px'}
                backgroundColor={theme.colors.appColors.bgPrimary}
            >
                <Image alt="android" source={Images.icNote} w={30} h={30} />
            </Box> */}
            <Empty />
            <Text fontWeight={'600'} mt={'10px'} fontSize={'14px'}>
                {t('contract.noContract')}
            </Text>
            <Text
                color={'gray.800'}
                textAlign={'center'}
                fontWeight={'400'}
                mt={'10px'}
                fontSize={'11px'}
            >
                {`${t('contract.noDataCreateContract')}`}
            </Text>
            <Button
                variant="outline"
                _container={{
                    mt: '18px',
                    w: '173px',
                    borderRadius: '26px',
                }}
                onPress={onCreateContract}
            >
                <HStack space={2}>
                    <AddIcon size="md" color={theme.colors.appColors.primary} />
                    <Text fontSize={'13px'} fontWeight={600} color="primary.600">
                        {t('contract.createAContract')}
                    </Text>
                </HStack>
            </Button>
        </Flex>
    );
};

export default EmptyContract;
