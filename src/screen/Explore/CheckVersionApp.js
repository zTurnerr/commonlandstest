import useTranslate from '../../i18n/useTranslate';
import { Actionsheet, Box, Flex, Image, Text } from 'native-base';

import Button from '../../components/Button';
import { Linking } from 'react-native';
import LogoColor from '../../images/logoColor.png';
import React from 'react';

const GOOGLE_STORE =
    'https://play.google.com/store/apps/details?id=org.commonlands.mobile&hl=en-VN';

const CheckVersionApp = ({ isOpen, onClose, newVersion, isRequireUpdate }) => {
    const t = useTranslate();
    return (
        <Actionsheet isOpen={isOpen} onClose={!isRequireUpdate && onClose}>
            <Actionsheet.Content>
                <Flex w="full" p="12px" alignItems="center">
                    <Image source={LogoColor} alt="logo" mb="24px" />
                    <Text color={'rgba(24, 24, 27, 1)'} fontWeight="bold" fontSize="16px" mb="10px">
                        {t('explore.titleUpdate')}
                    </Text>
                    <Box
                        w={141}
                        h={30}
                        backgroundColor={'rgba(94, 196, 172, 0.1)'}
                        borderRadius={15}
                        justifyContent={'center'}
                        alignItems="center"
                        mb={'20px'}
                    >
                        <Text color={'rgba(58, 151, 173, 1)'} fontWeight="700" fontSize="12px">
                            {`${t('explore.newVersion')} ${newVersion || '1.0.0'}`}
                        </Text>
                    </Box>
                    <Text
                        fontWeight={'500'}
                        fontSize="14px"
                        mb="44px"
                        textAlign="center"
                        color={'rgba(24, 24, 27, 0.6)'}
                    >
                        {t('explore.contentUpdate')}
                    </Text>

                    <Button
                        onPress={() => {
                            Linking.openURL(GOOGLE_STORE);
                            !isRequireUpdate && onClose?.();
                        }}
                        _container={{ mb: '20px' }}
                    >
                        {t('button.update')}
                    </Button>
                </Flex>
            </Actionsheet.Content>
        </Actionsheet>
    );
};

export default CheckVersionApp;
