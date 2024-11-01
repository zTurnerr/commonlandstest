import { Box, Button, Center, Text } from 'native-base';
import React from 'react';
import {
    closeCannotAttestModal,
    useCannotAttestModal,
} from '../../redux/reducer/modal/cannotAttestModalSlice';
import Danger from '../Icons/Danger';
import Modal from 'react-native-modal';
import useTranslate from '../../i18n/useTranslate';

const ModalCannotAttest = () => {
    const { isOpen, plotData } = useCannotAttestModal();
    const t = useTranslate();
    return (
        <Modal isVisible={isOpen} safeAreaTop={true}>
            <Box
                justifyContent="center"
                alignItems="center"
                p="20px"
                borderRadius="8px"
                bgColor="white"
            >
                <Center my="30px">
                    <Center w="48px" h="48px" borderRadius={'12px'} bgColor={'#E9BE271A'}>
                        <Danger width="24" height="24" color="#E9B90D" />
                    </Center>
                </Center>
                <Text mb="30px" textAlign={'center'} fontSize={'14px'} fontWeight={500}>
                    {t('plot.cannotAttest', {
                        plotName: plotData?.plot?.name,
                    })}
                </Text>
                <Button
                    onPress={() => {
                        closeCannotAttestModal();
                    }}
                    bgColor="primary.600"
                >
                    {t('button.done')}
                </Button>
            </Box>
        </Modal>
    );
};

export default ModalCannotAttest;
