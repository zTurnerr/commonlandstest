import useTranslate from '../../../i18n/useTranslate';
import { Box, Text } from 'native-base';
import React, { useEffect, useState } from 'react';

import AccountItem from './AccountItem';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { getAccounts } from '../../../util/script';
import { getNotificationPublic } from '../../../rest_client/authClient';
import useGetDistanceFromHeader from '../../../hooks/useGetDistanceFromHeader';

export default function Index({ route, setAccountSelected, exception }) {
    const [numberNoti, setNumberNoti] = useState({});
    const [accounts, setAccounts] = useState([]);
    let params = route?.params || {};
    const { distance } = useGetDistanceFromHeader();
    const getAllAccounts = async () => {
        try {
            let accounts = await getAccounts();
            if (exception) {
                accounts = accounts.filter((item) => item.phoneNumber !== exception?.phoneNumber);
            }
            setAccounts(accounts);
        } catch (e) {
            console.log(e);
        }
    };

    const getNotification = async () => {
        if (!accounts || accounts?.length === 0) return;
        try {
            let res = await getNotificationPublic({
                userIDs: accounts.map((item) => item._id),
            });
            setNumberNoti(res.data?.data);
        } catch (e) {
            console.log('error', e);
        }
    };

    useEffect(() => {
        getAllAccounts();
    }, []);
    const selectAccount = (account) => {
        setAccountSelected({ ...account, timeSelect: Date.now() });
    };
    useEffect(() => {
        if (params.updateListAccount) {
            getAllAccounts();
        }
    }, [params]);
    const t = useTranslate();

    useEffect(() => {
        getNotification();
    }, [accounts]);

    return accounts && accounts.length ? (
        <>
            <Box {...styles.container} pb={`${distance + 50}px`}>
                <Text fontWeight="500">{t('auth.foundAccount')}: </Text>
                {accounts?.map((data, index) => (
                    <TouchableOpacity key={index} onPress={() => selectAccount(data)}>
                        <AccountItem
                            numberNoti={numberNoti[data._id] ? numberNoti[data._id] : 0}
                            data={{ ...data, index }}
                            onDeleteAccount={getAllAccounts}
                        />
                    </TouchableOpacity>
                ))}
            </Box>
            <Box h="25px"></Box>
        </>
    ) : null;
}

const styles = StyleSheet.create({
    container: {
        marginTop: '20px',
        width: '100%',
        justifyContent: 'flex-end',
        paddingTop: '12px',
        bg: '#F5F5F5',
        p: '16px',
        borderRadius: '8px',
    },
});
