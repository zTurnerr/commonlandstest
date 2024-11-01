import { Box, Text } from 'native-base';
import React from 'react';

/**
 * @typedef {{
 * text?: string
 * }} EmptyTextProps
 * @param {EmptyTextProps} param0
 * @returns {React.ReactElement}
 */
export default function EmptyText({ text = 'No data' }) {
    return (
        <Box justifyContent="center" alignItems="center" h="200px" w="full">
            <Text textAlign="center" fontSize="12px" color="gray.700" fontWeight="bold">
                {text}
            </Text>
        </Box>
    );
}
