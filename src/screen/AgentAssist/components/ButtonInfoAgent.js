import { Box, CloseIcon, Text, useTheme } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AgentAssistIcon, InfoAgentAssistIcon } from '../../../components/Icons';
import { useState } from 'react';
import Modal from 'react-native-modal';
import useTranslate from '../../../i18n/useTranslate';

const ButtonInfoAgent = () => {
    const [open, setOpen] = useState(false);
    const { colors } = useTheme();
    const t = useTranslate();
    const onOpen = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <TouchableOpacity onPress={onOpen}>
                <Box flexDirection="row" alignItems="center" mr="12px">
                    <InfoAgentAssistIcon color={colors.primary[500]} />
                </Box>
            </TouchableOpacity>
            <Modal isVisible={open} onBackdropPress={onClose} safeAreaTop={true}>
                <Box
                    borderRadius={'12px'}
                    shadow={2}
                    p={'25px'}
                    px={'20px'}
                    pb={'30px'}
                    bg={'white'}
                    position={'relative'}
                >
                    <TouchableOpacity onPress={onClose}>
                        <Box position={'absolute'} top={'-12px'} right={'-6px'}>
                            <CloseIcon />
                        </Box>
                    </TouchableOpacity>
                    <AgentAssistIcon color={colors.primary[500]} />
                    <Text mt={'12px'} fontWeight={600} fontSize={'14px'}>
                        {t('agentAssist.description')}
                    </Text>
                </Box>
            </Modal>
        </>
    );
};

export default ButtonInfoAgent;
