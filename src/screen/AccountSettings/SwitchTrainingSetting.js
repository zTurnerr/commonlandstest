import { Box, Switch, Text, useDisclose, useTheme } from 'native-base';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import useTranslate from '../../i18n/useTranslate';
import ReactNativeModal from 'react-native-modal';
import { SwitchTrainingIcon } from '../../components/Icons';
import Button from '../../components/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/user';
import { useNavigation } from '@react-navigation/native';
import useDetectEnvironmentTraining from '../../hooks/useDetectEnvironmentTranining';

const SwitchToEnvironment = [
    {
        title: 'profile.switchToTraining',
        description: 'profile.switchToTrainingDesc',
    },
    {
        title: 'profile.switchToProduction',
        description: 'profile.switchToProductionDesc',
    },
];

export default function SwitchTrainingSetting() {
    const [checked, setChecked] = React.useState(false);
    const [requesting, setRequesting] = React.useState(false);
    const { isOpen, onOpen, onClose } = useDisclose();

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { switchToProduction, switchToTraining, detectIsInProduction } =
        useDetectEnvironmentTraining();

    const initState = async () => {
        try {
            setRequesting(true);
            const isProduction = await detectIsInProduction();
            setChecked(!isProduction);
        } catch (err) {}
        setRequesting(false);
    };

    const handleToggle = async () => {
        onOpen();
    };

    const _logout = async () => {
        onClose();
        dispatch(logout(navigation));
    };

    const handleApprove = async () => {
        setRequesting(true);
        _logout();
        if (checked) {
            await switchToProduction();
        } else {
            await switchToTraining();
        }
        setRequesting(false);
        onClose();
    };

    useEffect(() => {
        initState();
    }, []);

    let _indexTraining = checked ? 1 : 0;

    const t = useTranslate();
    const theme = useTheme();
    return (
        <>
            <Box {...styles.container}>
                <Text fontSize="14px">{t('profile.switchToTraining')}</Text>
                <Switch
                    size="md"
                    isChecked={checked}
                    onToggle={handleToggle}
                    isDisabled={requesting}
                />
            </Box>
            <ReactNativeModal isVisible={isOpen} onBackdropPress={onClose} safeAreaTop>
                <Box
                    px={'20px'}
                    py={'30px'}
                    borderRadius={'16px'}
                    bgColor={'white'}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <SwitchTrainingIcon color={theme.colors.primary[600]} />
                    <Text fontSize={16} fontWeight={700} my={'20px'}>
                        {t(SwitchToEnvironment[_indexTraining].title)}
                    </Text>
                    <Text textAlign={'center'} fontSize={14}>
                        {t(SwitchToEnvironment[_indexTraining].description)}
                    </Text>
                    <Button
                        _container={{ my: '20px', bgColor: theme.colors.primary[600] }}
                        onPress={handleApprove}
                    >
                        {t('button.agreeProceed')}
                    </Button>
                    <Button variant={'outline'} onPress={onClose}>
                        {t('button.back')}
                    </Button>
                </Box>
            </ReactNativeModal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        w: '100%',
        px: '12px',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
