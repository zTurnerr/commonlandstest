import { Actionsheet, Flex, Image, Text } from 'native-base';
import React from 'react';
import Button from '../../../components/Button';
import useTranslate from '../../../i18n/useTranslate';
import LogoColor from '../../../images/logoColor.png';

export default function Index({ isOpen, onUpdate }) {
    const t = useTranslate();
    return (
        <Actionsheet isOpen={isOpen}>
            <Actionsheet.Content>
                <Flex w="full" p="12px" alignItems="center">
                    <Image source={LogoColor} alt="logo" mb="24px" />
                    <Text fontWeight="bold" fontSize="16px" mb="10px">
                        {t('explore.setupSecurityQuestion')}
                    </Text>
                    <Text mb="24px" textAlign="center">
                        {t('explore.contentSetupQuestion')}
                    </Text>

                    <Button onPress={onUpdate} _container={{ mb: '20px' }}>
                        {t('button.update')}
                    </Button>
                </Flex>
            </Actionsheet.Content>
        </Actionsheet>
    );
}
