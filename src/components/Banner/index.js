import { HStack, Text, useTheme } from 'native-base';
import React from 'react';

/**
 * @typedef {{
 * message: string
 * icon: import('react').ReactNode
 * colorScheme?: import('native-base/lib/typescript/components/types/utils').ColorSchemeType
 * action?: import('react').ReactNode
 * } & import('react').PropsWithChildren} BannerProps
 * @param {BannerProps} props
 * @returns {import('react').ReactElement}
 */
export default function Banner({ message, icon, colorScheme = 'primary', action, children }) {
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
        <HStack bgColor={colors.background} px="16px" py="12px" space="4px" alignItems="center">
            {React.cloneElement(icon, { color: colors.color })}
            <Text color={colors.color} fontWeight="medium" flex={1}>
                {children || message}
            </Text>
            {React.cloneElement(action, { color: colors.color })}
        </HStack>
    );
}
