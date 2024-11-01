import { Box, Icon, Text } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../../../components/Button';
import { TickCircle } from '../../../components/Icons';
import useTranslate from '../../../i18n/useTranslate';
import { CLAIMANTS_OPTIONS } from '../../../util/Constants';
import UserRow from './UserRow';

const RIGHT_PLOT = CLAIMANTS_OPTIONS;

export default function Index({
    ownerInfo,
    onPress,
    onOpenInviteSheet,
    role,
    setRole,
    // invitesPending,
}) {
    const t = useTranslate();

    return (
        <Box mt="12px" px="20px">
            <UserRow
                bg="primary.100"
                borderRadius="12px"
                px="12px"
                info={ownerInfo}
                type="creator"
                onPress={onPress}
            />
            <Box mb="33px" mt="16px">
                <Text fontWeight="bold">{t('plot.selectYourRight')}</Text>
                <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between">
                    {RIGHT_PLOT.map((item, index) => {
                        const active = role === item.value;
                        // const isDisabled = invitesPending?.some(
                        //     (i) => i.relationship === item.value
                        // );
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setRole(item.value)}
                                // disabled={isDisabled}
                            >
                                <Box
                                    flexDirection="row"
                                    mt="12px"
                                    bg={active ? 'primary.600' : 'transparent'}
                                    p="10px"
                                    justifyContent="center"
                                    alignItems="center"
                                    borderRadius="30px"
                                    px="20px"
                                    pl="30px"
                                    borderWidth="1px"
                                    minW="100px"
                                    // opacity={isDisabled ? 0.3 : 1}
                                    borderColor={active ? 'primary.600' : 'gray.300'}
                                >
                                    {active && (
                                        <TickCircle
                                            style={styles.tick}
                                            color={active ? 'white' : 'black'}
                                        />
                                    )}
                                    <Text fontWeight="500" color={active ? 'white' : 'black'}>
                                        {item.label}
                                    </Text>
                                </Box>
                            </TouchableOpacity>
                        );
                    })}
                </Box>
            </Box>
            <Box alignItems="center" bg="primary.100" p="12px" borderRadius="12px" py="16px">
                <Text fontWeight="bold" mb="16px" fontSize="14px" textAlign="center" px="26px">
                    {t('plot.contentInvite')}
                </Text>
                <Button
                    variant="outline"
                    leftIcon={
                        <Icon
                            as={<MaterialCommunityIcons name="account-plus-outline" />}
                            size={5}
                        ></Icon>
                    }
                    onPress={onOpenInviteSheet}
                >
                    {t('components.invitePeople2')}
                </Button>
            </Box>
        </Box>
    );
}

const styles = StyleSheet.create({
    tick: {
        marginRight: 8,
        position: 'absolute',
        left: 6,
    },
});
