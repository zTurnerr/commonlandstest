import useTranslate from '../../../i18n/useTranslate';
import { Box, Center, HStack, Image, Text, useTheme } from 'native-base';
import React from 'react';
import Clock3 from '../../Icons/Clock3';
import EnterPassInput from '../../Input/EnterPassInput';
import Button from '../../Button';
import Signature from '../../Icons/Signature';
import FillLock from '../../Icons/FillLock';
import Error from '../../Error';

const SignByPassStep = ({
    onSubmit = () => {},
    passwordObj = {},
    signer = {},
    loading = false,
    err = '',
    onBack = () => {},
}) => {
    const theme = useTheme();
    const t = useTranslate();
    return (
        <Box>
            <Text mt="16px" fontSize={'14px'} fontWeight={500}>
                {`${t('others.step')} 2`}
            </Text>
            <Text mb="50px" color="gray.1800">
                {t('contract.borrowerSignContract')}
            </Text>
            <Center mb="62px">
                <Box w="60px" h="60px" bg="gray.300" borderRadius={'100px'}>
                    <Image
                        source={{ uri: signer?.receiver?.avatar }}
                        alt="image base"
                        w="full"
                        h="full"
                        resizeMode="cover"
                        borderRadius={'100px'}
                    />
                    <Box
                        bg="white"
                        borderRadius={'100px'}
                        position={'absolute'}
                        bottom={'0px'}
                        right={'0px'}
                        borderWidth={2}
                        borderColor={'white'}
                    >
                        <Clock3 color="#EAA300" width="16" height="16" />
                    </Box>
                </Box>
                <Text mt="15px" fontSize="14px" fontWeight={600}>
                    {signer?.receiver?.fullName}
                </Text>
                <Text color="gray.700">{signer?.receiver?.phoneNumber}</Text>
            </Center>
            <Text mb="11px" fontWeight={600}>
                {t('contract.enterPassword')}
            </Text>
            <HStack>
                <EnterPassInput passwordObj={passwordObj} />
            </HStack>
            <Error>{err}</Error>
            <HStack mt="31px" space={2}>
                <Button
                    variant="outline"
                    _container={{ flex: 1, disabled: loading, opacity: loading ? 0.5 : 1 }}
                    onPress={onBack}
                >
                    Back
                </Button>
                <Button
                    _container={{
                        alignSelf: 'center',
                        mb: '24px',
                        bg: 'primary.600',
                        flex: 1,
                    }}
                    textColor={theme.colors.white}
                    color="custom"
                    onPress={onSubmit}
                    isLoading={loading}
                >
                    <HStack alignItems={'center'} space={2}>
                        <Signature width="20" height="20" color="white" />
                        <Text color="white" fontSize={'14px'} fontWeight={700}>
                            {t('button.sign')}
                        </Text>
                    </HStack>
                </Button>
            </HStack>
            <HStack w="full" space={2}>
                <FillLock />
                <Text flex={1} fontSize={'10px'} fontWeight={400}>
                    {`${t('contract.lockCertWarning')}`}
                </Text>
            </HStack>
        </Box>
    );
};

export default SignByPassStep;
