import { IconButton } from 'native-base';
import React from 'react';
import Trash from '../Icons/Trash';

const DeleteIconButton = ({ onPress }) => {
    return (
        <IconButton onPress={onPress} borderRadius={'20px'}>
            <Trash height={20} width={20} />
        </IconButton>
    );
};

export default DeleteIconButton;
