import { HStack, Text } from 'native-base';
import React from 'react';

const RejectInvite = ({ text }) => {
    return (
        <HStack
            maxH="30px"
            p="5px"
            space={1}
            alignItems={'center'}
            borderRadius={'8px'}
            bg="danger.600"
        >
            <Text fontWeight={600} color="danger.500">
                {text}
            </Text>
        </HStack>
    );
};

export default RejectInvite;
