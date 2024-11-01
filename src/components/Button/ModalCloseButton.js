import React from 'react';
import { IconButton, CloseIcon } from 'native-base';

const ModalCloseButton = ({ onClose }) => {
    return (
        <IconButton
            _pressed={{
                bg: 'transparent',
                opacity: 0.3,
            }}
            onPress={onClose}
            position={'absolute'}
            right={2}
            top={2}
        >
            <CloseIcon color="#49454F" />
        </IconButton>
    );
};

export default ModalCloseButton;
