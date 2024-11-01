import { Box, CloseIcon, HStack, IconButton, Text, useTheme } from 'native-base';
import React, { useEffect, useState } from 'react';
import { SCREEN_WIDTH } from '../../util/Constants';
import { TickCircle } from '../Icons';

export const useNotification2 = () => {
    const [show, setShow] = useState(false);
    const [text, setText] = useState('');
    useEffect(() => {
        setTimeout(() => {
            setShow(false);
        }, 3000);
    }, [show]);

    const showNotification = (text) => {
        setText(text);
        setShow(true);
    };

    const Component = () => {
        return <NotificationComponent text={text} show={show} setShow={setShow} />;
    };

    return {
        Component,
        showNotification,
    };
};

export const NotificationComponent = ({ text, show, setShow }) => {
    const theme = useTheme();
    if (!show) return null;
    return (
        <Box
            position={'absolute'}
            bottom="20px"
            left="0px"
            right="0px"
            w={SCREEN_WIDTH}
            pb="15px"
            px="20px"
            zIndex={10}
        >
            <HStack p="13px" alignItems={'center'} bg="white" borderRadius={'13px'} shadow={9}>
                <TickCircle color={theme.colors.primary['1000']} />
                <Text flex={1} ml="13px" fontSize={'14px'} fontWeight={600}>
                    {text}
                </Text>
                <IconButton
                    onPress={() => setShow(false)}
                    icon={<CloseIcon color="gray.500" />}
                    borderRadius={'full'}
                    size={'sm'}
                    color="black"
                />
            </HStack>
        </Box>
    );
};
