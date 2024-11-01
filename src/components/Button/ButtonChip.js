import { Button } from 'native-base';
import React from 'react';

const ButtonChip = ({ children, bg = 'primary.600', onPress, ...others }) => {
    return (
        <Button
            variant={'unstyled'}
            flexDirection="row"
            alignItems="center"
            mb="4px"
            mr="12px"
            ml={'6px'}
            bg={bg}
            h="34px"
            px="8px"
            borderRadius="30px"
            onPress={onPress}
            {...others}
        >
            {children}
        </Button>
    );
};

export default ButtonChip;
