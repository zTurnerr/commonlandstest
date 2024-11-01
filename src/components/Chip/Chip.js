import { Box } from 'native-base';
import React from 'react';

const Chip = ({ children, ...others }) => {
    return (
        <Box
            flexDirection="row"
            alignItems="center"
            marginRight={'12px'}
            marginBottom={'12px'}
            h="34px"
            px="8px"
            borderRadius="30px"
            paddingRight={'16px'}
            {...others}
        >
            {children}
        </Box>
    );
};

export default Chip;
