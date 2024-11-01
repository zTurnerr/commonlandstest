import useTranslate from '../../i18n/useTranslate';
import { Actionsheet, Box, Flex, Icon, Image, Text } from 'native-base';
import { Linking, TouchableOpacity } from 'react-native';

import Button from '../../components/Button';
import LogoColor from '../../images/logoColor.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import { useNavigation } from '@react-navigation/core';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';

const URL = 'https://www.commonlands.org/for-communities';
export default function Index({ isOpen, onClose }) {
    const mapReducer = useShallowEqualSelector((state) => state.map);
    const navigation = useNavigation();
    const _onClose = () => {
        onClose();
        //call api update first login
    };
    const t = useTranslate();
    return (
        <Actionsheet isOpen={isOpen} onClose={_onClose}>
            <Actionsheet.Content>
                <Flex w="full" p="12px" alignItems="center">
                    <Image source={LogoColor} alt="logo" mb="24px" />
                    <Text fontWeight="bold" fontSize="16px" mb="10px">
                        {t('explore.welcomeToCommonlands')}
                    </Text>
                    <Text mb="24px" textAlign="center" px="30px">
                        {t('explore.ANewWay')}
                    </Text>

                    <Button
                        onPress={() => {
                            _onClose();
                            navigation.navigate('CreatePlot', {
                                longlat: [
                                    mapReducer.currentPosition?.long,
                                    mapReducer.currentPosition?.lat,
                                ],
                                zoom: mapReducer.currentPosition?.zoom,
                            });
                        }}
                        _container={{ mb: '20px' }}
                    >
                        {t('explore.registerYourLand')}
                    </Button>
                    <TouchableOpacity
                        onPress={() => {
                            Linking.openURL(URL);
                        }}
                    >
                        <Box
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="center"
                            mb="12px"
                        >
                            <Icon
                                as={<MaterialCommunityIcons name="information-outline" />}
                                size={6}
                                color="link"
                                mr="4px"
                            />
                            <Text fontSize="12px" fontWeight="500" color="link">
                                {t('explore.learnUseCommonlands')}
                            </Text>
                        </Box>
                    </TouchableOpacity>
                </Flex>
            </Actionsheet.Content>
        </Actionsheet>
    );
}
