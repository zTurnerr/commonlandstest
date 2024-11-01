import { Box, Icon, ScrollView, Text, useDisclose } from 'native-base';
import useTranslate from '../../i18n/useTranslate';

import { useNavigation } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import BasicProfile from '../../components/BasicProfile';
import Button from '../../components/Button';
import Header from '../../components/Header';
import { CheckExistTrainer } from '../../components/Header/utils/trainer';
import { EditPen } from '../../components/Icons';
import { logout, signOutTrainer } from '../../redux/actions/user';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import Notifications from '../../screen/AccountSettings/NotificationSetting';
import { INVITE_STATUS } from '../../util/Constants';
import ModalConfirm from './ModalConfirmLogout';
import SwitchTrainingSetting from '../AccountSettings/SwitchTrainingSetting';

const Row = ({ label, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Box w="full" flexDirection="row" p="12px">
                <Text fontSize="14px" flex={1}>
                    {label}
                </Text>
                <Icon size={6} as={<MaterialCommunityIcons name="chevron-right" />} />
            </Box>
        </TouchableOpacity>
    );
};

export default function Index() {
    const t = useTranslate();

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { isOpen, onOpen, onClose } = useDisclose();
    const { user, map, trainer } = useShallowEqualSelector((state) => ({
        user: state.user.userInfo,
        trainer: state.user.trainer,
        map: state.map,
    }));

    const _logout = async () => {
        if (trainer?._id && trainer?._id !== user?._id) {
            dispatch(signOutTrainer({ navigation, trainer }));
        } else {
            dispatch(logout(navigation));
        }
    };

    const DATA = [
        {
            title: t('profile.account'),
            items: [
                {
                    label: t('askRecommendation.creditRecommendations'),
                    onPress: () => {
                        navigation.navigate('AskRecommendation');
                    },
                },
                {
                    label: t('profile.profileHistory'),
                    onPress: () => {
                        navigation.navigate('ProfileHistory');
                    },
                },
                {
                    label: t('profile.myCertificate'),
                    onPress: () => {
                        navigation.navigate('MyCert');
                    },
                },
                {
                    label: (
                        <>
                            {t('profile.invites')}{' '}
                            <Text color="primary.500" fontWeight="bold">
                                (
                                {map.invites?.created?.filter((i) =>
                                    [INVITE_STATUS.sent, INVITE_STATUS.receive].includes(i.status),
                                ).length +
                                    map.invites?.receive?.filter((i) =>
                                        [INVITE_STATUS.sent, INVITE_STATUS.receive].includes(
                                            i.status,
                                        ),
                                    ).length || 0}
                                )
                            </Text>
                        </>
                    ),
                    onPress: () => {
                        navigation.navigate('Invites');
                    },
                },
                // {
                //     label: <>Linking Account</>,
                //     onPress: () => {
                //         navigation.navigate('LinkingAccount');
                //     },
                // },
                {
                    label: (
                        <>
                            {t('agentAssist.agentPermissions')}{' '}
                            <Text color="primary.500" fontWeight="bold">
                                ({map.agentPermissions.length})
                            </Text>
                        </>
                    ),
                    onPress: () => {
                        navigation.navigate('AgentAssistPermissions');
                    },
                },
                {
                    label: t('profile.changePassword'),
                    onPress: () => {
                        navigation.navigate('ChangePassword');
                    },
                },
                {
                    label: 'Offline map',
                    onPress: () => {
                        navigation.navigate('OfflineMap');
                    },
                    hide: !user?.isTrainer && CheckExistTrainer(trainer, { userInfo: user }),
                },
            ],
        },
        {
            title: t('profile.notifications'),
            items: [
                {
                    render: (index) => <Notifications key={index} />,
                },
            ],
        },
        {
            title: t('profile.about'),
            items: [
                {
                    label: t('profile.helpCenter'),
                    onPress: () => {
                        navigation.navigate('HelpCenter');
                    },
                },
                {
                    label: t('profile.aboutCommonlands'),
                    onPress: () => {},
                },
            ],
        },

        {
            title: t('contract.settings'),
            items: [
                {
                    render: (index) => <SwitchTrainingSetting key={index} />,
                },
            ],
        },
    ];

    useEffect(() => {
        if (__DEV__) {
            // _logout();
        }
    }, []);

    return (
        <Box {...styles.container}>
            <Header title={t('profile.profileSettings')}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('EditProfile');
                    }}
                >
                    <Box flexDirection="row" alignItems="center">
                        <EditPen />
                        <Text fontWeight="500" ml="4px">
                            {t('profile.editProfile')}
                        </Text>
                    </Box>
                </TouchableOpacity>
            </Header>
            <ScrollView contentContainerStyle={styles.scrolView}>
                <BasicProfile data={user} bg="white" />
                <Box {...styles.containerList}>
                    {DATA.map((group, index) => {
                        return (
                            <Box key={index}>
                                <Box {...styles.groupTitle}>
                                    <Text fontSize="14px" fontWeight="600">
                                        {group.title}
                                    </Text>
                                </Box>
                                {group.items
                                    .filter((item) => !item.hide)
                                    .map((item, index) => {
                                        return (
                                            <Box key={index} {...styles.containerItem}>
                                                {item.render ? (
                                                    item.render(index)
                                                ) : (
                                                    <Row {...item} />
                                                )}
                                                {item.divider && <Box {...styles.divider} />}
                                            </Box>
                                        );
                                    })}
                            </Box>
                        );
                    })}
                </Box>
                <Box px="12px">
                    <Button variant="outline" {...styles.buttonSignOut} onPress={onOpen}>
                        {t('profile.signOut')}
                    </Button>
                </Box>
            </ScrollView>
            <ModalConfirm isOpen={isOpen} onClose={onClose} logout={_logout} />
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 'full',
        backgroundColor: 'white',
    },
    containerList: {
        width: 'full',
        marginTop: '12px',
    },
    groupTitle: {
        bg: 'gray.200',
        p: '12px',
    },
    divider: {
        borderBottomColor: 'gray.300',
        borderBottomWidth: '1px',
        marginTop: '12px',
        marginBottom: '12px',
    },
    buttonSignOut: {
        marginTop: '12px',
        marginBottom: '20px',
    },
    containerItem: {
        px: '12px',
        bg: 'white',
        minH: '44px',
        justifyContent: 'center',
    },
    scrolView: {
        paddingBottom: 80,
    },
});
