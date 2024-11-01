import { Box, Button } from 'native-base';

import React from 'react';
import { useTheme } from 'native-base';
const Primary = ({ children, _container = {}, variant, _text, ...other }) => {
    const theme = useTheme();
    return variant === 'outline' ? (
        <Button
            variant={variant}
            borderColor={'primary.600'}
            _text={_text}
            {...other}
            {..._container}
        >
            {children}
        </Button>
    ) : (
        <Box
            bgColor={theme.colors.buttonPrimary.bgColor}
            w="full"
            borderRadius="12px"
            overflow="hidden"
            h="48px"
            {..._container}
        >
            <Button
                bg="transparent"
                h="full"
                _text={{ ..._text, color: theme.colors.buttonPrimary.color }}
                {...other}
            >
                {children}
            </Button>
        </Box>
    );
};

const Secondary = ({ children, _container = {}, _text, ...other }) => {
    const theme = useTheme();
    return (
        <Button
            bg={theme.colors.buttonSecondary.bgColor}
            _text={{ ..._text, color: theme.colors.buttonSecondary.color }}
            {...other}
            {..._container}
        >
            {children}
        </Button>
    );
};

const CustomButton = ({ children, _container = {}, _text, textColor, ...other }) => {
    return (
        <Button _text={{ ..._text, color: textColor }} {...other} {..._container}>
            {children}
        </Button>
    );
};

export default function Index({ color = 'primary', ...other }) {
    switch (color) {
        case 'primary':
            return <Primary {...other} />;
        case 'secondary':
            return <Secondary {...other} />;
        case 'custom':
            return <CustomButton {...other} />;
        default:
            break;
    }
}
