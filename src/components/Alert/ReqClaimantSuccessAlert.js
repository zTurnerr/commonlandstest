import { Box, CloseIcon, HStack, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { EVENT_NAME } from '../../constants/eventName';
import useTranslate from '../../i18n/useTranslate';
import { TickCircle } from '../Icons';

// Alert popup from bottom with green tick circle, text and close icon
const ReqClaimantSuccessAlert = () => {
    const [open, setOpen] = useState(false);
    const t = useTranslate();

    useEffect(() => {
        const listener = EventRegister.addEventListener(EVENT_NAME.reqClaimantSuccess, () => {
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
        <Box position={'absolute'} bottom={'10px'} px="16px" w="full">
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
                <TickCircle color="#2AB848" />
                <Text flex={1} fontWeight={500}>
                    {t('plot.requestSent')}
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

export default ReqClaimantSuccessAlert;
