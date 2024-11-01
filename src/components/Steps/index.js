import { Box, Text } from 'native-base';

import React from 'react';

const Steps = ({ steps, step }) => {
    const w = 100 / steps.length;
    return (
        <Box flexDirection="row" mt="12px">
            {steps.map((item, index) => {
                return (
                    <Box key={index} w={`${w}%`} px="4px">
                        <Box h="4px" w="full" bg={index <= step ? 'primary.600' : 'gray.400'}></Box>
                        <Text
                            mt="10px"
                            fontSize="10px"
                            fontWeight="bold"
                            color={index <= step ? 'primary.600' : 'gray.400'}
                        >
                            {item.label}
                        </Text>
                    </Box>
                );
            })}
        </Box>
    );
};

export default Steps;
