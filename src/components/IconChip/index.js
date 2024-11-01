import { HStack, Text, useTheme } from 'native-base';
import React, { cloneElement } from 'react';

/**
 * @typedef {{
 * icon: import('react').ReactNode
 * text: string
 * colorScheme?: import('native-base/lib/typescript/components/types/utils').ColorSchemeType
 * } & import('native-base').IBoxProps} IconChipProps
 * @param {IconChipProps} props
 */
export default function IconChip({ icon, text, colorScheme = 'primary', ...props }) {
    const theme = useTheme();

    const colors = {
        background: theme.colors[colorScheme][100],
        color: theme.colors[colorScheme][300],
    };

    if (colorScheme === 'warning') {
        colors.background = '#FABD3A10';
        colors.color = '#DB990B';
    }

    return (
        <HStack
            bg={colors.background}
            py="2px"
            px="8px"
            borderRadius="sm"
            alignItems="center"
            space="4px"
            {...props}
        >
            {cloneElement(icon, {
                color: colors.color,
            })}
            <Text fontSize="12px" fontWeight="600" color={colors.color}>
                {text}
            </Text>
        </HStack>
    );
}
