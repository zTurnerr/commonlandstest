import useTranslate from '../../i18n/useTranslate';
import { Box, Input, Text } from 'native-base';
import React, { useState } from 'react';

import Button from '../../components/Button';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { deletePlot, getUserPlots } from '../../rest_client/apiClient';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { userSliceActions } from '../../redux/reducer/user';
import { DeviceEventEmitter } from 'react-native';
import { deviceEvents } from '../../util/Constants';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';

export default function Index({ isOpen, onClose, plotData }) {
    const [error, setError] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [name, setName] = useState('');
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { user } = useShallowEqualSelector((state) => ({
        user: state.user,
    }));

    const onDelete = async (plotName) => {
        try {
            if (plotName !== plotData.plot?.name) {
                throw t('error.plotNotCorrect');
            }
            await deletePlot(plotData.plot?._id, navigation, dispatch);
            let resUserPlots = await getUserPlots(user.userInfo._id, navigation, dispatch);
            dispatch(
                userSliceActions.setData({
                    plots: resUserPlots.data,
                }),
            );
            DeviceEventEmitter.emit(deviceEvents.plots.unSelectPolygon);
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.navigate('Main');
            }
            EventRegister.emit(EVENT_NAME.refreshPlotList);
        } catch (err) {
            throw err;
        }
    };

    const _onSubmit = async () => {
        try {
            setRequesting(true);
            setError('');
            await onDelete(name);
        } catch (err) {
            setError(err);
        } finally {
            setRequesting(false);
        }
    };
    const _onClose = () => {
        setName('');
        setError('');
        onClose();
    };
    const t = useTranslate();
    return (
        <Modal isVisible={isOpen} onBackdropPress={_onClose} avoidKeyboard>
            <Box borderRadius="12px" bg="white" justifyContent="center" p="20px">
                <Text mt="20px" mb="0px" fontSize="18px" textAlign="center" fontWeight="bold">
                    {t('invite.plotUnRegistration')}
                </Text>
                <Text
                    mt="20px"
                    mb="12px"
                    fontSize="14px"
                    // textAlign="center"
                >
                    {t('invite.caution')} <Text fontWeight="bold">{t('invite.cannot')}</Text>{' '}
                    {t('invite.beRecovered')}:
                </Text>
                <Text>- {t('invite.plotDataItself')}</Text>
                <Text>- {t('invite.claimantsAdded')}</Text>
                <Text>- {t('invite.neighborsLinked')}</Text>
                <Text>- {t('invite.unresolvedInvites')}</Text>
                <Text>
                    - {`${t('invite.claimChainInvolved')}`}{' '}
                    <Text fontWeight="bold">{plotData?.plot?.name}</Text> {t('invite.intoTextBox')}
                </Text>

                <Input
                    placeholder={t('plotInfo.plotName')}
                    value={name}
                    onChangeText={setName}
                    mt="12px"
                />
                {Boolean(error) && (
                    <Text mt="8px" color="error.400">
                        {error}
                    </Text>
                )}
                <Box w="full" flexDir="row" mt="12px" justifyContent="space-between">
                    <Button
                        _container={{
                            mt: '12px',
                            w: '48%',
                        }}
                        onPress={() => {
                            _onClose();
                        }}
                        isDisabled={requesting}
                        variant="outline"
                    >
                        {t('button.cancel')}
                    </Button>
                    <Button
                        _container={{
                            mt: '12px',
                            w: '48%',
                        }}
                        onPress={() => {
                            _onSubmit();
                        }}
                        isDisabled={requesting || name !== plotData?.plot?.name}
                        isLoading={requesting}
                    >
                        {t('button.ok')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
