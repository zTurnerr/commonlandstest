import { Box } from 'native-base';
import React from 'react';

const BottomWrapper = ({ children }) => {
    return (
        <Box
            position={'absolute'}
            bottom={0}
            zIndex={10}
            px={3}
            py={4}
            w={'full'}
            shadow={9}
            bg={'white'}
        >
            {children}
        </Box>
    );
};

export default BottomWrapper;
