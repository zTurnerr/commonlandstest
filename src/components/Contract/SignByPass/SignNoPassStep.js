import { Box, Center, HStack, Image, Text, useTheme } from 'native-base';
import React from 'react';
import useUserInfo from '../../../hooks/useUserInfo';
import useTranslate from '../../../i18n/useTranslate';
import Button from '../../Button';
import Clock3 from '../../Icons/Clock3';
import FillLock from '../../Icons/FillLock';
import Signature from '../../Icons/Signature';

const SignNoPassStep = ({
    onSubmit = () => {},
    // passwordObj = {},
    signer = null,
    loading = false,
    // err = '',
    btnText = 'button.sign',
    MiddleSectionProp = null,
    showSubmitButton = true,
}) => {
    const theme = useTheme();
    const user = useUserInfo();
    const t = useTranslate();

    const getUser = () => {
        if (signer) {
            return signer?.receiver;
        }
        return user;
    };

    const MiddleSection = (
        <>
            <Text mt="45px" fontSize={'16px'} fontWeight={700}>
                {t('contract.addCertAndSign')}
            </Text>
            <Text fontSize={'14px'} textAlign={'center'} mt="11px">
                {`${t('contract.lockCertWarning2')}`}
            </Text>
        </>
    );

    return (
        <Box>
            {/* <Text mt="16px" fontSize={'14px'} fontWeight={500}>
                {`${t('others.step')} 2`}
            </Text>
            <Text mb="50px" color="gray.1800">
                {t('contract.borrowerSignContract')}
            </Text> */}
            <Center>
                <Box w="60px" h="60px" bg="gray.300" borderRadius={'100px'}>
                    <Image
                        source={{ uri: getUser()?.avatar }}
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
                    {getUser()?.fullName}
                </Text>
                <Text color="gray.700">{getUser()?.phoneNumber}</Text>
                {MiddleSectionProp || MiddleSection}
            </Center>
            {showSubmitButton && (
                <Button
                    _container={{
                        alignSelf: 'center',
                        mb: '24px',
                        bg: 'primary.600',
                        // mt: '20px',
                    }}
                    textColor={theme.colors.white}
                    color="custom"
                    onPress={onSubmit}
                    isLoading={loading}
                >
                    <HStack alignItems={'center'} space={2}>
                        <Signature width="20" height="20" color="white" />
                        <Text color="white" fontSize={'14px'} fontWeight={700}>
                            {t(btnText)}
                        </Text>
                    </HStack>
                </Button>
            )}
            <HStack w="full" space={2}>
                <FillLock />
                <Text flex={1} fontSize={'10px'} fontWeight={400}>
                    {`${t('contract.readCmlPolicy')}`}
                </Text>
            </HStack>
        </Box>
    );
};

export default SignNoPassStep;
