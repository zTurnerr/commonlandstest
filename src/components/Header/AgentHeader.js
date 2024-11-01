import { useNavigation } from '@react-navigation/native';
import { Box, HStack, Spinner, Text, useDisclose, useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import useTranslate from '../../i18n/useTranslate';
import { logout, signOutTrainer } from '../../redux/actions/user';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import { CheckExistTrainer } from './utils/trainer';
import useGetTrainingMode from '../../hooks/dev/useGetTrainingMode';
import ReactNativeModal from 'react-native-modal';
import { SwitchTrainingIcon } from '../Icons';
import Button from '../Button';
import useDetectEnvironmentTraining from '../../hooks/useDetectEnvironmentTranining';

const TrainingModeHeader = ({ style = {} }) => {
    const { isTraining } = useGetTrainingMode();
    const t = useTranslate();
    const { isOpen, onClose, onOpen } = useDisclose();
    const { colors } = useTheme();
    const { isOpen: isLoading, onOpen: startLoading, onClose: stopLoading } = useDisclose();
    const { switchToProduction: switchToProductionTraining } = useDetectEnvironmentTraining();
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const _logout = async () => {
        onClose();
        dispatch(logout(navigation));
    };

    const switchToProduction = async () => {
        startLoading();
        _logout();
        await switchToProductionTraining();
        stopLoading();
        onClose();
    };

    if (isTraining) {
        return (
            <>
                <HStack bg={'white'}>
                    <TouchableOpacity onPress={onOpen}>
                        <Box
                            flexDirection="row"
                            alignItems="center"
                            zIndex={10}
                            {...style}
                            {...styles.container}
                        >
                            <Text
                                bg={'blue.1000'}
                                color={'white'}
                                fontSize="11px"
                                fontWeight="600"
                                pl={'15px'}
                                pr={'10px'}
                                ml={'-10px'}
                                h={'20px'}
                                borderRadius={'4px'}
                                borderTopLeftRadius={'0'}
                                borderBottomLeftRadius={'0'}
                            >
                                {t('profile.trainingMode')}
                            </Text>
                        </Box>
                    </TouchableOpacity>
                </HStack>
                <ReactNativeModal
                    animationIn={'zoomIn'}
                    animationOut={'zoomOut'}
                    safeAreaTop
                    isVisible={isOpen}
                    onBackdropPress={onClose}
                >
                    <Box
                        px={'20px'}
                        py={'30px'}
                        borderRadius={'16px'}
                        bgColor={'white'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <SwitchTrainingIcon color={colors.primary[600]} />
                        <Text fontSize={16} fontWeight={700} my={'20px'}>
                            {t('profile.trainingEnvironment')}
                        </Text>
                        <Text textAlign={'center'} fontSize={14} mb={'20px'}>
                            {t('profile.trainingEnvironmentDesc')}
                        </Text>
                        <Button
                            _container={{ my: '20px', bgColor: colors.primary[600] }}
                            onPress={onClose}
                            isDisabled={isLoading}
                        >
                            {t('button.okay')}
                        </Button>

                        <TouchableOpacity onPress={switchToProduction} disabled={isLoading}>
                            <Text color={'primary.600'} fontSize={14} fontWeight={600}>
                                {!isLoading ? t('button.switchToProduction') : <Spinner />}
                            </Text>
                        </TouchableOpacity>
                    </Box>
                </ReactNativeModal>
            </>
        );
    }

    return null;
};

const AgentHeader = ({ style = {} }) => {
    const t = useTranslate();
    const { user } = useShallowEqualSelector((state) => ({
        user: state.user,
    }));
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const trainer = user?.trainer;
    if (CheckExistTrainer(trainer, user))
        return (
            <>
                <TrainingModeHeader style={style} />
            </>
        );

    const SignOut = () => {
        dispatch(signOutTrainer({ navigation, trainer, t }));
    };

    return (
        <Box {...style}>
            <TrainingModeHeader />
            <Box
                flexDirection="row"
                alignItems="center"
                bg="white"
                zIndex={10}
                {...styles.container}
            >
                <Box flex={1}>
                    <Box flex={1} maxW={'220px'}>
                        <HStack>
                            <Text
                                bg={'primary.200'}
                                color={'primary.600'}
                                fontSize="11px"
                                fontWeight="600"
                                pl={'15px'}
                                mr={'10px'}
                                pr={'10px'}
                                ml={'-10px'}
                                h={'20px'}
                                borderRadius={'8px'}
                                borderTopLeftRadius={'0'}
                                borderBottomLeftRadius={'0'}
                                numberOfLines={1}
                            >
                                {t('agentAssist.agentName', {
                                    name: trainer?.fullName,
                                })}
                            </Text>
                        </HStack>
                    </Box>
                </Box>
                <TouchableOpacity>
                    <Text
                        color={'primary.600'}
                        fontSize={12}
                        fontWeight={600}
                        pr={'6px'}
                        onPress={SignOut}
                    >
                        {t('auth.signOut')}
                    </Text>
                </TouchableOpacity>
            </Box>
        </Box>
    );
};

export default AgentHeader;

const styles = {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        px: '4px',
        pt: '4px',
        bg: 'white',
    },
};
