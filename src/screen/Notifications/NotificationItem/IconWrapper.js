import { Box } from 'native-base';
import React from 'react';

export default function Index({ children, ...other }) {
    return (
        <Box
            mr="8px"
            alignItems="center"
            justifyContent="center"
            bgColor="#5EC4AC1A"
            w="44px"
            h="44px"
            borderRadius="22px"
            {...other}
        >
            {children}
        </Box>
    );
}
