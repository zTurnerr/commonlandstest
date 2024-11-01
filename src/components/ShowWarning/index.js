import { Actionsheet, Flex, Icon, Text } from 'native-base';
import React from 'react';
import { Linking } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import useTranslate from '../../i18n/useTranslate';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { userSliceActions } from '../../redux/reducer/user';
import Constants from '../../util/Constants';
import Button from '../Button';

const ShowWarning = ({ isVisibleUpdate }) => {
    const d = useDispatch();
    const t = useTranslate();
    const onClose = () => d(userSliceActions.setShowWarning({ showWarning: false }));
    const { userInfo, showWarning } = useShallowEqualSelector((state) => state.user);

    if (!userInfo.blockedPlots || isVisibleUpdate) return null;
    return (
        <Actionsheet isOpen={showWarning} onClose={onClose}>
            <Actionsheet.Content>
                <Flex w="full" p="12px" alignItems="center">
                    <Icon
                        as={<MaterialCommunityIcons name="information" />}
                        mb="10px"
                        size={30}
                        color="warning.500"
                    />
                    <Text fontWeight="bold" fontSize="18px" mb="10px">
                        {t('components.commonlandsWarning')}
                    </Text>
                    <Text
                        fontWeight={'500'}
                        fontSize="14px"
                        mb="44px"
                        textAlign="center"
                        color="text.secondary"
                    >
                        {t('components.yourPlot')}{' '}
                        <Text fontWeight="bold" color="black">
                            {userInfo?.blockedPlots?.join(', ')}
                        </Text>{' '}
                        {t('components.contentWarning')}
                        <Text fontWeight="bold" color="black">
                            {Constants.contactEmail}
                        </Text>{' '}
                        {t('components.potentialReinstatement')}
                    </Text>

                    <Button
                        onPress={() => {
                            Linking.openURL(`mailto:${Constants.contactEmail}`);
                            onClose();
                        }}
                        _container={{ mb: '20px' }}
                    >
                        {t('components.contactUs')}
                    </Button>
                </Flex>
            </Actionsheet.Content>
        </Actionsheet>
    );
};

export default ShowWarning;
