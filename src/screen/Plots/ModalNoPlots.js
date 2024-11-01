import useTranslate from '../../i18n/useTranslate';
import React from 'react';
import { Flex, Text, Actionsheet, Image } from 'native-base';
import Button from '../../components/Button';
import LogoColor from '../../images/logoColor.png';
import { useNavigation } from '@react-navigation/core';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
export default function Index({ isOpen, onClose, position }) {
    const mapReducer = useShallowEqualSelector((state) => state.map);
    const navigation = useNavigation();
    const _onClose = () => {
        onClose();
        //call api update frist login
    };
    const t = useTranslate();
    return (
        <Actionsheet isOpen={isOpen} onClose={_onClose}>
            <Actionsheet.Content>
                <Flex w="full" p="12px" alignItems="center">
                    <Image source={LogoColor} alt="logo" mb="24px" />
                    <Text mb="24px" textAlign="center" px="30px">
                        {t('plot.noInvolvedRegistries')}
                    </Text>
                    <Button
                        onPress={() => {
                            _onClose();
                            navigation.navigate('CreatePlot', {
                                longlat: [
                                    position ? position.long : mapReducer.currentPosition?.long,
                                    position ? position.lat : mapReducer.currentPosition?.lat,
                                ],
                                zoom: mapReducer.currentPosition?.zoom,
                            });
                        }}
                        _container={{ mb: '20px' }}
                    >
                        {t('plot.createAPlot2')}
                    </Button>
                </Flex>
            </Actionsheet.Content>
        </Actionsheet>
    );
}
