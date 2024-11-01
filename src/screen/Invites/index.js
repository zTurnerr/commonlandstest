import useTranslate from '../../i18n/useTranslate';
import { Box, Text } from 'native-base';
import { INVITE_STATUS, capitalizeFirstLetter } from '../../util/Constants';
import React, { useEffect, useState } from 'react';
import { getInvites } from '../../rest_client/apiClient';
import { SecurityUser } from '../../components/Icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Tab from './Tab';
import Tabs from '../../components/Tabs';
import { mapSliceActions } from '../../redux/reducer/map';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import useShallowEqualSelector from '../../redux/customHook/useShallowEqualSelector';
import Header from '../../components/Header';

export default function Index() {
    const t = useTranslate();

    const renderTabLabel = (active, item, tabIndex) => (
        <Box {...styles.label}>
            <Text color={active ? '#5EC4AC' : 'black'} fontWeight="bold">
                {item.label}
            </Text>
            <Box {...styles.badge}>
                <Text color="white">
                    {
                        invites[TABS[tabIndex].value].filter((i) =>
                            [INVITE_STATUS.sent, INVITE_STATUS.receive].includes(i.status),
                        ).length
                    }
                </Text>
            </Box>
        </Box>
    );

    const TABS = [
        {
            label: t('invite.received'),
            value: 'receive',
            renderLabel: ({ active, item }) => renderTabLabel(active, item, 0),
        },
        {
            label: t('invite.created'),
            value: 'created',
            renderLabel: ({ active, item }) => renderTabLabel(active, item, 1),
        },
    ];

    const [tabActive, setTab] = useState(0);
    const invites = useShallowEqualSelector((state) => state.map.invites);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    useEffect(() => {
        fetchInvites();
    }, []);
    const fetchInvites = async () => {
        try {
            let resInvites = await getInvites({}, navigation, dispatch);
            dispatch(
                mapSliceActions.updateInvites({
                    invites: resInvites.data,
                }),
            );
        } catch (err) {}
    };
    const compactPhoneNumber = (phoneNumber) => {
        return phoneNumber.slice(0, 3) + '..' + phoneNumber.slice(-3);
    };
    const getStatusData = (status) => {
        switch (status) {
            case INVITE_STATUS.sent:
                return {
                    text: t('invite.pending'),
                    color: '#FABD3A',
                    bg: 'rgba(250, 189, 58, 0.10)',
                };
            case INVITE_STATUS.receive:
                return {
                    text: t('invite.pending'),
                    color: '#FABD3A',
                    bg: 'rgba(250, 189, 58, 0.10)',
                };
            case INVITE_STATUS.accepted:
                return {
                    text: t('invite.connected'),
                    color: '#5EC4AC',
                    bg: 'rgba(94, 196, 172, 0.10)',
                };
            case INVITE_STATUS.rejected:
                return {
                    text: t('invite.rejected'),
                    color: 'rgba(218, 59, 1, 1)',
                    bg: 'rgba(255, 147, 132, 0.30)',
                };

            default:
                return {};
        }
    };
    const getTitle = (item) => {
        switch (tabActive) {
            case 0:
                return (
                    <Text fontWeight="bold">
                        {t('invite.youHaveInvited')}
                        <Text fontWeight="bold">
                            {' '}
                            {compactPhoneNumber(item.createdBy?.phoneNumber)}
                        </Text>{' '}
                        {t('invite.toBe')}{' '}
                        <Text fontWeight="bold">{capitalizeFirstLetter(item.relationship)}</Text>{' '}
                        {t('invite.ofPlot')}
                        <Text fontWeight="bold"> {item.plotID?.name}</Text>
                    </Text>
                );

            case 1:
                return (
                    <Text>
                        {t('invite.youInvitedTo')}{' '}
                        <Text fontWeight="bold">{capitalizeFirstLetter(item.relationship)}</Text>{' '}
                        {t('invite.ofPlot')}{' '}
                        <Text fontWeight="bold">
                            {item.inviteePlotID?.name || item.plotID?.name}{' '}
                        </Text>
                        {item.createdBy?.phoneNumber ? (
                            <>
                                {t('invite.by')}
                                <Text fontWeight="bold">
                                    {' '}
                                    {compactPhoneNumber(item.createdBy?.phoneNumber)}{' '}
                                </Text>
                            </>
                        ) : (
                            ''
                        )}
                    </Text>
                );

            default:
                break;
        }
    };
    const renderItem = (item) => {
        let data = getStatusData(item.status);
        return (
            <TouchableOpacity activeOpacity={1} key={item._id} onPress={() => onPress(item)}>
                <Box {...styles.item}>
                    <Box {...styles.role}>
                        <SecurityUser color={'white'} />{' '}
                        <Text color="white">{t(`claimants.${item.relationship}`)}</Text>
                    </Box>
                    {getTitle(item)}

                    <Status {...data} />
                </Box>
            </TouchableOpacity>
        );
    };
    const onPress = (item) => {
        if (tabActive === 1 || ![INVITE_STATUS.sent, INVITE_STATUS.receive].includes(item.status))
            return;

        return navigation.push('PlotInfo', {
            plotID: item.plotID._id,
            manageNeighbors: item.relationship === 'neighbor',
        });
    };
    return (
        <Box {...styles.container}>
            <Header title={t('profile.invites')} />
            <Tabs items={TABS} activeIndex={tabActive} onTabChange={setTab} />
            <Tab items={invites[TABS[tabActive].value]} renderItem={renderItem} />
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        h: 'full',
        backgroundColor: 'white',
    },
    item: {
        borderRadius: '18px',
        flexDirection: 'column',
        marginTop: '12px',
        padding: '12px',
        backgroundColor: 'gray.200',
        alignItems: 'flex-start',
    },
    // containerRole: {
    //     flex: 1,
    //     alignItems: 'flex-start',
    //     justifyContent: 'center',
    // },
    role: {
        backgroundColor: '#267385',
        padding: '2px',
        px: '8px',
        py: '2px',
        borderRadius: '12px',
        alignItems: 'center',
        flexDirection: 'row',
        mb: '12px',
    },
    badge: {
        minWidth: '24px',
        height: '20px',
        borderRadius: '4px',
        px: '4px',
        backgroundColor: '#5EC4AC',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '8px',
    },
    label: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // text: {
    //     color: 'white',
    // },
    status: {
        px: '12px',
        py: '4px',
        borderRadius: '18px',
        mt: '8px',
    },
});

const Status = ({ bg, color, text }) => {
    return (
        <Box bg={bg} {...styles.status}>
            <Text color={color}>{text}</Text>
        </Box>
    );
};
