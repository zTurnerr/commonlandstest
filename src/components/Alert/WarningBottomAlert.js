import moment from 'moment';
import { Box, CloseIcon, HStack, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { EVENT_NAME } from '../../constants/eventName';
import useTranslate from '../../i18n/useTranslate';
import ClockCheck from '../Icons/ClockCheck';

let timer = null;
const WarningBottomAlert = ({ contract }) => {
    const [open, setOpen] = useState(false);
    const t = useTranslate();

    useEffect(() => {
        const listener = EventRegister.addEventListener(
            EVENT_NAME.alertChangeContractStatus,
            () => {
                clearTimeout(timer);
                setOpen(true);
                timer = setTimeout(() => {
                    setOpen(false);
                }, 5000);
            },
        );
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    if (!open) return null;
    return (
        <Box position={'absolute'} bottom={'10px'} px="16px" w="full" zIndex={10}>
            <HStack
                alignItems={'center'}
                justifyContent={'space-between'}
                w="full"
                px="16px"
                space={5}
                bg="white"
                shadow={9}
                py="12px"
                borderRadius={12}
            >
                <ClockCheck color="#DB990B" width="24" height="24" />
                <Text flex={1} fontWeight={500}>
                    {t('contract.waitToChangeContract', {
                        time: moment(contract.willMarkAt).fromNow(),
                    })}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        setOpen(false);
                    }}
                >
                    <CloseIcon />
                </TouchableOpacity>
            </HStack>
        </Box>
    );
};

export default WarningBottomAlert;
