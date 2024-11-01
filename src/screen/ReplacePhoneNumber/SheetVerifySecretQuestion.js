import { Box } from 'native-base';
import Modal from 'react-native-modal';
import VerifySecretQuestion from '../../components/VerifySecretQuestion';

import React, { useContext } from 'react';
import { UpdateSimContext } from '.';
export default function Index({ isOpen, onClose, setStep, phoneNumber }) {
    const updateSimContext = useContext(UpdateSimContext);
    return (
        <Modal isVisible={isOpen} safeAreaTop={true} onBackdropPress={onClose}>
            <Box
                justifyContent="center"
                alignItems="center"
                p="20px"
                borderRadius="8px"
                bgColor="white"
                position={'absolute'}
                bottom={'0px'}
                width={'100%'}
            >
                <VerifySecretQuestion
                    phoneNumber={phoneNumber}
                    noAuth={true}
                    onVerified={() => {
                        setStep(2);
                        onClose();
                    }}
                    getData={(data) => {
                        updateSimContext?.setSecretQuestionData(data);
                    }}
                    onCancel={onClose}
                />
            </Box>
        </Modal>
    );
}
