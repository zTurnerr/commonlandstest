import { Avatar, Box, Icon, Text } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { removeAccount } from '../../../util/script';

export default function Index({ data, onDeleteAccount, numberNoti = 0 }) {
    const { fullName, phoneNumber = '', avatar } = data;
    const [loading, setLoading] = useState(false);

    const _onDeleteAccount = async () => {
        try {
            setLoading(true);
            await removeAccount(data.index);
            onDeleteAccount && onDeleteAccount();
        } catch (error) {}
        setLoading(false);
    };

    return (
        <Box {...styles.container}>
            <Box {...styles.avatar}>
                <Avatar source={{ uri: avatar }}>{fullName[0]}</Avatar>
                {numberNoti > 0 && (
                    <Box {...styles.notificationNumber}>
                        <Text fontSize="10px" color="white">
                            {numberNoti}
                        </Text>
                    </Box>
                )}
            </Box>
            <Box flex={1}>
                <Text fontSize="10px" fontWeight="bold">
                    {fullName}
                </Text>
                <Text fontSize="10px">
                    {phoneNumber.substr(0, 6) +
                        '...' +
                        phoneNumber.substr(phoneNumber.length - 3, phoneNumber.length + 1)}
                </Text>
            </Box>
            <TouchableOpacity onPress={_onDeleteAccount} disabled={loading}>
                <Box {...styles.buttonDelete}>
                    <Icon color="white" as={<MaterialCommunityIcons name="close" />} />
                </Box>
            </TouchableOpacity>
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        mt: '14px',
    },
    avatar: {
        width: '48px',
        height: '48px',
        borderRadius: '24px',
        alignItems: 'center',
        justifyContent: 'center',
        mr: '12px',
        bg: 'muted.300',
    },
    notificationNumber: {
        bg: 'warning.400',
        height: '16px',
        width: 'auto',
        minWidth: '16px',
        borderRadius: '8px',
        px: '4px',
        position: 'absolute',
        top: '-4px',
        left: '34px',
        alignItems: 'center',
    },
    buttonDelete: {
        width: '24px',
        height: '24px',
        bg: '#A8A8A8',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
    },
});
