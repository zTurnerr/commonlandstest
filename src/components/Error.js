import { Text } from 'native-base';
import React from 'react';

export default function Error({ children }) {
    if (!children) {
        return null;
    }
    return (
        <Text color="red.500" fontSize="10px" mt="4px">
            {children + ''}
        </Text>
    );
}
