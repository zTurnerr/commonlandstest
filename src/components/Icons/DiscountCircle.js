import { useTheme } from 'native-base';
import React from 'react';
import { Path, Svg } from 'react-native-svg';

export default function DiscountCircle({ color = '#5EC4AC', width = '48', height = '48' }) {
    const theme = useTheme();
    const currentColor = color ? color : theme.colors.darkText;
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                stroke={currentColor}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20ZM18 30l12-12M28.989 29h.018M18.989 19h.018"
            />
        </Svg>
    );
}
