import { useNavigation } from '@react-navigation/native';
import { Actionsheet, Box, CloseIcon, HStack, Stack, Text } from 'native-base';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import ClockForward from '../../../components/Icons/ClockForward';
import Send2 from '../../../components/Icons/Send2';
import ShieldSlash from '../../../components/Icons/ShieldSlash';
import Unlock from '../../../components/Icons/Unlock';
import Switch1 from '../../../components/Switch/Switch1';
import useUserInfo from '../../../hooks/useUserInfo';
import useTranslate from '../../../i18n/useTranslate';
import { contractIsDefaulted } from '../../../util/contract/isDefaulted';
import moment from 'moment';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../../constants/eventName';
import { toMillisecond } from '../../../util/time/getMiliSecond';
import FileLock02 from '../../../components/Icons/FileLock02';

export const useContractSettingSheet = () => {
    const [isOpen, setIsOpen] = useState(false);

    const Component = (
        props = {
            contract: {},
            onDelete: () => {},
            onUnlock: () => {},
            onChangeToDefault: () => {},
            onRequestUnlock: () => {},
            isPendingTransfer: false,
        },
    ) => {
        return (
            <ContractSettingSheet
                onUnlock={props.onUnlock}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onPress={() => {
                    setIsOpen(false);
                }}
                contract={props.contract}
                onDelete={props.onDelete}
                onRequestUnlock={props.onRequestUnlock}
                onChangeToDefault={props.onChangeToDefault}
                item={props.contract}
                isPendingTransfer={props.isPendingTransfer}
            />
        );
    };

    const close = () => {
        setIsOpen(false);
    };

    const open = () => {
        setIsOpen(true);
    };

    return {
        Component,
        close,
        open,
    };
};

export default function ContractSettingSheet({
    isOpen,
    onClose,
    onUnlock,
    onChangeToDefault,
    onRequestUnlock,
    item = {},
    isPendingTransfer,
}) {
    const navigation = useNavigation();
    const t = useTranslate();
    const user = useUserInfo();
    const isOwner = item?.creator?.user?._id === user?._id;
    const isSigner = item?.signers?.some((signer) => signer?.user?._id === user?._id);
    const canUnlock = item?.status === 'active' && isOwner && item?.markedStatus !== 'defaulted';
    const canRequestUnlock =
        item?.status === 'active' &&
        !isOwner &&
        !item?.requestToUnlock?.isPending &&
        item?.markedStatus !== 'defaulted';
    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
                <Stack
                    mb="30px"
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    px="30px"
                >
                    <Text w="full" textAlign={'left'} fontSize={'16px'} fontWeight={600}>
                        {t('contract.contractSetting')}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <CloseIcon color="black" />
                    </TouchableOpacity>
                </Stack>
                <Actionsheet.Item
                    onPress={() => {
                        navigation.navigate('ContractHistory', {
                            contract: item,
                        });
                    }}
                >
                    <HStack alignItems={'center'}>
                        <Box bg="primary.200" borderRadius={100} p="8px" mr="10px">
                            <ClockForward color="#5EC4AC" />
                        </Box>
                        <Text fontSize={'12px'} fontWeight={600}>
                            {t('contract.contractHistory')}
                        </Text>
                    </HStack>
                </Actionsheet.Item>
                {/* <Actionsheet.Item
                    onPress={() => {
                        navigation.navigate('CreateMtnInvoice');
                    }}
                >
                    <HStack alignItems={'center'}>
                        <Box bg="primary.200" borderRadius={100} p="8px" mr="10px">
                            <ReceiptEdit />
                        </Box>
                        <Text fontSize={'12px'} fontWeight={600}>
                            Request to pay
                        </Text>
                    </HStack>
                </Actionsheet.Item> */}
                {isOwner && (
                    <Actionsheet.Item
                        onPress={() => {
                            onClose();
                            navigation.navigate('TransferContract', {
                                contract: item,
                            });
                        }}
                        disabled={isPendingTransfer || item?.status === 'completed'}
                    >
                        <HStack alignItems={'center'}>
                            <Box bg="primary.200" borderRadius={100} p="8px" mr="10px">
                                <FileLock02 />
                            </Box>
                            <Text fontSize={'12px'} fontWeight={600}>
                                {t('contract.transferRights')}
                            </Text>
                        </HStack>
                    </Actionsheet.Item>
                )}
                {isOwner && (
                    <Actionsheet.Item
                        disabled={!canUnlock}
                        onPress={() => {
                            if (!canUnlock) return;
                            onUnlock?.();
                        }}
                    >
                        <HStack alignItems={'center'}>
                            <Box bg="primary.200" borderRadius={100} p="8px" mr="10px">
                                <Unlock color="#5EC4AC" />
                            </Box>
                            <Text fontSize={'12px'} fontWeight={600}>
                                {t('contract.closeContract')}
                            </Text>
                        </HStack>
                    </Actionsheet.Item>
                )}
                {isSigner && (
                    <Actionsheet.Item
                        disabled={!canRequestUnlock}
                        onPress={() => {
                            onRequestUnlock?.();
                        }}
                    >
                        <HStack alignItems={'center'}>
                            <Box bg="primary.200" borderRadius={100} p="8px" mr="10px">
                                <Send2 />
                            </Box>
                            <Text fontSize={'12px'} fontWeight={600}>
                                {t('contract.requestUnlockCert')}
                            </Text>
                        </HStack>
                    </Actionsheet.Item>
                )}
                {isOwner && (item?.status === 'active' || item?.status === 'defaulted') && (
                    <Actionsheet.Item
                        onPress={() => {
                            if (
                                !item?.willMarkAt ||
                                toMillisecond(item?.willMarkAt) < moment().valueOf()
                            ) {
                                onChangeToDefault?.();
                                return;
                            }
                            EventRegister.emit(EVENT_NAME.alertChangeContractStatus);
                            onClose();
                        }}
                        w="full"
                    >
                        <HStack alignItems={'center'} w="100%">
                            <Box bg="danger.1000" borderRadius={100} p="8px" mr="10px">
                                <ShieldSlash color="#AD1457" />
                            </Box>
                            <Text fontSize={'12px'} fontWeight={600} mr="30px">
                                {t('contract.markContract')}
                            </Text>
                            <Switch1 isOn={contractIsDefaulted(item)} />
                        </HStack>
                    </Actionsheet.Item>
                )}
                {/* <Actionsheet.Item
                    onPress={() => {
                        onDelete?.();
                    }}
                >
                    <HStack alignItems={'center'}>
                        <Box bg="muted.400" borderRadius={100} p="8px" mr="10px">
                            <Trash />
                        </Box>
                        <Text fontSize={'12px'} fontWeight={600}>
                            Delete {t('components.contract')}
                        </Text>
                    </HStack>
                </Actionsheet.Item> */}
            </Actionsheet.Content>
        </Actionsheet>
    );
}
