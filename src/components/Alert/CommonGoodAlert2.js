import { Box, CloseIcon, HStack, Text, useTheme } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import CheckCircle from '../Icons/CheckCircle';

// Alert popup from bottom with green tick circle, text and close icon

export const showGoodAlert2 = (msg) => {
    EventRegister.emit(EVENT_NAME.goodAlert2, msg);
};

const CommonGoodAlert2 = () => {
    const [open, setOpen] = useState(false);
    const [msgState, setMsgState] = useState('');
    const theme = useTheme();

    useEffect(() => {
        const listener = EventRegister.addEventListener(EVENT_NAME.goodAlert2, (msg) => {
            setMsgState(msg);
            setOpen(true);
            setTimeout(() => {
                setOpen(false);
            }, 5000);
        });
        return () => {
            EventRegister.removeEventListener(listener);
        };
    }, []);

    if (!open) return null;
    return (
        <Box position={'absolute'} bottom={'40px'} px="16px" w="full">
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
                <CheckCircle color={theme.colors.primary[600]} />
                <Text flex={1} fontWeight={500}>
                    {msgState}
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

export default CommonGoodAlert2;
